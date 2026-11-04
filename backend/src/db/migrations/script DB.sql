-- 1. Crear la base de datos
CREATE DATABASE sinatur_bd;

-- (Conéctate a la base de datos sinatur_bd antes de ejecutar lo siguiente)

-- 2. Tabla principal de Usuarios (Base para herencia)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    telefono VARCHAR(30)
);

-- 3. Tabla Turistas (Hereda de Usuarios)
CREATE TABLE turistas (
    id_turista SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    pais_origen VARCHAR(100) NOT NULL
);

-- 4. Tabla Propietarios de Negocios (Hereda de Usuarios)
CREATE TABLE propietarios_negocios (
    id_propietario SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    estado_verificacion VARCHAR(50) NOT NULL DEFAULT 'Pendiente'
);

-- 5. Tabla Administradores (Hereda de Usuarios)
CREATE TABLE administradores (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    rol VARCHAR(100) NOT NULL DEFAULT 'Administrador'
);

-- 6. Tabla Categorías (Independiente)
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono_url VARCHAR(255)
);

-- 7. Tabla Lugar Turístico (Tabla base para complejos y atractivos)
CREATE TABLE lugares_turisticos (
    id_lugar SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    departamento VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    direccion_exacta TEXT,
    maps_link VARCHAR(255)
);

-- 8. Tabla Imágenes de Lugares (Depende de Lugares Turísticos)
CREATE TABLE imagenes_lugares (
    id_imagen SERIAL PRIMARY KEY,
    id_lugar INTEGER NOT NULL REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_subida DATE DEFAULT CURRENT_DATE
);

-- 9. Tabla Horarios (Depende de Lugares Turísticos)
CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    id_lugar INTEGER NOT NULL REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    dia_semama VARCHAR(20) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    es_feriado BOOLEAN DEFAULT FALSE
);

-- 10. Tabla Reseñas (Depende de Turistas y Lugares)
CREATE TABLE resenas (
    id_resena SERIAL PRIMARY KEY,
    id_turista INTEGER NOT NULL REFERENCES turistas(id_turista) ON DELETE CASCADE,
    id_lugar INTEGER NOT NULL REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_publicacion DATE DEFAULT CURRENT_DATE,
    respuesta_propietario TEXT,
    estado_moderacion VARCHAR(50) DEFAULT 'Pendiente'
);

-- 11. Tabla Favoritos (Depende de Turistas y Lugares)
CREATE TABLE favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_turista INTEGER NOT NULL REFERENCES turistas(id_turista) ON DELETE CASCADE,
    id_lugar INTEGER NOT NULL REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    fecha_guardado DATE DEFAULT CURRENT_DATE,
    CONSTRAINT unique_turista_lugar UNIQUE (id_turista, id_lugar)
);

-- 12. Tabla Complejos Turísticos (Hereda de Lugares Turísticos)
CREATE TABLE complejos_turisticos (
    id_lugar INTEGER PRIMARY KEY REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    capacidad_locales INTEGER,
    cobro_entrada BOOLEAN DEFAULT FALSE,
    id_administrador INTEGER REFERENCES propietarios_negocios(id_propietario),
    costo_entrada NUMERIC(10, 2)
);

-- 13. Tabla Atractivos Independientes (Hereda de Lugares Turísticos)
CREATE TABLE atractivos_independientes (
    id_lugar INTEGER PRIMARY KEY REFERENCES lugares_turisticos(id_lugar) ON DELETE CASCADE,
    tipo_acceso VARCHAR(100),
    entidad_encargada VARCHAR(150),
    id_administrador INTEGER REFERENCES propietarios_negocios(id_propietario),
    normativa_visitantes TEXT
);

-- 14. Tabla Locales Comerciales (Depende de Propietarios, Complejos y Categorías)
CREATE TABLE locales_comerciales (
    id_local SERIAL PRIMARY KEY,
    codigo_ruc VARCHAR(50) UNIQUE NOT NULL,
    id_dueno INTEGER NOT NULL REFERENCES propietarios_negocios(id_propietario) ON DELETE CASCADE,
    id_complejo_padre INTEGER REFERENCES complejos_turisticos(id_lugar) ON DELETE SET NULL,
    es_independiente BOOLEAN DEFAULT TRUE,
    precio_minimo NUMERIC(10, 2),
    precio_maximo NUMERIC(10, 2),
    id_categoria INTEGER REFERENCES categorias(id_categoria)
);

-- 15. Tabla Eventos Nacionales (Depende opcionalmente de Lugares Turísticos)
CREATE TABLE eventos_nacionales (
    id_evento SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    departamento VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    direccion_referencia TEXT,
    tipo_evento VARCHAR(100),
    costo_entrada NUMERIC(10, 2),
    es_gratuito BOOLEAN DEFAULT FALSE,
    es_anual_recurrente BOOLEAN DEFAULT FALSE,
    id_lugar_asociado INTEGER REFERENCES lugares_turisticos(id_lugar) ON DELETE SET NULL,
    estado VARCHAR(50) DEFAULT 'Programado'
);

-- 16. Tabla Servicios (Depende de Locales Comerciales)
CREATE TABLE servicios (
    id_servicio SERIAL PRIMARY KEY,
    id_local INTEGER NOT NULL REFERENCES locales_comerciales(id_local) ON DELETE CASCADE,
    nombre_servicio VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'NIO',
    tipo_cobro VARCHAR(50),
    incluye TEXT,
    duracion_estimada VARCHAR(50),
    esta_disponible BOOLEAN DEFAULT TRUE
);

-- 17. Tabla Menús (Depende de Locales Comerciales)
CREATE TABLE menus (
    id_menu SERIAL PRIMARY KEY,
    id_local INTEGER NOT NULL REFERENCES locales_comerciales(id_local) ON DELETE CASCADE,
    titulo_menu VARCHAR(150) NOT NULL,
    descripcion TEXT,
    esta_activo BOOLEAN DEFAULT TRUE
);

-- 18. Tabla Ítems de Menú (Depende de Menús)
CREATE TABLE items_menu (
    id_item SERIAL PRIMARY KEY,
    id_menu INTEGER NOT NULL REFERENCES menus(id_menu) ON DELETE CASCADE,
    nombre_platillo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'NIO',
    url_foto VARCHAR(255),
    es_vegetariano BOOLEAN DEFAULT FALSE,
    esta_disponible BOOLEAN DEFAULT TRUE
);

-- 19. Tabla Solicitudes de Registros (Depende de Propietarios)
CREATE TABLE solicitudes_registros (
    id_solicitud SERIAL PRIMARY KEY,
    id_dueno INTEGER NOT NULL REFERENCES propietarios_negocios(id_propietario) ON DELETE CASCADE,
    id_administrador INTEGER REFERENCES propietarios_negocios(id_propietario),
    fecha_solicitud DATE DEFAULT CURRENT_DATE,
    documentos_adjuntos TEXT,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    observaciones TEXT
);

-- 20. Tabla Campañas Publicitarias (Depende de Locales Comerciales)
CREATE TABLE campanias_publicitarias (
    id_campania SERIAL PRIMARY KEY,
    id_local INTEGER NOT NULL REFERENCES locales_comerciales(id_local) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_total NUMERIC(10, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'NIO',
    estado VARCHAR(50) DEFAULT 'Activa'
);

-- 21. Tabla Pagos de Publicidad (Depende de Campañas y Propietarios)
CREATE TABLE pagos_publicidad (
    id_pago SERIAL PRIMARY KEY,
    id_campania INTEGER NOT NULL REFERENCES campanias_publicitarias(id_campania) ON DELETE CASCADE,
    id_dueno INTEGER REFERENCES propietarios_negocios(id_propietario),
    id_administrador INTEGER REFERENCES propietarios_negocios(id_propietario),
    monto NUMERIC(10, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'NIO',
    metodo_pago VARCHAR(50),
    numero_referencia VARCHAR(100),
    comprobante_url VARCHAR(255),
    fecha_pago DATE DEFAULT CURRENT_DATE,
    estado_pago VARCHAR(50) DEFAULT 'Pendiente'
);