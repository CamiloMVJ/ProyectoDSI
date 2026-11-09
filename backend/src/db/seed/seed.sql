-- Archivo: seed_sinaturbd.sql
-- Ejecutar en la base de datos sinatur_bd

-- 1. Tabla Usuarios
INSERT INTO usuarios (nombre_completo, email, password_hash, fecha_registro, telefono) VALUES
('Carlos Alberto Fuentes', 'carlos.fuentes@gmail.com', 'scrypt$1234567890abcdef$1234567890abcdef1234567890abcdef', '2023-10-15', '+505 8888 1111'),
('María Fernanda López', 'maria.lopez@yahoo.com', 'scrypt$abcdef1234567890$abcdef1234567890abcdef1234567890', '2023-11-20', '+505 7777 2222'),
('José Manuel Torres', 'jmtorres.admin@sinatur.gob.ni', 'scrypt$0987654321fedcba$0987654321fedcba0987654321fedcba', '2023-01-10', '+505 8888 3333');

-- 2. Tabla Turistas
INSERT INTO turistas (id_usuario, pais_origen) VALUES
(1, 'Costa Rica');

-- 3. Tabla Propietarios de Negocios
INSERT INTO propietarios_negocios (id_usuario, estado_verificacion) VALUES
(2, 'Verificado');

-- 4. Tabla Administradores
INSERT INTO administradores (id_usuario, rol) VALUES
(3, 'Administrador');

-- 5. Tabla Categorías
INSERT INTO categorias (nombre, descripcion, icono_url) VALUES
('Hospedajes', 'Lugares para alojamiento y descanso.', 'https://iconos.com/hospedaje.png'),
('Restaurantes', 'Establecimientos de comida y bebida.', 'https://iconos.com/restaurante.png');

-- 6. Tabla Lugares Turísticos
INSERT INTO lugares_turisticos (nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link) VALUES
('Hotel y Restaurante La Gran Vista', 'Complejo turístico con vista a la laguna de Apoyo.', (SELECT id_departamento FROM departamentos WHERE nombre = 'Masaya'), 'Catarina', 'Mirador de Catarina, 200m al sur', 'https://maps.google.com/?q=laguna+apoyo'),
('Mirador de Catarina', 'Atractivo natural con vista panorámica a la laguna de Apoyo.', (SELECT id_departamento FROM departamentos WHERE nombre = 'Masaya'), 'Catarina', 'Centro de Catarina', 'https://maps.google.com/?q=mirador+catarina');

-- 7. Tabla Complejos Turísticos
INSERT INTO complejos_turisticos (id_lugar, capacidad_locales, cobro_entrada, id_administrador, costo_entrada) VALUES
(1, 5, TRUE, 1, 50.00);

-- 8. Tabla Atractivos Independientes
INSERT INTO atractivos_independientes (id_lugar, tipo_acceso, entidad_encargada, id_administrador, normativa_visitantes) VALUES
(2, 'Público', 'Alcaldía de Catarina', NULL, 'Prohibido tirar basura. Horario de acceso libre.');

-- 9. Tabla Locales Comerciales
INSERT INTO locales_comerciales (codigo_ruc, id_dueno, id_complejo_padre, es_independiente, precio_minimo, precio_maximo, id_categoria) VALUES
('J0310000111222', 1, 1, FALSE, 200.00, 1500.00, 1);

-- 10. Tabla Imágenes de Lugares
INSERT INTO imagenes_lugares (id_lugar, url_imagen, descripcion, fecha_subida) VALUES
(1, 'https://imagenes.com/laguna_apoyo_1.jpg', 'Vista desde la terraza', '2024-01-10'),
(2, 'https://imagenes.com/mirador_catarina.jpg', 'Vista panorámica principal', '2024-02-15');

-- 11. Tabla Horarios
INSERT INTO horarios (id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado) VALUES
(1, 'Lunes a Domingo', '08:00', '22:00', FALSE),
(2, 'Lunes a Domingo', '06:00', '18:00', TRUE);

-- 12. Tabla Reseñas
INSERT INTO resenas (id_turista, id_lugar, calificacion, comentario, fecha_publicacion, respuesta_propietario, estado_moderacion) VALUES
(1, 1, 5, 'Excelente vista y servicio de primera.', '2024-03-01', '¡Gracias por su visita, Carlos!', 'Aprobado');

-- 13. Tabla Favoritos
INSERT INTO favoritos (id_turista, id_lugar, fecha_guardado) VALUES
(1, 1, '2024-03-01');

-- 14. Tabla Eventos Nacionales
INSERT INTO eventos_nacionales (titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, id_departamento, municipio, direccion_referencia, tipo_evento, costo_entrada, es_gratuito, es_anual_recurrente, id_lugar_asociado, estado) VALUES
('Feria de Artesanía', 'Exposición de artesanías locales y gastronomía.', '2026-11-15', '2026-11-20', '09:00', '17:00', (SELECT id_departamento FROM departamentos WHERE nombre = 'Masaya'), 'Masaya', 'Parque Central de Masaya', 'Cultural', 0.00, TRUE, TRUE, NULL, 'Programado');

-- 15. Tabla Servicios
INSERT INTO servicios (id_local, nombre_servicio, descripcion, precio, moneda, tipo_cobro, incluye, duracion_estimada, esta_disponible) VALUES
(1, 'Habitación Doble', 'Habitación con vista a la laguna, incluye desayuno.', 1200.00, 'NIO', 'Por noche', 'Desayuno, WiFi, Piscina', '24 horas', TRUE);

-- 16. Tabla Menús
INSERT INTO menus (id_local, titulo_menu, descripcion, esta_activo) VALUES
(1, 'Menú Ejecutivo', 'Opciones de almuerzo tradicional.', TRUE);

-- 17. Tabla Ítems de Menú
INSERT INTO items_menu (id_menu, nombre_platillo, descripcion, precio, moneda, url_foto, es_vegetariano, esta_disponible) VALUES
(1, 'Vigorón Tradicional', 'Yuca, chicharrón y ensalada de repollo.', 150.00, 'NIO', 'https://imagenes.com/vigoron.jpg', FALSE, TRUE);

-- 18. Tabla Solicitudes de Registros
INSERT INTO solicitudes_registros (id_dueno, id_administrador, fecha_solicitud, documentos_adjuntos, estado, observaciones) VALUES
(1, 1, '2023-11-01', 'https://docs.com/registro_hotel.pdf', 'Aprobado', 'Cumple con todos los requisitos.');

-- 19. Tabla Campañas Publicitarias
INSERT INTO campanias_publicitarias (id_local, fecha_inicio, fecha_fin, monto_total, moneda, estado) VALUES
(1, '2026-12-01', '2026-12-31', 5000.00, 'NIO', 'Activa');

-- 20. Tabla Pagos de Publicidad
INSERT INTO pagos_publicidad (id_campania, id_dueno, id_administrador, monto, moneda, metodo_pago, numero_referencia, comprobante_url, fecha_pago, estado_pago) VALUES
(1, 1, 1, 5000.00, 'NIO', 'Transferencia Bancaria', 'REF-99887766', 'https://docs.com/comprobante_5000.pdf', '2026-11-28', 'Aprobado');
