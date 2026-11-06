/* ******************************************************************* */
/* 01. INSERTAR                                                        */
/*     INSERT INTO __ VALUES ( __ , __ )                               */
/* ******************************************************************* */
INSERT INTO AUTORES VALUES 
(null, 'Gabriel García Márquez');

INSERT INTO AUTORES (autor_clave, autor_nombre) VALUES 
(null,'Pablo Neruda');

INSERT INTO AUTORES (autor_nombre) VALUES 
('Edgar Allan Poe');

INSERT INTO AUTORES VALUES 
(null, 'Rafael Pombo'), 
(null, 'Rubén Darío'), 
(null, 'Vargas Llosa');

INSERT INTO AUTORES (autor_nombre) VALUES 
('Alfonso Reyes'),
('Rómulo Gallego');

INSERT INTO EDITORIALES VALUES 
(null, 'Norma', 'Cl 15 Cra 15', '3153153151'), 
(null, 'Planeta', 'Cl 16 Cra 16', '3163163163'), 
(null, 'Panamericana', 'Cl 17 Cra 17', '3173173171'), 
(null, 'Torre de Papel', 'Cl 18 Cra 18', '3183183181'); 

INSERT INTO LIBROS VALUES 
(null, 2, 'Principito', 'Español', 'Infantil', 'impreso' ),
(null, 4, 'Juegos del Hambre', 'Inglés', 'Juvenil', 'impreso' ),
(null, 4, 'Harry Potter', 'Español', 'Juvenil', 'pdf' ),
(null, 1, 'Henry Porras', 'Inglés', 'Pirata', 'cd' ),
(null, 2, 'Crimen y Castigo', 'Español', 'Adulto', 'interactivo' ),
(null, 1, 'Crónica de una muerte anunciada', 'Francés', 'Adulto mayor', 'impreso' ),
(null, 4, 'El Mio Cid', 'Alemán', 'Fantasía', 'pdf' );

INSERT INTO LIBROS_AUTORES VALUES 
(1, 2),
(2, 2),
(3, 1),
(2, 2),
(7, 5),
(6, 4);

INSERT INTO SOCIOS VALUES 
(null, 'Albeiro Ramos', 'Av. Siempre Viva', 'A', '3153153156',sha1('12345'), 1),
(null, 'Johan Suesca', 'Calle 11 con 10', 'A', '3153305269',sha1('12345'), 1),
(null, 'Wilmer Camargo', 'Calle 12 con 11', 'B', '310310310',sha1('12345'), 0),
(null, 'Andrés Matallana', 'Calle 13 con 12', 'C', '3113113111',sha1('12345'), 1),
(null, 'Daniel Rodríguez', 'Calle 14 con 13', 'A', '3123123122',sha1('12345'), 0),
(null, 'Cristopher Benavides', 'Calle 15 con 14', 'B', '3133133131',sha1('12345'), 0),
(null, 'Luis Olaya', 'Calle 16 con 15', 'C', '3173173171',sha1('12345'), 1);

/* ******************************************************************* */
/* 02. ACTUALIZAR                                                      */
/*     UPDATE __ SET __ = __ WHERE __ = __                             */
/* ******************************************************************* */
UPDATE AUTORES SET 
autor_nombre = 'Vicente Fernández'
WHERE autor_clave = 5;

UPDATE SOCIOS SET 
socio_nombre = 'Pedro Infante',
socio_direccion = 'Calle 15 Cra 12',
socio_categoria = 'B'
WHERE socio_clave = 1;

/* ******************************************************************* */
/* 03. ELIMINAR                                                        */
/*     DELETE FROM __ WHERE __ = __                                    */
/* ******************************************************************* */
DELETE FROM AUTORES 
WHERE autor_clave = 6;

DELETE FROM AUTORES;

/* ******************************************************************* */
/* 04. CONSULTAR                                                       */
/* ******************************************************************* */

-- ------------------------------------------------------------------- --
-- 04.01. Generales. ------------------------------------------------- --
--        SELECT * FROM __ ------------------------------------------- --
-- ------------------------------------------------------------------- --
SELECT * FROM AUTORES;
SELECT * FROM EDITORIALES;
SELECT * FROM LIBROS;
SELECT * FROM LIBROS_AUTORES;
SELECT * FROM SOCIOS;

-- ------------------------------------------------------------------- --
-- 04.02. Específicas. ----------------------------------------------- --
--        SELECT __ , __ FROM __ ------------------------------------- --
-- ------------------------------------------------------------------- --
SELECT socio_nombre, socio_telefono FROM SOCIOS;

-- ------------------------------------------------------------------- --
-- 04.03 Con Criterios. ---------------------------------------------- --
--       SELECT __ , __ FROM __ WHERE __ = __ ------------------------ --
-- ------------------------------------------------------------------- --
SELECT socio_nombre, socio_direccion, socio_telefono FROM SOCIOS
WHERE socio_clave = 5;