-- Ejecutar una vez en una base existente. En una base nueva, estas definiciones
-- ya están incluidas en script DB.sql.
BEGIN;

CREATE INDEX IF NOT EXISTS menus_id_local_budget_idx
    ON public.menus (id_local, id_menu) WHERE esta_activo IS TRUE;
CREATE INDEX IF NOT EXISTS items_menu_budget_idx
    ON public.items_menu (id_menu, id_categoria_menu, precio)
    WHERE esta_disponible IS TRUE AND moneda = 'NIO';
CREATE INDEX IF NOT EXISTS locales_comerciales_precio_minimo_idx
    ON public.locales_comerciales (precio_minimo)
    WHERE precio_minimo IS NOT NULL;
CREATE INDEX IF NOT EXISTS locales_comerciales_complejo_budget_idx
    ON public.locales_comerciales (id_complejo_padre, precio_minimo, precio_maximo)
    WHERE precio_minimo IS NOT NULL;

CREATE OR REPLACE FUNCTION public.recalculate_local_price_range(p_local_id INTEGER)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    v_minimum NUMERIC(10,2);
    v_maximum NUMERIC(10,2);
BEGIN
    -- Serializa los recálculos concurrentes del mismo local.
    PERFORM 1 FROM public.locales_comerciales
    WHERE id_local = p_local_id FOR UPDATE;
    IF NOT FOUND THEN RETURN; END IF;

    WITH ranked AS (
        SELECT i.precio,
               CASE WHEN c.nombre = 'Plato Fuerte' THEN 'food' ELSE 'drink' END AS item_type,
               ROW_NUMBER() OVER (PARTITION BY c.nombre ORDER BY i.precio ASC, i.id_item) AS cheapest_rank,
               ROW_NUMBER() OVER (PARTITION BY c.nombre ORDER BY i.precio DESC, i.id_item) AS priciest_rank
        FROM public.items_menu AS i
        JOIN public.menus AS m ON m.id_menu = i.id_menu
        JOIN public.categorias_menu AS c ON c.id_categoria_menu = i.id_categoria_menu
        WHERE m.id_local = p_local_id
          AND m.esta_activo IS TRUE
          AND i.esta_disponible IS TRUE
          AND i.moneda = 'NIO'
          AND c.nombre IN ('Plato Fuerte', 'Bebida No Alcohólica')
    ), averages AS (
        SELECT AVG(precio) FILTER (WHERE item_type = 'food' AND cheapest_rank <= 3) AS food_minimum,
               AVG(precio) FILTER (WHERE item_type = 'drink' AND cheapest_rank <= 3) AS drink_minimum,
               AVG(precio) FILTER (WHERE item_type = 'food' AND priciest_rank <= 3) AS food_maximum,
               AVG(precio) FILTER (WHERE item_type = 'drink' AND priciest_rank <= 3) AS drink_maximum
        FROM ranked
    )
    SELECT CASE WHEN food_minimum IS NOT NULL AND drink_minimum IS NOT NULL
                THEN ROUND(food_minimum + drink_minimum, 2) END,
           CASE WHEN food_maximum IS NOT NULL AND drink_maximum IS NOT NULL
                THEN ROUND(food_maximum + drink_maximum, 2) END
      INTO v_minimum, v_maximum
      FROM averages;

    UPDATE public.locales_comerciales
       SET precio_minimo = v_minimum, precio_maximo = v_maximum
     WHERE id_local = p_local_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_price_range_from_item()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_old_local INTEGER;
    v_new_local INTEGER;
    v_local INTEGER;
BEGIN
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        SELECT id_local INTO v_old_local FROM public.menus WHERE id_menu = OLD.id_menu;
    END IF;
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        SELECT id_local INTO v_new_local FROM public.menus WHERE id_menu = NEW.id_menu;
    END IF;
    FOR v_local IN
        SELECT DISTINCT id_local
        FROM (VALUES (v_old_local), (v_new_local)) AS affected(id_local)
        WHERE id_local IS NOT NULL ORDER BY id_local
    LOOP
        PERFORM public.recalculate_local_price_range(v_local);
    END LOOP;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS items_menu_price_range_trigger ON public.items_menu;
CREATE TRIGGER items_menu_price_range_trigger
AFTER INSERT OR UPDATE OF id_menu, precio, moneda, esta_disponible, id_categoria_menu OR DELETE ON public.items_menu
FOR EACH ROW EXECUTE FUNCTION public.refresh_price_range_from_item();

CREATE OR REPLACE FUNCTION public.refresh_price_range_from_menu()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_local INTEGER;
    v_new_local INTEGER;
BEGIN
    IF TG_OP = 'UPDATE' THEN v_new_local := NEW.id_local; END IF;
    FOR v_local IN
        SELECT DISTINCT id_local
        FROM (VALUES (OLD.id_local), (v_new_local)) AS affected(id_local)
        WHERE id_local IS NOT NULL ORDER BY id_local
    LOOP
        PERFORM public.recalculate_local_price_range(v_local);
    END LOOP;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS menus_price_range_trigger ON public.menus;
CREATE TRIGGER menus_price_range_trigger
AFTER UPDATE OF id_local, esta_activo OR DELETE ON public.menus
FOR EACH ROW EXECUTE FUNCTION public.refresh_price_range_from_menu();

-- Sustituye presupuestos manuales anteriores por el cálculo real del menú.
DO $$
DECLARE v_local INTEGER;
BEGIN
    FOR v_local IN SELECT id_local FROM public.locales_comerciales ORDER BY id_local LOOP
        PERFORM public.recalculate_local_price_range(v_local);
    END LOOP;
END;
$$;

COMMIT;
