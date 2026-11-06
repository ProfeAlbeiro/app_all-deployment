/* ************************************************************************************* */
/* ------------------------------ AUTOMATIZACIÓN DE BBDD ------------------------------- */
/* --------------------------------------- VIEWS --------------------------------------- */
/* ----------------- VISTAS, DISPARADORES, PROCEDIMIENTOS ALMACENADOS ------------------ */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 1. VIEWS                                                                              */
/* 1.1. Crear Vista : ........... CREATE VIEW _ AS SELECT _ FROM _ WHERE _               */
/* 1.2. Usar Vista : ............ SELECT _ FROM _                                        */
/* 1.3. Modificar Vista : ....... ALTER VIEW _ AS SELECT _ FROM _ WHERE _                */
/* 1.4. Eliminar Vista : ........ DROP VIEW _                                            */
/* 2. EJEMPLOS DE VISTAS                                                                 */
/* ------------------------------------------------------------------------------------- */
/* BIBLIOGRAFÍA                                                                          */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* EN CONSOLA: XAMPP / SHELL / cd mysql/bin / mysql -h localhost -u root -p / ENTER      */
/* ************************************************************************************* */


/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ------------------------------------- 1. VIEWS -------------------------------------- */
/* --------------------------------------- VISTAS -------------------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 1.1. Crear Vista. ------------------------------------------------------------------- --
--      CREATE VIEW _ AS SELECT _ FROM _ WHERE _ : ------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE VIEW VW_USUARIOS AS
SELECT 
	R.codigo_rol, 
	nombre_rol, 
    codigo_user, 
    nombres_user, 
    apellidos_user, 
    correo_user
FROM ROLES AS R
INNER JOIN USUARIOS AS U
ON R.codigo_rol = U.codigo_rol;

-- ------------------------------------------------------------------------------------- --
-- 1.2. Usar Vista. -------------------------------------------------------------------- --
--      SELECT _ FROM _ : -------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SELECT * FROM VW_USUARIOS;
SELECT nombre_rol, codigo_user, nombres_user, correo_user FROM VW_USUARIOS;

-- ------------------------------------------------------------------------------------- --
-- 1.3. Modificar Vista. --------------------------------------------------------------- --
--      ALTER VIEW _ AS SELECT _ FROM _ WHERE _ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER VIEW VW_USUARIOS (rol, codigo, nombres, apellidos, email) AS
SELECT
    nombre_rol, 
    codigo_user, 
    nombres_user, 
    apellidos_user, 
    correo_user
FROM ROLES AS R
INNER JOIN USUARIOS AS U
ON R.codigo_rol = U.codigo_rol;

-- ------------------------------------------------------------------------------------- --
-- 1.4. Eliminar Vista. ---------------------------------------------------------------- --
--      DROP VIEW : -------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
DROP VIEW VW_USUARIOS;


/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ------------------------------- 2. EJEMPLOS DE VISTAS ------------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
## Consultar Usuarios Registrados. Crear Vista
CREATE VIEW VW_CREDENTIAL AS
SELECT 
	R.codigo_rol,
    nombre_rol,
    codigo_user,
    nombres_user,
    apellidos_user,
    correo_user,    
    identificacion_cred,
    fecha_ingreso_cred,    
    estado_cred
FROM ROLES AS R
INNER JOIN USUARIOS AS U
ON R.codigo_rol = U.codigo_rol
INNER JOIN CREDENCIALES AS C
ON U.codigo_user = C.codigo_cred;

-- ------------------------------------------------------------------------------------- --
## Consultar Usuarios Registrados. Usar Vista
SELECT * FROM VW_CREDENTIAL;

-- ------------------------------------------------------------------------------------- --
## Consultar Usuarios Registrados. Modificar Vista
ALTER VIEW VW_CREDENTIAL 
	(rol, codigo, nombres, apellidos, email, identificacion, ingreso, estado) AS
SELECT 	
    nombre_rol,
    codigo_user,
    nombres_user,
    apellidos_user,
    correo_user,    
    identificacion_cred,
    fecha_ingreso_cred,    
    estado_cred
FROM ROLES AS R
INNER JOIN USUARIOS AS U
ON R.codigo_rol = U.codigo_rol
INNER JOIN CREDENCIALES AS C
ON U.codigo_user = C.codigo_cred;

-- ------------------------------------------------------------------------------------- --
## Consultar Usuarios Registrados. Eliminar Vista
DROP VIEW VW_CREDENTIAL;

/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
## Consultar stock, precio de venta y subtotal. Crear Vista
CREATE VIEW VW_STOCK_VENTA_SUBTOTAL AS
SELECT 
	nombre_categoria AS categoria,
	P.codigo_producto AS codigo,
	nombre_producto AS nombre,
	stock_productos AS stock,
	precio_producto AS precio_venta,
	stock_productos * precio_producto AS subtotal_stock
FROM CATEGORIAS AS C
INNER JOIN PRODUCTOS AS P
ON C.codigo_categoria = P.codigo_categoria
ORDER BY C.nombre_categoria ASC;

-- ------------------------------------------------------------------------------------- --
## Consultar stock, precio de venta y subtotal. Usar Vista
SELECT * FROM VW_STOCK_VENTA_SUBTOTAL;

-- ------------------------------------------------------------------------------------- --
## Consultar stock, precio de venta y subtotal. Eliminar Vista
DROP VIEW VW_STOCK_VENTA_SUBTOTAL;

/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Ventas. Crear Vista
CREATE VIEW VW_INVENTARIO_VENTAS AS
SELECT 
	nombre_categoria AS categoria,
	P.codigo_producto AS codigo,
	nombre_producto AS nombre,
	IFNULL(SUM(cantidad_productos),0) AS cant_venta,
	precio_producto AS precio_venta,
	IFNULL(SUM(cantidad_productos),0) * precio_producto AS subtotal_ventas
FROM CATEGORIAS AS C
INNER JOIN PRODUCTOS AS P
ON C.codigo_categoria = P.codigo_categoria
LEFT JOIN LISTA_PRODUCTOS_PEDIDOS AS LPP
ON P.codigo_producto = LPP.codigo_producto
GROUP BY P.codigo_producto
ORDER BY C.nombre_categoria ASC, cant_venta DESC;


-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Ventas. Usar Vista
SELECT * FROM VW_INVENTARIO_VENTAS;

-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Ventas. Eliminar Vista
DROP VIEW VW_INVENTARIO_VENTAS;

/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Compras. Crear Vista
CREATE VIEW VW_INVENTARIO_COMPRAS AS
SELECT 
	nombre_categoria AS categoria,
	P.codigo_producto AS codigo,
	nombre_producto AS nombre,
	IFNULL(SUM(cantidad_productos_compra),0) AS cant_compra,
	IFNULL(precio_producto_compra,0) AS precio_compra,
	IFNULL(SUM(cantidad_productos_compra) * precio_producto_compra,0) AS subtotal_compras
FROM CATEGORIAS AS C
INNER JOIN PRODUCTOS AS P
ON C.codigo_categoria = P.codigo_categoria
LEFT JOIN LISTA_PRODUCTOS_COMPRADOS AS LPC
ON P.codigo_producto = LPC.codigo_producto
GROUP BY P.codigo_producto
ORDER BY C.nombre_categoria ASC, cant_compra DESC;

-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Compras. Usar Vista
SELECT * FROM VW_INVENTARIO_COMPRAS;

-- ------------------------------------------------------------------------------------- --
## Consultar Inventario Ventas. Eliminar Vista
DROP VIEW VW_INVENTARIO_COMPRAS;

/* ************************************************************************************* */












-- ------------------------------------------------------------------------------------- --
## Consultar diferencia entre ventas y compras

CREATE VIEW VW_INVENTARIO_PARCIAL AS
SELECT STOCK.categoria, STOCK.codigo, STOCK.nombre, STOCK.stock, STOCK.precio_venta,
STOCK.subtotal_stock, VENTAS.cant_venta, VENTAS.subtotal_ventas, COMPRAS.cant_compra,
COMPRAS.precio_compra, COMPRAS.subtotal_compras,
(STOCK.subtotal_stock + VENTAS.subtotal_ventas) - COMPRAS.subtotal_compras AS gan_bruta,
VENTAS.subtotal_ventas - COMPRAS.subtotal_compras AS gan_neta
FROM VW_INVENTARIO_STOCK AS STOCK
LEFT JOIN VW_INVENTARIO_VENTAS AS VENTAS
ON STOCK.codigo = VENTAS.codigo
LEFT JOIN VW_INVENTARIO_COMPRAS AS COMPRAS
ON STOCK.codigo = COMPRAS.codigo
ORDER BY STOCK.codigo;

-- ------------------------------------------------------------------------------------- --
## Consultar la cantidad en stock, precio de ventas y precio de compras

CREATE VIEW VW_TOTALES AS
SELECT 
SUM(subtotal_stock) AS total_stock,
SUM(subtotal_ventas) AS total_ventas,
SUM(subtotal_compras) AS total_compras,
SUM(gan_bruta) AS total_gan_bruta,
SUM(gan_neta) AS total_gan_neta
FROM VW_INVENTARIO_PARCIAL;

-- ------------------------------------------------------------------------------------- --
## Consultar total del Stock

CREATE VIEW VW_TOTALES_INVENTARIO AS
SELECT SUM(subtotal_stock) AS total_stock
FROM VW_INVENTARIO;

-- ------------------------------------------------------------------------------------- --
## Consultar productos por categoría

CREATE VIEW VW_PRODUCTOS_MERCADO AS 
SELECT nombre_categoria, nombre_producto, precio_producto 
FROM CATEGORIAS 
INNER JOIN PRODUCTOS
ON categorias.codigo_categoria = productos.codigo_categoria
WHERE categorias.codigo_categoria = 1;

-- ------------------------------------------------------------------------------------- --
## Consultar los productos de la categoría 4

CREATE VIEW VW_PRODUCTOS_ALIMENTOS
(categoria, nombre, precio) AS
SELECT nombre_categoria, nombre_producto, precio_producto
FROM CATEGORIAS 
INNER JOIN PRODUCTOS
ON categorias.codigo_categoria = productos.codigo_categoria
WHERE categorias.codigo_categoria = 4;

-- ------------------------------------------------------------------------------------- --
## 

CREATE VIEW VW_PRODUCTOS_BEBIDAS AS
SELECT 
	C.nombre_categoria AS categoria, 
	P.nombre_producto AS producto, 
	P.precio_producto AS precio
FROM CATEGORIAS AS C
INNER JOIN PRODUCTOS AS P
ON C.codigo_categoria = P.codigo_categoria
WHERE C.codigo_categoria = 3;

UPDATE productos SET 
	precio_producto = precio_producto + 200 
WHERE nombre_producto = 'Tomate';

-- ------------------------------------------------------------------------------------- --
-- 1.2. Usar Vista. -------------------------------------------------------------------- --
--      SELECT _ FROM _ : -------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

SELECT * FROM VW_USUARIOS;
SELECT * FROM VW_INVENTARIO_STOCK;
SELECT * FROM VW_INVENTARIO_VENTAS;
SELECT * FROM VW_INVENTARIO_COMPRAS;
SELECT * FROM VW_INVENTARIO_PARCIAL;
SELECT * FROM VW_TOTALES;
SELECT * FROM VW_PRODUCTOS_MERCADO;
SELECT * FROM VW_PRODUCTOS_ALIMENTOS;
SELECT * FROM VW_PRODUCTOS_BEBIDAS;

-- ------------------------------------------------------------------------------------- --
-- 1.3. Modificar Vista. --------------------------------------------------------------- --
--      ALTER VIEW _ AS SELECT _ FROM _ WHERE _ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER VIEW VW_PRODUCTOS_ALIMENTOS
(categoria, nombre, precio) AS
SELECT nombre_categoria, nombre_producto, precio_producto
FROM CATEGORIAS 
INNER JOIN PRODUCTOS
ON categorias.codigo_categoria = productos.codigo_categoria
WHERE categorias.codigo_categoria = 2;

-- ------------------------------------------------------------------------------------- --
-- 1.4. Eliminar Vista. ---------------------------------------------------------------- --
--      DROP VIEW : -------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

DROP VIEW VW_USUARIOS;
DROP VIEW VW_INVENTARIO_STOCK;
DROP VIEW VW_INVENTARIO_VENTAS;
DROP VIEW VW_INVENTARIO_COMPRAS;
DROP VIEW VW_INVENTARIO_PARCIAL;
DROP VIEW VW_TOTALES;
DROP VIEW VW_PRODUCTOS_MERCADO;
DROP VIEW VW_PRODUCTOS_ALIMENTOS;
DROP VIEW VW_PRODUCTOS_BEBIDAS;

/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ----------------------------------- BIBLIOGRAFÍA ------------------------------------ */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- Tutoriales de Programación ya. (s.f.). MySQL ya. Recuperado el 15 de Mayo de 2022,    --
--      de https://www.tutorialesprogramacionya.com/mysqlya/                             --
-- ------------------------------------------------------------------------------------- --
-- Pildoras Informáticas. (16 de Julio de 2015). Curso SQL.                              --
--      Recuperado el 16 de Abril de 2022, de [Archivo de Vídeo]                         --
--      https://www.youtube.com/playlist?list=PLU8oAlHdN5Bmx-LChV4K3MbHrpZKefNwn         --
--      página web                                                                       --
-- ------------------------------------------------------------------------------------- --