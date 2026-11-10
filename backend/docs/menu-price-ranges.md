# Menu price ranges

Apply [`20261109_menu_price_ranges.sql`](../src/db/migrations/20261109_menu_price_ranges.sql) once to an existing PostgreSQL database. A fresh database created from [`script DB.sql`](../src/db/migrations/script%20DB.sql) already includes the same definitions.

Each restaurant basket consists of one main course (`Plato Fuerte`) and one nonalcoholic drink (`Bebida No Alcohólica`). The minimum is the average of up to three cheapest available items in each group, summed and rounded to two decimals. The maximum uses up to three most expensive available items in each group. The calculation includes only active menus and `NIO` prices. If either group is empty, both values are `NULL`; no estimate is presented as a complete basket.

PostgreSQL recalculates `locales_comerciales.precio_minimo` and `precio_maximo` when a menu item is inserted, changed, or deleted, and when a menu is moved, deactivated, activated, or deleted. The migration recalculates existing locals and replaces any manually entered values. Existing items without `id_categoria_menu` must be categorized before they contribute to a range.

API usage:

- `GET /api/menu-categories`: lists valid category IDs for `id_categoria_menu` when creating menu items.
- `POST /api/items_menu`: requires `id_categoria_menu`; `PATCH /api/items_menu/:id` can change it; `DELETE /api/items_menu/:id` removes an item.
- `GET /api/locales_comerciales`: returns stored `precio_minimo` and `precio_maximo` for each local.
- `GET /api/locales_comerciales?max_budget=250`: returns locals whose minimum complete basket costs at most 250 NIO. Locals with an incomplete basket are excluded from a budgeted result.
- `GET /api/lugares_turisticos/buscar?max_budget=250`: returns tourist places that have at least one associated local with a complete basket costing at most 250 NIO. Each place includes server-provided `precio_minimo` and `precio_maximo` values. The search page loads these results in one request and only renders the amounts.

The client renders the returned prices and does not calculate menu totals.

The current schema associates commercial locals with tourist complexes through `id_complejo_padre`. An independent local has no tourist-place relation, so it appears in `/api/locales_comerciales` but cannot appear as a priced tourist place in `/api/lugares_turisticos/buscar` until such a relation is defined.
