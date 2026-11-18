-- DEPARTAMENTO DE BOACO
--1. Finca Turística Santa Matilde – Mombachito
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Finca Turística Santa Matilde – Mombachito',
        'Finca turística que ofrece senderismo, recorridos por la Reserva Natural Mombachito - Cerro La Vieja y actividades recreativas.',
        'Camoapa',
        'La Rinconada, zona de la Reserva Natural Mombachito, Camoapa, Boaco, Nicaragua.',
        'https://maps.app.goo.gl/nEQvbQykbMq5vStQ9',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Comunidad Las Lagunas
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Comunidad Las Lagunas',
        'Comunidad reconocida por sus petrograbados, senderos, gastronomía y miradores con paisajes naturales.',
        'Boaco',
        'Comunidad rural a unos 12 km de la ciudad de Boaco',
        'https://maps.app.goo.gl/QxXGJBzxQWY4ZYNj9',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Salto La Chorrera
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto La Chorrera',
        'Cascada natural que ofrece senderismo, avistamiento de aves, paisajes montañosos y miradores naturales.',
        'San José de los Remates',
        'Sector La Chorrera, San José de los Remates, Boaco, Nicaragua.',
        'https://maps.app.goo.gl/Gir9BA4V8DTa8EgN8',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Finca Turística Buena Vista
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Finca Turística Buena Vista',
        'Finca turística que ofrece senderismo, actividades ganaderas, gastronomía y recorridos para observar petroglifos.',
        'Boaco',
        'Comarca Las Lagunas, municipio de Boaco, Nicaragua.',
        'https://maps.app.goo.gl/6LpvCmwKNQ8yPZZ57',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Paseo de los Poetas
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Paseo de los Poetas',
        'Espacio cultural y turístico que permite disfrutar de vistas panorámicas de la ciudad, descansar y tomar fotografías.',
        'Boaco',
        'Ciudad de Boaco, departamento de Boaco, Nicaragua.',
        'https://maps.app.goo.gl/kJhhD6UdmoQe79xa6',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Parque Municipal de Teustepe
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Municipal de Teustepe',
        'Parque público destinado a la recreación, el descanso y la convivencia de las familias y visitantes.',
        'Teustepe',
        'Centro urbano de Teustepe, Boaco, Nicaragua.',
        'https://maps.app.goo.gl/YAmhJMTZAgF86tsv5',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Parque Municipal San Lorenzo
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Municipal San Lorenzo',
        'Parque central del municipio, espacio público para el descanso, la convivencia y las actividades comunitarias.',
        'San Lorenzo',
        'Parque Central, carretera NN-102, San Lorenzo, Boaco, Nicaragua.',
        'https://maps.app.goo.gl/G98SfDBxH8JRqr1T6',
        1
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE CARAZO 
-- 1. Reserva Silvestre Privada Tonantzin
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Silvestre Privada Tonantzin',
        'Reserva natural privada que ofrece senderismo, observación de aves, petroglifos, actividades agroecológicas y educación ambiental.',
        'Diriamba',
        'Km 58.5, carretera Diriamba-La Boquita, comunidad La Trinidad, Carazo, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Reserva+Silvestre+Privada+Tonantzin+La+Trinidad+Carazo',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Reserva Silvestre Privada FRANIN
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Silvestre Privada FRANIN',
        'Reserva natural que ofrece recorridos por senderos, observación de aves y paseos a caballo.',
        'Jinotepe',
        'Da la escuela Carlos Salinas 500 mt al norte.',
        'https://maps.app.goo.gl/kY9r4eDkFyL5a1K98',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Salto La Culebra
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto La Culebra',
        'Atractivo natural con cascadas, pozas para bañarse, recorridos comunitarios y observación del paisaje.',
        'Diriamba',
        'QMQ8+R3J, Diriamba, Carazo, Nicaragua.',
        'https://maps.app.goo.gl/xaorkxXHp8L7XAid9',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Cascada El Bosque
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cascada El Bosque',
        'Cascada natural que ofrece senderismo, observación de aves y espacios para disfrutar del agua y el contacto con la naturaleza.',
        'Jinotepe',
        'Comunidad El Bosque, Jinotepe, Carazo, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Cascada+El+Bosque+Jinotepe+Carazo',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Reserva Silvestre Privada Naturaleza de la Paz
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Silvestre Privada Naturaleza de la Paz',
        'La reserva alberga variedad de flora y fauna, ofrece actividades como senderismo, caminatas nocturnas y visitas guiadas. Ademas cuenta con un zoocriadero y un huerto de hortalizas.',
        'La paz',
        'Del pozo Enacal #1, 200 metros el este, La Paz, Carazo. Nicaragua.',
        'https://maps.app.goo.gl/qAwzxQFA1MzGwnox9',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Centro Turístico La Boquita
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Centro Turístico La Boquita',
        'Destino turístico de playa que ofrece actividades recreativas, restaurantes, hospedaje y espacios para disfrutar del paisaje costero.',
        'Diriamba',
        'carretera NN-285, comunidad La Boquita, Diriamba, Carazo, Nicaragua.',
        'https://maps.app.goo.gl/XHNRAAeg4dLadGmM8',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Refugio de Vida Silvestre Río Escalante Chacocente
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Refugio de Vida Silvestre Río Escalante Chacocente',
        'Área protegida dedicada a la conservación de ecosistemas costeros, protección de tortugas marinas, senderismo y educación ambiental.',
        'Santa Teresa',
        'Aguas Calientes de Acayo, municipio de Santa Teresa, Carazo, Nicaragua.',
        'https://maps.app.goo.gl/5yL8qickYCP6LbKy8',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Playa Huehuete
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa Huehuete',
        'Playa del Pacífico nicaragüense ideal para disfrutar del paisaje costero, realizar actividades recreativas, pesca y contemplar el entorno natural.',
        'Jinotepe',
        'Comunidad Huehuete, departamento de Carazo, Nicaragua.',
        'https://maps.app.goo.gl/bgTRSQkXHatdshq39',
        2
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE CHINANDEGA
-- 1. Tour Flor de Caña
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Tour Flor de Caña',
        'Recorrido turístico e histórico que permite conocer el proceso de producción del ron, sus instalaciones, bodegas de añejamiento y la historia de la marca.',
        'Chichigalpa',
        'Kilómetro 120 de la carretera a Chinandega, 1 km al sur del empalme de Chichigalpa, frente al estadio Flor de Caña, Chichigalpa, Nicaragua.',
        'https://maps.app.goo.gl/qGERxcJMcXprdvmZ7',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Basílica de la Inmaculada Concepción de El Viejo
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Basílica de la Inmaculada Concepción de El Viejo',
        'Templo religioso de gran importancia histórica y cultural, reconocido por su tradición mariana y por albergar la imagen de la Virgen del Trono, patrona de Nicaragua.',
        'El Viejo',
        'Frente al parque central de El Viejo, departamento de Chinandega, Nicaragua.',
        'https://maps.app.goo.gl/6qrnEp9o7acT1o348',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Complejo volcánico San Cristóbal–Casita
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Complejo volcánico San Cristóbal–Casita',
        'Complejo natural formado por volcanes que ofrece paisajes montañosos, senderismo, observación de flora y fauna y actividades de turismo de naturaleza.',
        'Posoltega',
        'Zona del volcán Casita, sector de la comunidad Santa Narcisa, municipio de Posoltega, Chinandega, Nicaragua.',
        'https://maps.app.goo.gl/kcsGJYhtirLF9YiJ7',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Centro Turístico Cerro San Rafael
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Centro Turístico Cerro San Rafael',
        'Reserva forestal que ofrece senderos, miradores naturales, vegetación abundante y vistas panorámicas del territorio norte de Chinandega.',
        'Cinco Pinos',
        'Cerca de la comunidad La Colonia, próximo al casco urbano de Cinco Pinos.',
        'https://maps.app.goo.gl/xKtn2F2PdAZTvkpR7',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Aguas Termales de Potosí
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Aguas Termales de Potosí',
        'Destino natural de aguas termales de origen volcánico que ofrece espacios para el descanso y la relajación en un entorno natural.',
        'El Viejo',
        'Comunidad de Potosí, península de Cosigüina, municipio de El Viejo, departamento de Chinandega, Nicaragua.',
        'https://maps.app.goo.gl/AyahsNbo5xrB68K39',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Reserva Natural Volcán Cosigüina
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Volcán Cosigüina',
        'Área natural protegida que alberga un volcán con laguna cratérica, senderos ecológicos, bosques, humedales y miradores con vistas al golfo de Fonseca.',
        'El Viejo',
        'Península de Cosigüina. Acceso por la carretera El Viejo-El Congo y camino de tierra hacia la comunidad de Potosí.',
        'https://maps.app.goo.gl/4ikzye5WS7TjPJ8L8',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Playa Aserradores
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa Aserradores',
        'Destino costero que ofrece espacios para disfrutar de la playa, practicar surf, realizar actividades de pesca y contemplar los paisajes del océano Pacífico.',
        'El Viejo',
        'Comunidad de Aserradores, municipio de El Viejo, departamento de Chinandega',
        'https://maps.app.goo.gl/jwDvnvdVMLyNp9BQ7',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Isla El Cardón
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Isla El Cardón',
        'Isla costera reconocida por sus playas de arena clara, paisajes marinos y atardeceres. Es conocida por su relación histórica con el poeta Rubén Darío.',
        'Corinto',
        'Isla El Cardón, frente a la costa de Corinto, departamento de Chinandega, Nicaragua.',
        'https://maps.app.goo.gl/DHiS7totA9ooHBYf6',
        3
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE CHONTALES
-- 1. Salto El Silencio
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto El Silencio',
        'Cascada natural rodeada de vegetación, ideal para realizar caminatas, disfrutar del paisaje y bañarse en sus pozas.',
        'San Francisco de Cuapa',
        'Comarca El Silencio, municipio de San Francisco de Cuapa, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/rxZVgwHAc83uWsGV7',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Salto y Cueva La Oropéndola
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto y Cueva La Oropéndola',
        'Atractivo natural que combina una caída de agua y formaciones rocosas, ideal para realizar caminatas y explorar el entorno natural.',
        'Santo Tomás',
        'Zona rural del municipio de Santo Tomás, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/JPtpSz2q5oGHwbQ1A',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Cerro y Cuevas Las Ventanas
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cerro y Cuevas Las Ventanas',
        'Formaciones rocosas y cuevas naturales de interés geológico que permiten realizar senderismo y exploración del entorno.',
        'Acoyapa',
        'Zona rural del municipio de Acoyapa, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/6aqXRvwK6TqkRB517',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Río Tawa
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Río Tawa',
        'Entorno natural de río con pozas y paisajes montañosos, apropiado para actividades recreativas, caminatas y contacto con la naturaleza.',
        'La Libertad',
        'Zona de Tawa, municipio de La Libertad, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/6Y2nASpsb7fxhcgg7',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Balneario Agua Buena
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Balneario Agua Buena',
        'Espacio natural de recreación que ofrece baño en aguas naturales, caminatas y observación de la vegetación y fauna del entorno.',
        'La Libertad',
        'Comunidad Agua Buena, municipio La Libertad, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/nzYxzctA4zJwhV6K8',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Aguas Calientes
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Aguas Calientes',
        'Sitio de interés geológico reconocido por sus características naturales y formaciones asociadas al entorno de Chontales.',
        'Juigalpa',
        'Zona rural del municipio de Juigalpa, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/yQaJZsC4gRvHBYpQ9',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Isla Arena
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Isla Arena',
        'Destino natural ubicado en el entorno lacustre de Chontales, donde se pueden realizar paseos en lancha, actividades recreativas, camping y disfrutar del paisaje.',
        'Acoyapa',
        'Zona lacustre del municipio de Acoyapa, junto al lago Cocibolca, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/XS2rkbY4F3uYZxpL6',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Picos El Bálsamo
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Picos El Bálsamo',
        'Formaciones geológicas elevadas que ofrecen paisajes montañosos, vistas panorámicas y espacios para realizar caminatas.',
        'Juigalpa',
        'Meseta de Hato Grande, municipio de Juigalpa, departamento de Chontales, Nicaragua.',
        'https://maps.app.goo.gl/Sy4W9mCXXttGVbJb7',
        4
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE ESTELÍ 
-- 1. Salto La Estanzuela (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto La Estanzuela',
        'Cascada natural que forma una poza y permite disfrutar de actividades recreativas y contacto con la naturaleza.',
        'Estelí',
        'Comunidad La Estanzuela, zona de la Reserva Natural Tisey-La Estanzuela, Estelí, Nicaragua.',
        'https://maps.app.goo.gl/g64DybDUa4tfWeUV8',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Plasencia Cigars (Local Comercial - Fábrica de puros)
-- Nota: Recuerda actualizar el RUC ('J031...') y el ID del dueño (id_dueno) según corresponda en tu BD.
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Plasencia Cigars',
        'Fábrica de puros que permite conocer el proceso artesanal de elaboración de tabacos y productos derivados.',
        'Estelí',
        'Ciudad de Estelí, departamento de Estelí, Nicaragua.',
        'https://maps.app.goo.gl/o7WojPmLmPUj9mT67',
        5
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000002', TRUE, 1 FROM nuevo_local;

-- 3. Catedral Nuestra Señora del Rosario (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Catedral Nuestra Señora del Rosario',
        'Templo católico representativo del patrimonio religioso y cultural de la ciudad de Estelí.',
        'Estelí',
        'Centro de la ciudad de Estelí, junto al Parque Central, Nicaragua.',
        'https://maps.app.goo.gl/zwiEYE65o3rF2muP7',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Esculturas de El Jalacate – Don Alberto Gutiérrez (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Esculturas de El Jalacate – Don Alberto Gutiérrez',
        'Conjunto de esculturas talladas en piedra por Don Alberto Gutiérrez, ubicado en un entorno natural que permite realizar recorridos y apreciar sus obras.',
        'Estelí',
        'Finca El Jalacate, zona de la Reserva Natural Tisey, Estelí, Nicaragua.',
        'https://maps.app.goo.gl/u6opACheRZrDkZeu7',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Paisaje Terrestre Protegido Miraflor–Moropotente (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Paisaje Terrestre Protegido Miraflor–Moropotente',
        'Área protegida con paisajes rurales, bosques, biodiversidad y senderos que permiten realizar actividades de ecoturismo.',
        'Estelí',
        'Reserva Natural Miraflor-Moropotente, departamento de Estelí, Nicaragua.',
        'https://maps.app.goo.gl/knBzM9yRs7eRxywo8',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Parque Mirador El Avión (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Mirador El Avión',
        'Parque turístico que cuenta con un mirador desde donde se pueden apreciar los paisajes de Condega y conocer el avión que forma parte de su atractivo histórico.',
        'Condega',
        'Municipio de Condega, departamento de Estelí, Nicaragua.',
        'https://maps.app.goo.gl/4zgirDCBE74vPneWA',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Cerro La Mocuana (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cerro La Mocuana',
        'Cerro de interés natural y paisajístico que permite realizar recorridos y apreciar el entorno rural del municipio.',
        'La Trinidad',
        'Municipio de La Trinidad, departamento de Estelí, Nicaragua.',
        'https://maps.app.goo.gl/Dxn1godRWavn72CX8',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Parque Ecológico Canta Gallo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Ecológico Canta Gallo',
        'Espacio natural que ofrece senderos, miradores y oportunidades para observar la flora y fauna de la zona.',
        'Condega',
        'Zona de Canta Gallo, municipio de Condega, departamento de Estelí, Nicaragua.',
        'https://maps.app.goo.gl/iQhtxiBjePGXGaRx8',
        5
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;


--DEPARTAMENTO DE GRANADA
-- 1. Catedral de Granada (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Catedral de Granada',
        'Templo católico emblemático de la ciudad, reconocido por su arquitectura y su importancia histórica y religiosa.',
        'Granada',
        'Frente al Parque Central, Plaza de la Independencia, Granada, Nicaragua.',
        'https://maps.app.goo.gl/PLocLD9KL6ZrzL48A',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Museos Convento San Francisco (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Museos Convento San Francisco',
        'Conjunto cultural y museístico que conserva colecciones de arte precolombino, pinturas, esculturas y objetos históricos.',
        'Granada',
        'De la Catedral, 1 cuadra al norte y 1 cuadra al este, Granada, Nicaragua.',
        'https://maps.app.goo.gl/ZLVgFrDBGirUKCMD9',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Fortaleza La Pólvora (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Fortaleza La Pólvora',
        'Antigua edificación militar construida durante la época colonial, actualmente reconocida por su valor histórico y cultural.',
        'Granada',
        'Calle Real Xalteva, Granada, Nicaragua.',
        'https://maps.app.goo.gl/xu3Px2KuXZTfDzQz9',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Parroquia de Nuestra Señora de la Merced (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parroquia de Nuestra Señora de la Merced',
        'Templo católico de arquitectura colonial que destaca por su campanario, desde donde se pueden apreciar vistas panorámicas de la ciudad.',
        'Granada',
        'Calle 14 de Septiembre, barrio Xalteva, Granada, Nicaragua.',
        'https://maps.app.goo.gl/xKXymSWWU54kao8z5',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Isla Zapatera (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Isla Zapatera',
        'Isla de origen volcánico reconocida por su patrimonio arqueológico, esculturas precolombinas, petroglifos y riqueza natural.',
        'Granada',
        'Parque Nacional Archipiélago Zapatera, Lago Cocibolca, Granada, Nicaragua.',
        'https://maps.app.goo.gl/8qFkiTeqTtMcC3oh6',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Isletas de Granada (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Isletas de Granada',
        'Conjunto de pequeñas islas de origen volcánico ubicadas en el Lago Cocibolca, donde se realizan recorridos en embarcaciones y actividades recreativas.',
        'Granada',
        'Archipiélago de las Isletas, Lago Cocibolca, frente a la ciudad de Granada, Nicaragua.',
        'https://maps.app.goo.gl/9Zm5653VX6uM66wYA',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Mirador El Boquete (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador El Boquete',
        'Mirador natural que ofrece vistas panorámicas de la Laguna de Apoyo y del paisaje que rodea el municipio de Diriá.',
        'Diriá',
        'Mirador El Boquete, municipio de Diriá, departamento de Granada, Nicaragua.',
        'https://maps.app.goo.gl/1HxucdTsrmm9xBUFA',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Volcán Mombacho (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Volcán Mombacho',
        'Área volcánica protegida que cuenta con bosques nubosos, senderos naturales, miradores y diversidad de flora y fauna.',
        'Granada',
        'Reserva Natural Volcán Mombacho, acceso por carretera al Volcán Mombacho, Granada, Nicaragua.',
        'https://maps.app.goo.gl/FXRVioWBPY7rLhQ86',
        6
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 9. El Caite Granada (Local Comercial - Hostal)
-- Nota: Recuerda ajustar el RUC y el id_dueno según corresponda en tu BD.
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'El Caite Granada',
        'Hostal que ofrece alojamiento a visitantes y turistas, ubicado en el centro de la ciudad de Granada.',
        'Granada',
        'Calle La Libertad, 20 metros al oeste del BAC, Granada, Nicaragua.',
        'https://maps.app.goo.gl/kd1LLcLw53FjLB5M8',
        6
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000006', TRUE, 1 FROM nuevo_local;

--DEPARTAMENTO JINOTEGA
-- 1. Canopy Tour La Brellera (Local Comercial - Centro de aventura)
-- Nota: Recuerda ajustar el RUC y el id_dueno según corresponda en tu BD.
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Canopy Tour La Brellera',
        'Centro de aventura ubicado en una zona montañosa rodeada de pinares. Ofrece recorridos en canopy y espacios para disfrutar del paisaje natural.',
        'San Rafael del Norte',
        'Kilómetro 190 de la carretera hacia Yalí, San Rafael del Norte, Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/1EJscc5G9U27tMSw6',
        7
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000007', TRUE, 1 FROM nuevo_local;

-- 2. Lago de Apanás (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Lago de Apanás',
        'Embalse artificial rodeado de montañas y vegetación, reconocido por su belleza paisajística y biodiversidad. Permite realizar actividades como paseos en lancha, kayak, pesca y observación de aves.',
        'Jinotega',
        'Zona norte de la ciudad de Jinotega, aproximadamente a 6 km del casco urbano, Nicaragua.',
        'https://maps.app.goo.gl/pYtcJFopcejSBkS28',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Reserva Natural Macizo de Peñas Blancas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Macizo de Peñas Blancas',
        'Área natural protegida caracterizada por sus montañas, bosques nubosos, abundante vegetación y biodiversidad. Es un destino apropiado para practicar senderismo, observar aves y conocer los paisajes naturales de la región.',
        'El Cuá',
        'Zona del Macizo de Peñas Blancas, municipio de El Cuá, Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/bpgmypcST9E3tGXW8',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Petroglifos Las Pintadas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Petroglifos Las Pintadas',
        'Sitio arqueológico que conserva grabados realizados sobre superficies rocosas, considerados muestras del legado cultural de los antiguos pobladores de la región.',
        'Wiwilí de Jinotega',
        'Comunidad Las Pintadas, municipio de Wiwilí de Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/4oSWCVkkjBsohEj56',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Cascada La Bujona (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cascada La Bujona',
        'Caída de agua ubicada en un entorno de bosque nuboso, rodeada de vegetación y senderos naturales. Es un atractivo ideal para realizar caminatas, observar la biodiversidad y disfrutar del paisaje.',
        'Jinotega',
        'Comunidad La Esmeralda, Reserva Natural Datanlí-El Diablo, Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/JZF3wPhFv1qeCLgx9',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Reserva Natural Cerro Kilambé (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Cerro Kilambé',
        'Área natural protegida de relieve montañoso que conserva bosques de nebliselva y una importante diversidad de flora y fauna. Ofrece paisajes naturales y oportunidades para realizar caminatas y recorridos ecológicos.',
        'Wiwilí de Jinotega',
        'Zona del Cerro Kilambé, municipio de Wiwilí de Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/eFj1LuMF1khMZM9V8',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Santuario y Museo El Tepeyac (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Santuario y Museo El Tepeyac',
        'Complejo religioso dedicado a la espiritualidad franciscana y vinculado al legado del padre Odorico D’Andrea. Cuenta con espacios de oración y un museo que conserva objetos relacionados con su vida y labor religiosa.',
        'San Rafael del Norte',
        'Colina El Tepeyac, zona norte de San Rafael del Norte, Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/BNpf6NpaTUycrPT69',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Mirador Peña de la Cruz (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador Peña de la Cruz',
        'Elevación natural que constituye uno de los principales atractivos de Jinotega. Cuenta con una cruz en su cima y ofrece vistas panorámicas de la ciudad, las montañas y parte del Lago de Apanás.',
        'Jinotega',
        'Costado oeste de la ciudad, acceso por las gradas cercanas al Cementerio Municipal de Jinotega, Nicaragua.',
        'https://maps.app.goo.gl/t4MHvssYxzJV4upn7',
        7
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE LEON4
-- 1. Catedral de León (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Catedral de León',
        'Templo religioso de gran valor histórico, arquitectónico y cultural, reconocido como Patrimonio Mundial por la UNESCO.',
        'León',
        'Calle Rubén Darío, Avenida Central Norte, frente al Parque Central, León, Nicaragua.',
        'https://maps.app.goo.gl/2FQFtiKhfvdMCotM7',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Volcán Cerro Negro (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Volcán Cerro Negro',
        'Volcán de origen reciente reconocido por sus paisajes de ceniza volcánica y actividades de aventura como senderismo y sandboarding.',
        'León',
        'Reserva Natural Complejo Volcánico Las Pilas-El Hoyo, municipio de León, departamento de León, Nicaragua.',
        'https://maps.app.goo.gl/p24xs2A6iD9zWK2M8',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Hervideros de San Jacinto (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Hervideros de San Jacinto',
        'Sitio de actividad geotérmica donde se pueden observar fumarolas, pozas de lodo hirviente y manifestaciones naturales de calor volcánico.',
        'Telica',
        'Comunidad de San Jacinto, municipio de Telica, departamento de León, Nicaragua.',
        'https://maps.app.goo.gl/e6j5XkcwwbFYE1NWA',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Volcán Momotombo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Volcán Momotombo',
        'Volcán de forma cónica que destaca por su paisaje natural y su importancia geológica, ofreciendo oportunidades para el turismo de naturaleza y aventura.',
        'La Paz Centro',
        'Zona de Puerto Momotombo y Reserva Natural Complejo Volcánico Momotombo, municipio de La Paz Centro, León, Nicaragua.',
        'https://maps.app.goo.gl/7sThhVUzTa2tHbVD9',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Centro de Arte Fundación Ortiz Gurdián (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Centro de Arte Fundación Ortiz Gurdián',
        'Espacio cultural que reúne colecciones de pintura, escultura y otras expresiones artísticas en edificios coloniales restaurados.',
        'León',
        'Avenida 3 Poniente, centro histórico de León, Nicaragua.',
        'https://maps.app.goo.gl/sCJg25UPzJ4StiUx7',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Museo Archivo Rubén Darío (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Museo Archivo Rubén Darío',
        'Casa museo dedicada a conservar y presentar documentos, objetos personales y recuerdos relacionados con la vida y obra del poeta Rubén Darío.',
        'León',
        'Zona del centro histórico de León, una cuadra al oeste de la Iglesia San Francisco, Nicaragua.',
        'https://maps.app.goo.gl/Rv6wsv7Bcwos2FvF6',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Reserva Natural Isla Juan Venado (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Isla Juan Venado',
        'Área natural protegida formada por manglares, esteros y playas, reconocida por su biodiversidad y por las actividades de observación de aves y recorridos en lancha.',
        'León',
        'Acceso turístico por Las Peñitas, municipio de León, departamento de León, Nicaragua.',
        'https://maps.app.goo.gl/v3WRCdoMJpzkbDfk6',
        8
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE MADRIZ
-- 1. Cañón de Somoto (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cañón de Somoto',
        'Monumento natural formado por enormes paredes de roca volcánica que rodean el cauce del río Coco. Es un destino reconocido por sus paisajes y actividades como senderismo, paseos en bote y recorridos de aventura.',
        'Somoto',
        'Comunidad Valle de Sonís, aproximadamente 15 km al oeste de la ciudad de Somoto, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/S3LTWrgyA6KGEVJG8',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Iglesia Santiago Apóstol (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Iglesia Santiago Apóstol',
        'Templo católico de importancia histórica y cultural, ubicado en el centro de Somoto. Forma parte del patrimonio arquitectónico y de las tradiciones religiosas de la ciudad.',
        'Somoto',
        'Centro de la ciudad de Somoto, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/rY8cHsH4vk3PU9FYA',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Laguna La Bruja (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Laguna La Bruja',
        'Laguna de origen volcánico rodeada de cultivos de café, bosques de roble y vegetación natural. Es un humedal de gran belleza paisajística donde se pueden realizar actividades de observación de la naturaleza y recorridos turísticos.',
        'Las Sabanas',
        'Comunidad El Pegador, a menos de 2 km del casco urbano de Las Sabanas, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/6R5FiejE9wcqT9uN9',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Salto y Petroglifos del Río Apanaje (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto y Petroglifos del Río Apanaje',
        'Cascada de aproximadamente 40 a 50 metros de altura que desemboca en una poza natural. En sus alrededores se encuentran petroglifos y grabados antiguos que reflejan el valor arqueológico y cultural de la zona.',
        'Las Sabanas',
        'Camino al oeste del casco urbano de Las Sabanas, aproximadamente 3 km por camino sin pavimentar, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/g4Acc5JMKdFy66xo8',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Parque Mirador Las Sabanas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Mirador Las Sabanas',
        'Parque ubicado en la parte más elevada del casco urbano, desde donde se pueden apreciar vistas panorámicas del municipio y de los paisajes montañosos del departamento de Madriz.',
        'Las Sabanas',
        'Parte alta del casco urbano de Las Sabanas, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/JJUdbkaSVFwTF6Xb9',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Mirador El Balcón (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador El Balcón',
        'Mirador ubicado en la zona más alta de San José de Cusmapa, conocido por sus vistas panorámicas hacia la cadena volcánica del Pacífico y el Golfo de Fonseca.',
        'San José de Cusmapa',
        'Zona más alta del casco urbano de San José de Cusmapa, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/Si8N1omVPG12Y7Wx6',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. La Mano del Diablo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Mano del Diablo',
        'Formación rocosa de aproximadamente 400 metros cuadrados que presenta el tallado de una mano sobre la piedra. Es un sitio de interés geológico, cultural y paisajístico relacionado con las tradiciones indígenas de la zona.',
        'San José de Cusmapa',
        'Zona montañosa cercana al casco urbano de San José de Cusmapa, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/XWpWbVp2EUMYaEC76',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Mirador La Piedra de Orocuina (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador La Piedra de Orocuina',
        'Formación rocosa de gran altura rodeada de bosques de pino y vegetación de montaña. Desde su cima se pueden contemplar paisajes de la Reserva Mangas Verdes, la cordillera de los Maribios y el Golfo de Fonseca.',
        'San José de Cusmapa',
        'Comunidad El Apante, aproximadamente 3 km al sureste del casco urbano de San José de Cusmapa, Madriz, Nicaragua.',
        'https://maps.app.goo.gl/E49V5pxb849oYcaWA',
        9
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE MANAGUA
-- 1. Laguna de Xiloá (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Laguna de Xiloá',
        'Laguna de origen volcánico ubicada en la Península de Chiltepe, conocida por sus actividades recreativas, paisajes naturales y espacios para disfrutar del agua.',
        'Mateare',
        'Centro Turístico Xiloá, sector Bosques de Xiloá, municipio de Mateare, Managua, Nicaragua.',
        'https://maps.app.goo.gl/bCx9vgxE5qNtRTmT9',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Centro Turístico Pochomil (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Centro Turístico Pochomil',
        'Destino turístico de playa que ofrece actividades recreativas, gastronomía, restaurantes y espacios para disfrutar del paisaje del océano Pacífico.',
        'San Rafael del Sur',
        'Playa Pochomil, municipio de San Rafael del Sur, departamento de Managua, Nicaragua.',
        'https://maps.app.goo.gl/3WAQR6AmDr6A5mcW9',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Antigua Catedral de Managua (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Antigua Catedral de Managua',
        'Edificación religiosa de gran valor histórico y arquitectónico, reconocida como uno de los principales símbolos del patrimonio histórico de Managua.',
        'Managua',
        'Plaza de la Revolución, centro histórico de Managua, Nicaragua.',
        'https://maps.app.goo.gl/oUX19aBdH6gH4BYc7',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Teatro Nacional Rubén Darío (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Teatro Nacional Rubén Darío',
        'Principal recinto cultural del país, dedicado a la presentación de obras teatrales, conciertos, espectáculos y diversas actividades artísticas.',
        'Managua',
        'Frente al Malecón de Managua, junto al Lago Xolotlán, Managua, Nicaragua.',
        'https://maps.app.goo.gl/SzooBJam2F8PQhtH9',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Refugio de Vida Silvestre Chocoyero–El Brujo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Refugio de Vida Silvestre Chocoyero–El Brujo',
        'Área natural protegida que cuenta con cascadas, senderos ecológicos y diversidad de flora y fauna. Es reconocida por sus colonias de chocoyos y actividades de observación de aves.',
        'Ticuantepe',
        'Comunidad El Corozo, acceso por camino de tierra de aproximadamente 7 km hasta la entrada de la reserva, Ticuantepe, Managua, Nicaragua.',
        'https://maps.app.goo.gl/QWuGC1fFnPur5en66',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Mirador Loma de Tiscapa (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador Loma de Tiscapa',
        'Mirador urbano de importancia histórica y paisajística que ofrece vistas panorámicas de la ciudad de Managua y de la Laguna de Tiscapa.',
        'Managua',
        'Loma de Tiscapa, zona de la Reserva Natural Laguna de Tiscapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/wSmeG51jx78X8gNA7',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Casa Museo Hacienda San Jacinto (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Casa Museo Hacienda San Jacinto',
        'Recinto histórico que conmemora la Batalla de San Jacinto de 1856 y conserva objetos, documentos y exposiciones relacionadas con este acontecimiento de la historia nacional.',
        'Tipitapa',
        'Carretera Norte, kilómetro 39.5, 3 km al sur, municipio de Tipitapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/P4SWpsSGK3yzGGMeA',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Puerto Salvador Allende (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Puerto Salvador Allende',
        'Complejo turístico y recreativo ubicado a orillas del Lago Xolotlán, que ofrece paseos, restaurantes, actividades familiares y espacios para disfrutar del paisaje.',
        'Managua',
        'Malecón de Managua, orillas del Lago Xolotlán, Managua, Nicaragua.',
        'https://maps.app.goo.gl/s3bL9yN9Tm71eZ1G7',
        10
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE MASAYA
-- 1. Casa Museo General Augusto C. Sandino (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Casa Museo General Augusto C. Sandino',
        'Casa histórica donde vivió parte de su infancia el General Augusto C. Sandino. Conserva fotografías, documentos y objetos relacionados con su vida.',
        'Niquinohomo',
        'WW33+RXG, Calle Real, frente a la Alcaldía Municipal, Niquinohomo, Masaya, Nicaragua.',
        'https://maps.app.goo.gl/hKsQBzM4a65gYi5r6',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Centro Turístico Mirador de Catarina (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Centro Turístico Mirador de Catarina',
        'Espacio turístico que ofrece vistas panorámicas de la Laguna de Apoyo y del paisaje natural de los alrededores. Cuenta con áreas de descanso y actividades recreativas.',
        'Catarina',
        'WW7J+995, Catarina, departamento de Masaya, Nicaragua.',
        'https://maps.app.goo.gl/FDRBPzPxj4gZ5rqS9',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Fortaleza El Coyotepe (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Fortaleza El Coyotepe',
        'Antigua fortificación de importancia histórica que permite conocer parte del patrimonio de Masaya y disfrutar de vistas panorámicas desde su ubicación elevada.',
        'Masaya',
        'Masaya, departamento de Masaya, Nicaragua.',
        'https://maps.app.goo.gl/zKE3oCD7LFaB9CQE8',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Mercado de Artesanías (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mercado de Artesanías',
        'Centro cultural y comercial donde se exhiben y venden artesanías tradicionales nicaragüenses, como hamacas, cerámica, artículos de madera, textiles y máscaras.',
        'Masaya',
        'XWF4+HH2, Centro Cultural Antiguo Mercado de Artesanías, Masaya, Nicaragua.',
        'https://maps.app.goo.gl/BdmRmokzN491rbkR7',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Museo Arqueológico Tenderí (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Museo Arqueológico Tenderí',
        'Museo que conserva una colección de piezas arqueológicas precolombinas, esculturas, objetos de cerámica y elementos relacionados con la historia de los antiguos pobladores de la zona.',
        'Nindirí',
        'Del museo Tenderí, 1 cuadra y media al norte, Nindirí, Masaya, Nicaragua.',
        'https://maps.app.goo.gl/pbGTsuW6xaG3okci7',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Parque Nacional Volcán Masaya (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Nacional Volcán Masaya',
        'Área natural protegida que alberga un complejo volcánico, cráteres, campos de lava y senderos para conocer la biodiversidad y las características geológicas de la zona.',
        'Nindirí',
        'Kilómetro 23 de la carretera Managua-Masaya, entrada principal del Parque Nacional Volcán Masaya, Nindirí, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Parque+Nacional+Volcan+Masaya+Nindiri',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Reserva Natural Humedales de Tisma (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Humedales de Tisma',
        'Área natural protegida que conserva ecosistemas de humedales, lagunas y diversidad de aves acuáticas y migratorias. Es un espacio de interés para la observación de fauna y paisajes naturales.',
        'Tisma',
        '32R7+CJJ, sector Santa Cristiana, municipio de Tisma, departamento de Masaya, Nicaragua.',
        'https://maps.app.goo.gl/CvdFfJYiPUJeyYun9',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Laguna de Masaya (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Laguna de Masaya',
        'Cuerpo de agua de origen volcánico que destaca por su paisaje natural y su importancia ecológica. Sus alrededores permiten realizar caminatas y observar la flora y fauna de la zona.',
        'Masaya',
        'Orillas de la Laguna de Masaya, departamento de Masaya, Nicaragua.',
        'https://maps.app.goo.gl/VWyHVSVPRL53dH2r7',
        11
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE MATAGALPA
-- 1. Reserva Natural Cerro Apante (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Cerro Apante',
        'Área protegida de bosque húmedo y nuboso que alberga una amplia diversidad de flora y fauna. Cuenta con senderos para caminatas y miradores con vistas panorámicas de la ciudad.',
        'Matagalpa',
        'Reserva Natural Cerro Apante, zona de Yaguare, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/E33mBCcZeUysS7WC9',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Reserva Natural Cerro El Arenal (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Cerro El Arenal',
        'Área natural de montaña caracterizada por su clima fresco, vegetación de nebliselva y biodiversidad. Es un espacio apropiado para disfrutar del paisaje y realizar actividades de contacto con la naturaleza.',
        'Matagalpa',
        'Comunidad El Arenal, carretera Matagalpa–Jinotega, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/UwQ3jJBiTo6oSBcf6',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Salto de Santa Emilia / Cascada Blanca (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto de Santa Emilia / Cascada Blanca',
        'Cascada de aproximadamente 17 metros de altura, rodeada de vegetación, senderos y formaciones naturales. Ofrece espacios para caminatas, observación del paisaje y actividades recreativas.',
        'Matagalpa',
        'Kilómetro 147, carretera Matagalpa–El Tuma–La Dalia, Nicaragua.',
        'https://maps.app.goo.gl/98sX7uHnGJvUjZZY8',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Parque Ecológico Mirador Cerro El Calvario (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque Ecológico Mirador Cerro El Calvario',
        'Parque ecológico ubicado en una elevación de la ciudad, conocido por sus miradores y vistas panorámicas de Matagalpa. Cuenta con áreas verdes y espacios para caminar y recrearse.',
        'Matagalpa',
        'Parque Ecológico Cerro El Calvario, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/RZf389rpbe5FWUdQ6',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Mirador El Porvenir (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador El Porvenir',
        'Mirador ecoturístico ubicado en una zona montañosa que permite contemplar la ciudad de Matagalpa y sus paisajes cafetaleros. Es un espacio para descansar, tomar fotografías y disfrutar del clima fresco.',
        'Matagalpa',
        'Comunidad Siares–Alemania, faldas de la Reserva Natural Cerro Apante, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/kxMCzN47RhE5q6o77',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Selva Negra (Local Comercial - Finca cafetalera, hotel y restaurante)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Selva Negra',
        'Finca cafetalera y complejo ecoturístico rodeado de bosque nuboso, lagunas y senderos naturales. Ofrece alojamiento, gastronomía y actividades relacionadas con la naturaleza y la producción de café.',
        'Matagalpa',
        'Kilómetro 140, carretera Matagalpa–Jinotega, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/PU94gEhpspeefUR47',
        12
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000012', TRUE, 1 FROM nuevo_local;

-- 7. Catedral San Pedro Apóstol (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Catedral San Pedro Apóstol',
        'Templo católico representativo del patrimonio religioso e histórico de Matagalpa. Destaca por su arquitectura y por ser uno de los principales referentes del centro de la ciudad.',
        'Matagalpa',
        'Centro de la ciudad de Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/vYskbhgTqRmo9YAE9',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Museo Nacional del Café (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Museo Nacional del Café',
        'Espacio cultural dedicado a la historia del café y su importancia en Matagalpa y Nicaragua. Sus exposiciones muestran aspectos de la producción cafetalera, la historia local y la cultura de la región.',
        'Matagalpa',
        'Parque Francisco Morazán, una cuadra y diez varas al sur, Matagalpa, Nicaragua.',
        'https://maps.app.goo.gl/RLdjeEFuZewUZt6v9',
        12
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE NUEVA SEGOVIA
-- 1. Cerro Guasara (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cerro Guasara',
        'Elevación natural rodeada de pinares que ofrece vistas panorámicas hacia el Río Coco. Es conocido por sus formaciones rocosas y las leyendas tradicionales de la zona.',
        'Mozonte',
        'Zona de Lumanto, municipio de Mozonte, Nueva Segovia, Nicaragua.',
        'https://maps.app.goo.gl/jBSR2T5KNRVyeEqT7',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Aguas Termales Don Alfonso (Local Comercial - Centro recreativo privado)

WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Aguas Termales Don Alfonso',
        'Centro turístico de aguas termales que cuenta con piscinas para baños, espacios de relajación y áreas destinadas a disfrutar de las propiedades naturales del agua caliente.',
        'San Fernando',
        'Colonia Ramos, kilómetro 269 de la carretera Ocotal-Jalapa, San Fernando, Nueva Segovia, Nicaragua.',
        'https://maps.app.goo.gl/bAfurCcUZDwWEGvx6',
        13
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000013', TRUE, 1 FROM nuevo_local;

-- 3. Casa Museo Santa María de los Rivas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Casa Museo Santa María de los Rivas',
        'Casa museo que conserva una colección de arte sacro y objetos religiosos. También ofrece espacios para actividades culturales, eventos y hospedaje.',
        'Ocotal',
        'Paraje Francisco Morazán, Ocotal, Nueva Segovia, Nicaragua.',
        'https://maps.app.goo.gl/zgu23rhffjhtBbBF6',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Mirador Coquimba (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mirador Coquimba',
        'Mirador natural ubicado en una zona montañosa, ideal para realizar caminatas y contemplar los paisajes de la Cordillera Dipilto-Jalapa.',
        'Dipilto',
        'Cerro La Coquimba, municipio de Dipilto, Nueva Segovia, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Mirador+Coquimba+Dipilto+Nueva+Segovia',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Templo Parroquial San Pedro Apóstol (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Templo Parroquial San Pedro Apóstol',
        'Templo religioso de importancia histórica y cultural para la comunidad de Mozonte. Conserva elementos de arte sacro y representa parte de las tradiciones religiosas locales.',
        'Mozonte',
        'Costado norte del Parque Central, Mozonte, Nueva Segovia, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Templo+Parroquial+San+Pedro+Apostol+Mozonte',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Las Pilitas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Las Pilitas',
        'Formación natural compuesta por siete pozas de aguas cristalinas, rodeadas de vegetación. Es un sitio adecuado para disfrutar del paisaje y realizar actividades recreativas en contacto con la naturaleza.',
        'Mozonte',
        'Zona rural de Mozonte, Nueva Segovia, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Las+Pilitas+Mozonte+Nueva+Segovia',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Loma Santa (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Loma Santa',
        'Elevación natural que cuenta con una capilla y una gruta dedicada a la Virgen de Guadalupe. Desde su cima se pueden apreciar vistas panorámicas del casco urbano de Mozonte.',
        'Mozonte',
        'Loma Santa, municipio de Mozonte, Nueva Segovia, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Loma+Santa+Mozonte+Nueva+Segovia',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Cascada McDouglas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cascada McDouglas',
        'Caída de agua ubicada en un entorno natural montañoso, que permite disfrutar del paisaje y realizar recorridos de senderismo en los alrededores.',
        'Dipilto',
        'Zona de Dipilto, carretera Dipilto-Las Manos, Nueva Segovia, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Cascada+McDouglas+Dipilto+Nueva+Segovia',
        13
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

--DEPARTAMENTO DE RIO SAN JUAN
-- 1. Archipiélago de Solentiname (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Archipiélago de Solentiname',
        'Conjunto de islas ubicadas en el Lago Cocibolca, reconocidas por sus paisajes naturales, riqueza cultural y tradición artística. Sus visitantes pueden conocer talleres de pintura primitivista, artesanías, realizar paseos en lancha y observar aves.',
        'San Carlos',
        'Islas del Archipiélago de Solentiname, acceso en transporte acuático desde San Carlos, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/5H3NHmW6Xr92aHUG8',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Fortaleza de la Inmaculada Concepción de María (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Fortaleza de la Inmaculada Concepción de María',
        'Construcción militar histórica edificada durante la época colonial para defender el territorio de los ataques de piratas. Actualmente funciona como sitio patrimonial y museo, donde se puede conocer parte de la historia del Río San Juan.',
        'El Castillo',
        'Poblado de El Castillo, a orillas del Río San Juan, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/oQHfb8VMXE11nqW46',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Refugio de Vida Silvestre Los Guatuzos (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Refugio de Vida Silvestre Los Guatuzos',
        'Área protegida caracterizada por sus extensos humedales, bosques tropicales y abundante biodiversidad. Es un destino para realizar recorridos en lancha o kayak, observar aves y conocer diferentes especies de flora y fauna.',
        'San Carlos',
        'Zona de los humedales al sur del Lago Cocibolca, comunidad Papaturro, municipio de San Carlos, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/9VGdk5rwKcCWcyWu7',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Antiguo Greytown (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Antiguo Greytown',
        'Antiguo asentamiento portuario conocido históricamente como Greytown o San Juan del Norte. Conserva vestigios de su pasado histórico, como cementerios, antiguas estructuras y paisajes naturales de lagunas y canales.',
        'San Juan de Nicaragua',
        'Zona de San Juan de Nicaragua, antiguo Greytown, desembocadura del Río San Juan en el mar Caribe, Nicaragua.',
        'https://maps.app.goo.gl/d3svqob8AaukCopz6',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Boca de Sábalos (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Boca de Sábalos',
        'Localidad ribereña ubicada en la confluencia de los ríos Sábalos y San Juan. Es un punto de actividad comercial y turística que ofrece servicios de alojamiento, alimentación y recorridos acuáticos por los alrededores.',
        'El Castillo',
        'Comunidad Boca de Sábalos, municipio de El Castillo, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/d3svqob8AaukCopz6',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Salto El Zapotal (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Salto El Zapotal',
        'Caída de agua natural rodeada de vegetación, que forma una poza utilizada para bañarse y disfrutar del entorno. Es un sitio apropiado para descansar, realizar picnic y compartir actividades recreativas.',
        'El Almendro',
        'Comarca El Zapotal, aproximadamente 2.5 km de la ciudad de El Almendro, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/CDico2gHoJk8Uo928',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Playa El Arenal (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa El Arenal',
        'Playa de agua dulce ubicada a orillas del Lago Cocibolca, con espacios para bañarse, descansar y realizar actividades al aire libre. También ofrece condiciones para acampar y disfrutar del paisaje lacustre.',
        'Morrito',
        'Costas del Lago Cocibolca, municipio de Morrito, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/txnMEaDpBMgGkeBN7',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Reserva Biológica Indio Maíz (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Biológica Indio Maíz',
        'Extensa área protegida de bosque tropical húmedo que alberga una gran diversidad de especies de flora y fauna. Permite realizar recorridos guiados y actividades de observación de la naturaleza en sectores habilitados para visitantes.',
        'San Juan de Nicaragua / El Castillo',
        'Accesos por el sector de Bartola, municipio de El Castillo, y por el sector de San Juan de Nicaragua, Río San Juan, Nicaragua.',
        'https://maps.app.goo.gl/q6Ny54W3Me54TRFE9',
        14
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;


-- DEPARTAMENTO RIVAS (ID: 15)
-- 1. Volcán Concepción (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Volcán Concepción',
        'Volcán activo de forma cónica que alcanza aproximadamente 1,610 metros de altura. Es uno de los principales atractivos naturales de la Isla de Ometepe y ofrece rutas de ascenso para practicar senderismo y observar los paisajes de la isla.',
        'Moyogalpa',
        'Isla de Ometepe, municipio de Moyogalpa, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/Brf6cm9KX3WGh2GZ6',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Reserva Natural Charco Verde y Mariposario (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural Charco Verde y Mariposario',
        'Área natural protegida que combina senderos entre bosques, una laguna de tonalidad verdosa y espacios para la observación de aves y mariposas. Es un sitio ideal para realizar caminatas y disfrutar de la naturaleza de Ometepe.',
        'Altagracia',
        'Comunidad San José del Sur, Isla de Ometepe, municipio de Altagracia, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/ok2VUTsfonCERn3a9',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Museo Precolombino El Ceibo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Museo Precolombino El Ceibo',
        'Museo que conserva una importante colección de piezas arqueológicas de las culturas indígenas que habitaron Ometepe. Sus exhibiciones incluyen objetos de cerámica, piedra, esculturas y petroglifos que permiten conocer las costumbres y creencias de los antiguos pobladores.',
        'Moyogalpa',
        'Finca El Ceibo, Isla de Ometepe, municipio de Moyogalpa, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/Zex53ihieSYW6qXT8',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Cascada San Ramón (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cascada San Ramón',
        'Caída de agua de aproximadamente 50 metros de altura, ubicada en las faldas del volcán Maderas. Para llegar se realiza una caminata por senderos rodeados de bosque, donde es posible observar diferentes especies de flora y fauna.',
        'Altagracia',
        'Comunidad San Ramón, falda sur del volcán Maderas, Isla de Ometepe, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/RTSiq7j6u9DqV9Yn8',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. El Ojo de Agua (Local Comercial - Balneario privado)
-- Nota: Recuerda ajustar el RUC y el id_dueno según corresponda en tu BD.
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'El Ojo de Agua',
        'Reserva natural y balneario de aguas cristalinas de origen natural, rodeado de vegetación tropical. Cuenta con piscinas, espacios recreativos y servicios para disfrutar de un día de descanso en contacto con la naturaleza.',
        'Altagracia',
        'Carretera hacia Santo Domingo, aproximadamente 1.7 km al sureste de la zona de Santo Domingo, Isla de Ometepe, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/GQfZ7jmF4ykUEbwe6',
        15
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000000015', TRUE, 1 FROM nuevo_local;

-- 6. Playa Colorado (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa Colorado',
        'Playa de arena clara ubicada en la costa del océano Pacífico, reconocida por sus olas y condiciones favorables para practicar surf. Es un destino frecuentado por visitantes nacionales e internacionales que buscan disfrutar del mar y los deportes acuáticos.',
        'Tola',
        'Zona de Hacienda Iguana, municipio de Tola, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/uVEzR8CEccR5uxd58',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Playa Maderas (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa Maderas',
        'Playa del océano Pacífico reconocida por sus olas y condiciones para practicar surf. También ofrece paisajes naturales, atardeceres y servicios turísticos en sus alrededores.',
        'San Juan del Sur',
        'Costa del Pacífico, aproximadamente 10 km al norte de San Juan del Sur, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/d7XEWgNBWGDcUvET7',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Playa de San Jorge (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Playa de San Jorge',
        'Playa de agua dulce ubicada a orillas del Lago Cocibolca, desde donde se pueden apreciar vistas panorámicas de la Isla de Ometepe y sus volcanes. Cuenta con espacios recreativos, servicios de alimentación y acceso a paseos en lancha.',
        'San Jorge',
        'Costado del Lago Cocibolca, cerca del Puerto de San Jorge, municipio de San Jorge, Rivas, Nicaragua.',
        'https://maps.app.goo.gl/4o4fYq4h7ZLi7VCw7',
        15
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;


-- REGIÓN AUTÓNOMA DE LA COSTA CARIBE NORTE (ID: 16)
-- 1. Comunidad San Carlos (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Comunidad San Carlos',
        'Comunidad rural donde se pueden realizar recorridos por áreas boscosas, observar la flora y fauna y disfrutar de paisajes naturales.',
        'Waspán',
        'Comunidad San Carlos, municipio de Waspán, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/irLaX5w38BYMAADq7',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Comunidad Wisconsin (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Comunidad Wisconsin',
        'Destino de turismo comunitario que permite conocer la vida cotidiana de sus habitantes y participar en actividades propias de la comunidad.',
        'Waspán',
        'Comunidad Wisconsin, municipio de Waspán, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/CwBTjV1r6D4PzNc78',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Comunidad indígena de Kisalaya (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Comunidad indígena de Kisalaya',
        'Comunidad indígena miskita ubicada en el entorno del río Coco, donde se pueden conocer sus tradiciones, actividades comunitarias y expresiones culturales.',
        'Waspán',
        'Comunidad de Kisalaya, municipio de Waspán, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/MMYKh2hSNN3xYPci9',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Finca Ecológica Pasa Painkira (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Finca Ecológica Pasa Painkira',
        'Iniciativa de ecoturismo comunitario que promueve la producción de aceite de coco, los recorridos por senderos y la educación ambiental.',
        'Waspán',
        'Finca Ecológica Pasa Painkira, municipio de Waspán, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/yYCFSeo26Gh9pdVCA',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. La Piedra del Lalpau (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Piedra del Lalpau',
        'Sitio natural relacionado con leyendas y tradiciones locales, donde se pueden realizar recorridos y observar el paisaje y la vegetación de la zona.',
        'Waspán',
        'La Piedra del Lalpau, municipio de Waspán, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/LMX1tD4jpzjUdLez8',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Muelle de Lamlaya (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Muelle de Lamlaya',
        'Punto de embarque utilizado para realizar recorridos en lancha hacia comunidades cercanas, además de actividades de pesca y observación del entorno natural.',
        'Puerto Cabezas',
        'Comunidad de Lamlaya, municipio de Puerto Cabezas, RACCN, Nicaragua.',
        'https://maps.app.goo.gl/Sw5495gMMrTLuK1UA',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Reserva Biológica Marina Cayos Miskitos (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Biológica Marina Cayos Miskitos',
        'Área protegida marino-costera que alberga arrecifes de coral, pastos marinos, manglares y una amplia diversidad de especies. Permite actividades como paseos en lancha, observación de biodiversidad y buceo.',
        'Puerto Cabezas',
        'Zona marina frente a la costa de la RACCN; comprende sectores de Waspán, Puerto Cabezas y Prinzapolka.',
        'https://maps.app.goo.gl/gp56LBwFGaQqatPY6',
        16
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-
-- REGIÓN AUTÓNOMA DE LA COSTA CARIBE SUR (ID: 17)


-- 1. Reserva Natural de Wawashang (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Reserva Natural de Wawashang',
        'Área natural protegida que conserva bosques tropicales, ríos, manglares y una gran diversidad de flora y fauna. Ofrece oportunidades para realizar senderismo y observar aves y otros animales.',
        'Laguna de Perlas',
        'Reserva compartida por los municipios de Laguna de Perlas, El Tortuguero y Kukra Hill, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/YfyKQ2xmpPtxA25H6',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 2. Cementerio Moravo (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cementerio Moravo',
        'Sitio histórico y cultural que permite conocer parte de la historia y las tradiciones de la comunidad morava en Bluefields.',
        'Bluefields',
        'Bluefields, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/MrCxigKxhMykrkUW8',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 3. Bluff Point (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Bluff Point',
        'Punto de interés natural que ofrece senderos, paisajes costeros y vistas panorámicas del entorno insular. Es un lugar apropiado para caminar y tomar fotografías.',
        'Corn Island',
        'Sector Bluff Point, Isla del Maíz Grande, Corn Island, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/UQXi9scx3SNx7vMJ9',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 4. Little Corn Island (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Little Corn Island',
        'Isla de ambiente tranquilo, reconocida por sus playas, aguas cristalinas y arrecifes. Permite disfrutar de actividades como buceo, snorkel, paseos y recorridos por sus senderos.',
        'Corn Island',
        'Isla del Maíz Pequeña, municipio de Corn Island, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/RuBvWBTCqjQ7NUB26',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 5. Silver Sand Beach (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Silver Sand Beach',
        'Playa de arena clara y aguas del mar Caribe, adecuada para nadar, practicar snorkel y disfrutar del paisaje costero.',
        'Corn Island',
        'Sector Silver Sands, Isla del Maíz Grande, Corn Island, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/BmDASfLkRjoc6ijM6',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 6. Mount Pleasant Hill (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mount Pleasant Hill',
        'Elevación natural que ofrece vistas panorámicas de la isla y sus alrededores. Es un sitio adecuado para realizar caminatas y tomar fotografías del paisaje.',
        'Corn Island',
        'Sector Mount Pleasant, Isla del Maíz Grande, Corn Island, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/sVgPVeKf5Li5AEf26',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 7. Comunidad Kahkabila (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Comunidad Kahkabila',
        'Comunidad de identidad cultural miskita ubicada junto a la Laguna de Perlas. Ofrece experiencias de convivencia con sus habitantes, recorridos locales y alojamiento.',
        'Laguna de Perlas',
        'Comunidad Kahkabila, municipio de Laguna de Perlas, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/9fjVpe9FFgfvDKwU6',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;

-- 8. Casa Museo Afrodescendiente Carl Rigby (Lugar Turístico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Casa Museo Afrodescendiente Carl Rigby',
        'Espacio cultural dedicado a preservar y compartir la historia de la población afrodescendiente de la Costa Caribe Sur. Cuenta con salas que muestran aspectos de su cultura, memoria y tradiciones.',
        'Bluefields',
        'King Street, barrio Cotton Tree, Bluefields, RACCS, Nicaragua.',
        'https://maps.app.goo.gl/Tpc76BCUa9mc2bT6A',
        17
    )
    RETURNING id_local
)
INSERT INTO lugares_turisticos (id_lugar, id_local_padre)
SELECT id_local, id_local FROM nuevo_local;



-- LOCALES COMERCIALES 



-- MANAGUA (ID: 10) - LOCALES COMERCIALES


-- 1. Bar La Terraza (Laguna de Xiloá)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Bar El Rancho',
        'Bar ubicado dentro del Centro Turístico Xiloá, donde los visitantes pueden disfrutar de bebidas y alimentos en un ambiente recreativo cerca de la laguna.',
        'Mateare',
        'Entrada principal del Centro Turístico Xiloá, aproximadamente 160 metros hacia la laguna, Mateare, Managua, Nicaragua.',
        'https://maps.app.goo.gl/P9KjaGQdKQKcPSTb8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001001', TRUE, 1 FROM nuevo_local;

-- 2. Asados Carbón Rojo (Laguna de Xiloá)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Asados Carbón Rojo',
        'Establecimiento de comida tipo parrilla que ofrece carnes asadas y opciones de alimentos para los visitantes de la zona de Xiloá.',
        'Mateare',
        'Desde el portón de entrada de Xiloá, aproximadamente 100 metros a mano derecha, Mateare, Managua, Nicaragua.',
        'https://maps.app.goo.gl/uagpoWZjzpRdXJJq8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001002', TRUE, 1 FROM nuevo_local;

-- 3. Restaurante Alta Mar (Centro Turístico Pochomil)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Restaurante Alta Mar',
        'Restaurante especializado en mariscos y platillos preparados con productos del mar. También cuenta con servicios de hospedaje para los visitantes de Pochomil.',
        'San Rafael del Sur',
        'Centro Turístico Pochomil, San Rafael del Sur, Managua, Nicaragua.',
        'https://maps.app.goo.gl/wNY5sDFRPnJXMhwf8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001003', TRUE, 1 FROM nuevo_local;

-- 4. Brisas de Pochomil (Centro Turístico Pochomil)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Brisas de Pochomil',
        'Restaurante de ambiente familiar que ofrece platillos de mariscos y comidas para los visitantes que disfrutan de la playa.',
        'San Rafael del Sur',
        'Pochomil, aproximadamente 500 metros al oeste de la terminal de buses, San Rafael del Sur, Managua, Nicaragua.',
        'https://maps.app.goo.gl/7SFuGyb1PnABrSzA6l',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001004', TRUE, 1 FROM nuevo_local;

-- 5. Restaurante y Hostal Mar Azul (Centro Turístico Pochomil)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Restaurante y Hostal Mar Azul',
        'Establecimiento que combina servicios de alimentación y hospedaje. Ofrece comidas típicas y platillos de mariscos para turistas y visitantes.',
        'San Rafael del Sur',
        'Centro Turístico Pochomil, San Rafael del Sur, Managua, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Restaurante+Hostal+Mar+Azul+Pochomil',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001005', TRUE, 1 FROM nuevo_local;

-- 6. El Tiscapa Los Ranchos (Mirador Loma de Tiscapa)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'El Tiscapa Los Ranchos',
        'Restaurante especializado en carnes asadas, churrascos y platillos de la gastronomía nicaragüense. Se encuentra en el sector de Paseo Tiscapa, cerca del mirador.',
        'Managua',
        'Paseo Tiscapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/XvAaMhBY74xcneLN6',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001006', TRUE, 1 FROM nuevo_local;

-- 7. Restaurante y Café San Martín (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Restaurante y Café San Martín',
        'Restaurante y cafetería que ofrece comidas, café, bebidas y cócteles. Cuenta con terraza y espacios para compartir en familia o con amigos.',
        'Managua',
        'Puerto Salvador Allende, cuarta etapa, módulo 12, Managua, Nicaragua.',
        'https://maps.app.goo.gl/8Dshi7xgrxsmT8Vx5',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001007', TRUE, 1 FROM nuevo_local;

-- 8. Sabor Chino (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Sabor Chino',
        'Restaurante especializado en comida china que ofrece diferentes platillos de esta gastronomía dentro del complejo turístico Puerto Salvador Allende.',
        'Managua',
        'Puerto Salvador Allende, cuarta etapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/DysJDG4XgPwErzks8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001008', TRUE, 1 FROM nuevo_local;

-- 9. Mixes To Go (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Mixes To Go',
        'Bar y restaurante tipo parrilla que ofrece bebidas preparadas, alitas y diferentes opciones de comida en un ambiente recreativo.',
        'Managua',
        'Puerto Salvador Allende, cuarta etapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/wAxYJS7X8CqGqLn78',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001009', TRUE, 1 FROM nuevo_local;

-- 10. La Bodeguita (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Bodeguita',
        'Restaurante de comida cubana que ofrece opciones gastronómicas y bebidas dentro del complejo turístico Puerto Salvador Allende.',
        'Managua',
        'Puerto Salvador Allende, Managua, Nicaragua.',
        'https://maps.app.goo.gl/2ynSgB8KYdKjCgcn7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001010', TRUE, 1 FROM nuevo_local;


-- 1. Primitivo Experience Steakhouse
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Primitivo Experience Steakhouse',
        'Restaurante especializado en cortes de carne, parrilladas, mariscos y cócteles, con un ambiente diseñado para cenas y celebraciones.',
        'Managua',
        'Edificio Plaza Centroamérica, primer piso, Managua, Nicaragua.',
        'https://maps.app.goo.gl/F88P8v4GLCkGNh727',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001011', TRUE, 1 FROM nuevo_local;

-- 2. Restaurante The Summer
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Restaurante The Summer',
        'Restaurante especializado en mariscos y pescados, con servicio de alimentación y vistas hacia el lago de Managua.',
        'Managua',
        'Puerto Salvador Allende, Managua, Nicaragua.',
        'https://maps.app.goo.gl/FD9gfgTQAPFn8LW47',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001012', TRUE, 1 FROM nuevo_local;

-- 3. Lirios Coffee
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Lirios Coffee',
        'Cafetería que ofrece café, frappes, bebidas especiales y opciones ligeras de alimentación en un ambiente acogedor.',
        'Managua',
        'Managua, Nicaragua. Dirección exacta pendiente de confirmar.',
        'https://maps.app.goo.gl/yiYRYtGRPE6QqQ51A',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001013', TRUE, 1 FROM nuevo_local;

-- 4. La Casa del Café
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Casa del Café',
        'Cafetería especializada en café nacional e internacional, bebidas calientes y frías, acompañamientos y postres.',
        'Managua',
        'Plaza España, Managua, Nicaragua.',
        'https://maps.app.goo.gl/d9o9w9eMakfuvoSf7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001014', TRUE, 1 FROM nuevo_local;

-- 5. Lefloria
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Lefloria',
        'Establecimiento comercial de Managua pendiente de confirmar su actividad comercial y ubicación exacta.',
        'Managua',
        'Managua, Nicaragua. Dirección exacta pendiente de confirmar.',
        'https://maps.app.goo.gl/VvRK6Ui3AWpqmW656',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001015', TRUE, 1 FROM nuevo_local;

-- 6. Chiless
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Chiless',
        'Restaurante que ofrece opciones gastronómicas para el consumo de alimentos y bebidas.',
        'Managua',
        'Managua, Nicaragua. Sucursal pendiente de confirmar.',
        'https://maps.app.goo.gl/ugwAdAYXaToyfPQm8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001016', TRUE, 1 FROM nuevo_local;

-- 7. Ganbei
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Ganbei',
        'Restaurante que ofrece servicio de alimentación y diferentes opciones gastronómicas para sus visitantes.',
        'Managua',
        'Managua, Nicaragua. Sucursal pendiente de confirmar.',
        'https://maps.app.goo.gl/Ayp6fQYYi9755UY78',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001017', TRUE, 1 FROM nuevo_local;

-- 8. Cocoplum
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cocoplum',
        'Establecimiento gastronómico que ofrece servicios de alimentación y bebidas.',
        'Managua',
        'Managua, Nicaragua. Dirección exacta pendiente de confirmar.',
        'https://maps.app.goo.gl/R2JNrAfBxFVrhnsW7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001018', TRUE, 1 FROM nuevo_local;

-- 9. Pupusas Doña Ethel
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Pupusas Doña Ethel',
        'Negocio de comida que ofrece pupusas y platillos tradicionales de la gastronomía salvadoreña.',
        'Managua',
        'Managua, Nicaragua. Dirección exacta pendiente de confirmar.',
        'https://maps.app.goo.gl/pWUCRRt9GHzYRkdKA',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001019', TRUE, 1 FROM nuevo_local;

-- 10. Baho Vilma
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Baho Vilma',
        'Negocio gastronómico especializado en la preparación y venta de baho, uno de los platillos tradicionales de Nicaragua.',
        'Managua',
        'Managua, Nicaragua. Dirección exacta pendiente de confirmar.',
        'https://maps.app.goo.gl/VWDjtXJaYVypKrpa8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001020', TRUE, 1 FROM nuevo_local;

-- 11. Daiquiri
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Daiquiri',
        'Establecimiento gastronómico que ofrece alimentos y bebidas para sus visitantes.',
        'Managua',
        'Managua, Nicaragua. Sucursal pendiente de confirmar.',
        'https://maps.app.goo.gl/ndbGhSTXKMdNEWLE7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001021', TRUE, 1 FROM nuevo_local;

-- 12. Parque de la Alegría
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Parque de la Alegría',
        'Parque de diversiones con juegos mecánicos y atracciones recreativas para niños, jóvenes y adultos.',
        'Managua',
        'Puerto Salvador Allende, Managua, Nicaragua.',
        'https://maps.app.goo.gl/PEShKwCTCKo2c64k8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001022', TRUE, 1 FROM nuevo_local;

-- 13. Speed Karting Managua
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Speed Karting Managua',
        'Centro de entretenimiento que ofrece carreras recreativas de Go Karts en una pista diseñada para la diversión de grupos y visitantes.',
        'Managua',
        'Puerto Salvador Allende, Managua, Nicaragua.',
        'https://maps.app.goo.gl/8MDcRkxVwUPytFdp8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001023', TRUE, 1 FROM nuevo_local;

-
-- MANAGUA (ID: 10) 


-- 1. La Plancha II (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Plancha II',
        'Restaurante especializado en carnes y parrilladas, con servicio de alimentación en un ambiente abierto y vistas hacia el lago de Managua.',
        'Managua',
        'Puerto Salvador Allende, segunda etapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/KwZUdcr5BS5dYS538',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001024', TRUE, 1 FROM nuevo_local;

-- 2. Lakun Payaska (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Lakun Payaska',
        'Restaurante y bar que ofrece comidas y bebidas en un ambiente frente al lago. Cuenta con espacios para compartir y disfrutar del paisaje.',
        'Managua',
        'Puerto Salvador Allende, primera etapa, Managua, Nicaragua.',
        'https://maps.app.goo.gl/bdyCBTACGFwHrKAV7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001025', TRUE, 1 FROM nuevo_local;

-- 3. Los Maderos Bar y Restaurante (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Los Maderos Bar y Restaurante',
        'Restaurante y bar que ofrece alimentos, bebidas y entretenimiento musical. Cuenta con espacios para compartir, bailar y disfrutar de actividades recreativas.',
        'Managua',
        'Puerto Salvador Allende, Managua, Nicaragua.',
        'https://maps.app.goo.gl/m48zBSCaq4pMMGeU6',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001026', TRUE, 1 FROM nuevo_local;

-- 4. Latte Latte (Puerto Salvador Allende)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Latte Latte',
        'Cafetería especializada en bebidas a base de café, tanto calientes como frías, con opciones para compartir y disfrutar de un momento de descanso.',
        'Managua',
        'Puerto Salvador Allende, cuarta etapa, costado oeste de la pista Go Karts, Managua, Nicaragua.',
        'https://maps.app.goo.gl/var1DJs1kyCTfvEF7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001027', TRUE, 1 FROM nuevo_local;

-- 5. Las Cuatro Esquinas (Avenida Bolívar y Centro Histórico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Las Cuatro Esquinas',
        'Espacio gastronómico que reúne diferentes opciones de comida, cafetería, postres y bebidas en un mismo establecimiento. Cuenta con áreas para compartir en familia.',
        'Managua',
        'Avenida Bolívar a Chávez, Managua, Nicaragua.',
        'https://maps.app.goo.gl/9G8kexhznQuTzCqx6',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001028', TRUE, 1 FROM nuevo_local;

-- 6. Tiangue Hugo Chávez (Avenida Bolívar y Centro Histórico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Tiangue Hugo Chávez',
        'Espacio gastronómico que reúne emprendimientos locales dedicados a la venta de comidas típicas, bebidas tradicionales, postres y productos de la cocina nicaragüense.',
        'Managua',
        'Avenida Bolívar a Chávez, frente a la Rotonda Hugo Chávez, Managua, Nicaragua.',
        'https://maps.app.goo.gl/W7DzQxTZbKPUJF8y5',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001029', TRUE, 1 FROM nuevo_local;

-- 7. La Casona Café y Restaurante (Avenida Bolívar y Centro Histórico)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Casona Café y Restaurante',
        'Cafetería y restaurante que ofrece café, bebidas, postres y diferentes opciones de alimentación en un ambiente tranquilo y acogedor.',
        'Managua',
        'Calle Central, Managua, Nicaragua.',
        'https://maps.app.goo.gl/tXQ66wSv8hKyCix66',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001030', TRUE, 1 FROM nuevo_local;

-- 8. Rock Munchies (Los Robles)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Rock Munchies',
        'Restaurante especializado en pizzas, con una temática relacionada con la música rock y un ambiente informal para compartir alimentos y bebidas.',
        'Managua',
        'Los Robles, del restaurante Summer, dos cuadras al lago y 150 metros al oeste, Managua, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Rock+Munchies+Managua',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001031', TRUE, 1 FROM nuevo_local;

-- 9. Alas Buenas (Los Robles)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Alas Buenas',
        'Restaurante especializado en alitas de pollo, con diferentes preparaciones y variedades de salsas. Ofrece servicio para consumir en el local y pedidos para llevar.',
        'Managua',
        'Sector Los Robles, cerca del edificio Pellas, Managua, Nicaragua.',
        'https://maps.app.goo.gl/TM8igJCfEedKj3pt8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001032', TRUE, 1 FROM nuevo_local;

-- 10. Restaurante Don Cándido (Los Robles)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Restaurante Don Cándido',
        'Restaurante especializado en cortes de carne, parrilladas y vinos. Ofrece un ambiente adecuado para reuniones, celebraciones y comidas familiares.',
        'Managua',
        'De donde fue el Chamán, 75 varas al sur, 15 Avenida Sureste, Los Robles, Managua, Nicaragua.',
        'https://maps.app.goo.gl/WRBG5CBFkzCukirU7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001033', TRUE, 1 FROM nuevo_local;

-- 11. La Loma (Los Robles)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'La Loma',
        'Restaurante y bar que ofrece alimentos, cócteles y bebidas en un ambiente social con música y espacios para compartir y bailar.',
        'Managua',
        '19 Avenida Sureste, sector Los Robles, Managua, Nicaragua.',
        'https://maps.app.goo.gl/Ne3QyBXxx6zF8D5D8',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001034', TRUE, 1 FROM nuevo_local;

-- 12. Cocina de Doña Haydée (Carretera a Masaya)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Cocina de Doña Haydée',
        'Restaurante especializado en gastronomía nicaragüense que ofrece platillos tradicionales, sopas, carnes y comidas típicas preparadas con recetas nacionales.',
        'Managua',
        'Carretera a Masaya, kilómetro 4.5, Paseo de la Unión Europea, Managua, Nicaragua.',
        'https://maps.app.goo.gl/TYNhKp4Gw48BT4wz7',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001035', TRUE, 1 FROM nuevo_local;

-- 13. Don Ceviche (Plaza Eclipse)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Don Ceviche',
        'Restaurante especializado en ceviches y mariscos. También ofrece diferentes platillos para compartir en un ambiente informal.',
        'Managua',
        'Plaza Eclipse, Managua, Nicaragua.',
        'hhttps://maps.app.goo.gl/wpBQaiWXx8LbQRm79',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001036', TRUE, 1 FROM nuevo_local;

-- 14. Habanero Burger House (Plaza Chichén Itzá)
WITH nuevo_local AS (
    INSERT INTO locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES (
        'Habanero Burger House',
        'Restaurante de comida rápida especializado en hamburguesas de carne y pollo, además de acompañamientos y diferentes opciones para compartir.',
        'Managua',
        'Plaza Chichén Itzá, costado oeste del Estadio Nacional, Managua, Nicaragua.',
        'https://www.google.com/maps/search/?api=1&query=Habanero+Burger+House+Managua',
        10
    )
    RETURNING id_local
)
INSERT INTO locales_comerciales (id_local, codigo_ruc, es_independiente, id_dueno)
SELECT id_local, 'J0310000001037', TRUE, 1 FROM nuevo_local;