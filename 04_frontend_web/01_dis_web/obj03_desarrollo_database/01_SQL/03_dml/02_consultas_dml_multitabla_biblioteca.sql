/* ******************************************************************* */
/* 01. JOIN                                                            */
/* ******************************************************************* */
-- Muestre todos los libros que tengan editorial

SELECT * FROM LIBROS
JOIN EDITORIALES
ON LIBROS.editorial_clave=EDITORIALES.editorial_clave;

/* ******************************************************************* */
/* 02. LEFT JOIN                                                            */
/* ******************************************************************* */
-- Muestre todos los libros que tengan editorial
SELECT * FROM LIBROS
LEFT JOIN EDITORIALES
ON LIBROS.editorial_clave=EDITORIALES.editorial_clave;

/* ******************************************************************* */
/* 03. RIGHT JOIN                                                            */
/* ******************************************************************* */
-- Muestre todas las editoriales con sus libros
SELECT * FROM LIBROS
RIGHT JOIN EDITORIALES
ON LIBROS.editorial_clave=EDITORIALES.editorial_clave;

-- Muestre todas las editoriales que tengan libros asociados
SELECT * FROM EDITORIALES
RIGHT JOIN LIBROS
ON LIBROS.editorial_clave=EDITORIALES.editorial_clave;

-- Muestre todas las editoriales que tengan libros asociados
SELECT * FROM EDITORIALES
RIGHT JOIN LIBROS
ON EDITORIALES.editorial_clave=LIBROS.editorial_clave;

/* ******************************************************************* */
/* 04. INNER JOIN                                                            */
/* ******************************************************************* */

-- Muestre todos los libros que tengan editorial
SELECT * FROM LIBROS
INNER JOIN EDITORIALES
ON LIBROS.editorial_clave=EDITORIALES.editorial_clave;

SELECT * FROM LIBROS AS l
INNER JOIN EDITORIALES AS e
ON l.editorial_clave = e.editorial_clave;

SELECT
	e.editorial_clave,
    editorial_nombre,
    editorial_direccion,
    editorial_telefono,
    libro_clave,
    libro_titulo
FROM LIBROS AS l
INNER JOIN EDITORIALES AS e
ON l.editorial_clave = e.editorial_clave;

SELECT
	e.editorial_clave AS Clave_Editorial,
    editorial_nombre AS Nombre,
    editorial_direccion AS Dirección,
    editorial_telefono AS Teléfono,
    libro_clave AS Código_Libro,
    libro_titulo AS Título
FROM LIBROS AS l
INNER JOIN EDITORIALES AS e
ON l.editorial_clave = e.editorial_clave;

SELECT 
	e.editorial_clave AS CódigoEditorial,
    editorial_nombre AS Nombre,
	l.libro_clave AS CódigoLibro,
    libro_titulo AS Título,
    autor_nombre AS Autor
FROM EDITORIALES AS e
INNER JOIN LIBROS AS l
ON e.editorial_clave = l.editorial_clave
INNER JOIN LIBROS_AUTORES AS la
ON l.libro_clave = la.libro_clave
INNER JOIN AUTORES AS a
ON la.autor_clave = a.autor_clave;

/* ******************************************************************* */
/* 05. CONSULTAS ERRÓNEAS                                              */
/* ******************************************************************* */

SELECT * FROM LIBROS
INNER JOIN EDITORIALES;

SELECT * FROM LIBROS
INNER JOIN EDITORIALES
ON editorial_clave = editorial_clave;
