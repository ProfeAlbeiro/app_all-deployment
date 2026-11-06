/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* ------------------------------------- UNA TABLA ------------------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 1. CONSULTAS DE ACCIÓN [Inicio] : . INSERT INTO, UPDATE, DELETE                       */
/* 1.1. Crear o Registrar : .......... INSERT INTO __ VALUES ( __ , __ )                 */
/* 1.1.1. Datos Correctos : .......... INSERT INTO __ VALUES ( __ , __ )                 */
/* ------------------------------------------------------------------------------------- */
/* BIBLIOGRAFÍA                                                                          */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* EN CONSOLA: XAMPP / SHELL / cd mysql/bin / mysql -h localhost -u root -p / ENTER      */
/* ************************************************************************************* */


/* ************************************************************************************* */
/* -------------------------- 1. CONSULTAS DE ACCIÓN [Inicio] -------------------------- */
/* ---------------------------- INSERT INTO, UPDATE, DELETE ---------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 1.1. Crear o Registrar. ------------------------------------------------------------- --
--      INSERT INTO __ VALUES ( __ , __ ) : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 1.1.1. Datos Correctos -------------------------------------------------------------- --
--        INSERT INTO __ VALUES ( __ , __ ) : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
INSERT INTO ROLES VALUES 
(null, 'admin'),
(null, 'person'),
(null, 'customer'),
(null, 'seller');

INSERT INTO USUARIOS VALUES 
(1, 'admin-1', 'Albeiro', 'Ramos', 'profealbeiro2020@gmail.com');

INSERT INTO CREDENCIALES VALUES
('admin-1', '../../img/usuario.png', 123456, "2022-06-11", sha1('12345'), 1);

INSERT INTO USUARIOS VALUES 
(1, 'admin-2', 'Pepito', 'Perez', 'pepito@gmail.com'),
(3, 'customer-1', 'Marinita', 'García', 'marinita@gmail.com'),
(3, 'customer-2', 'Jorge', 'Campos', 'jorge@gmail.com'),
(3, 'customer-3', 'Ricardo', 'Quevedo', 'ricardo@gmail.com'),
(3, 'customer-4', 'José Miguel', 'Ríos', 'jose@gmail.com'),
(4, 'seller-1', 'Jesús', 'Briceño', 'jesus@gmail.com'),
(4, 'seller-2', 'Alfonso', 'Camacho', 'alfonso@gmail.com');

INSERT INTO USUARIOS VALUES 
(2, 'person-1', 'Ezequiel', 'Pantoja', 'ezequiel@gmail.com'),
(2, 'person-2', 'Camilo', 'Céspedes', 'camilo@gmail.com');

INSERT INTO CREDENCIALES VALUES
('customer-1', '../../img/usuario.png', 456789, "2022-07-12", sha1('12345'), 1),
('seller-1', '../../img/usuario.png', 987654, "2022-08-13", sha1('12345'), 1),
('seller-2', '../../img/usuario.png', 852963, "2022-08-28", sha1('12345'), 0),
('customer-2', '../../img/usuario.png', 654321, "2022-08-28", sha1('12345'), 1),
('customer-3', '../../img/usuario.png', 333333, "2022-09-15", sha1('12345'), 0),
('customer-4', '../../img/usuario.png', 444444, "2022-09-16", sha1('12345'), 0);

INSERT INTO MENSAJES VALUES
('person-1', '2022-08-15', 'Solicitud de Información', 'Quisiera saber sobre... '),
('seller-1', '2022-08-27', 'Reunión Vendedores', 'El próximo fin de semana...'),
('person-2', '2022-08-27', 'Productos a crédito', 'Qué papeles piden para...'),
('admin-1', '2022-08-31', 'Mantenimiento Sistema', 'Se informa a los usuarios...'),
('customer-1', '2022-09-01', 'No tengo el producto', 'Aun no llega el producto'),
('customer-1', '2022-10-02', 'Devolución Dinero', 'Aun no llega el producto'),
('seller-2', '2022-10-02', 'Reunión por Cumpleaños', 'El próximo 6 de Octubre...');

INSERT INTO VENDEDORES VALUES
('seller-1', 1500000.00),
('seller-2', 1800000.00);

INSERT INTO CLIENTES VALUES
('customer-1', '2005-05-05'),
('customer-2', '1983-04-1'),
('customer-3', '1981-05-16'),
('customer-4', '2007-08-20');

INSERT INTO CATEGORIAS VALUES 
(null, 'Mercado'),
(null, 'Alimentos'),
(null, 'Bebidas'),
(null, 'Aseo');

INSERT INTO PRODUCTOS VALUES 
(1, 'prod-1', 'Papa', 950.03, 1.00, 'libra', 10),
(1, 'prod-2', 'Zanahoria', 630.33, 1.00, 'libra', 20),
(1, 'prod-3', 'Tomate', 750.55, 1.00, 'libra', 30),
(2, 'prod-4', 'Arroz', 2500.00, 500.00, 'gramos', 40),
(2, 'prod-5', 'aceite', 10500.00, 1.00, 'litro', 50),
(2, 'prod-6', 'Lentejas', 3500.00, 1000.00, 'gramos', 60),
(3, 'prod-7', 'Agua', 3000.00, 1.50, 'litro', 50),
(3, 'prod-8', 'Gaseosa', 3500.00, 2.50, 'litro', 40),
(3, 'prod-9', 'Cerveza', 2500.00, 1.00, 'botella', 30),
(4, 'prod-10', 'Jabón Baño', 1200.00, 285.00, 'gramos', 20),
(4, 'prod-11', 'Jabón Ropa', 12000.00, 1000.00, 'gramos', 10),
(4, 'prod-12', 'Shampoo', 18500.00, 750.00, 'mililitros', 5);

INSERT INTO PEDIDOS VALUES
('customer-1','pedido-1','2022-10-13','Bogotá','Av Siempre Viva',
	23850.90,4531.67,28382.57,'entregado'),
('customer-2','pedido-2','2022-10-14','Cali','Calle 3 con 4',
	3500.00,665.00,4165.00,'enviado'),
('customer-1','pedido-3','2022-10-14','Bogotá','Carrera 5 con 7',
	6952.85,1321.04,8273.89,'debe'),
('customer-2','pedido-4','2022-10-15','Cali','Calle 2 con 8',
	46100.00,8759.00,54859.00,'cotización'),
('customer-1','pedido-5','2022-11-02','Medellín','Tv 8 con 15',
	74000.00,14060.00,88060.00,'entregado');

INSERT INTO LISTA_PRODUCTOS_PEDIDOS VALUES
('pedido-1', 'prod-1', 3),
('pedido-1', 'prod-5', 2),
('pedido-2', 'prod-6', 1),
('pedido-3', 'prod-2', 5),
('pedido-3', 'prod-1', 4),
('pedido-4', 'prod-10', 3),
('pedido-4', 'prod-11', 2),
('pedido-4', 'prod-6', 1),
('pedido-4', 'prod-7', 5),
('pedido-5', 'prod-12', 4);

INSERT INTO VENDEDORES_PEDIDOS VALUES
('seller-1', 'pedido-1'),
('seller-2', 'pedido-4');

INSERT INTO COMPRAS VALUES
('ABC-115', '2022-09-17', 31500, 'img-factura-ABC-115'),
('ABC-116', '2022-09-18', 39160, 'img-factura-ABC-116');

INSERT INTO LISTA_PRODUCTOS_COMPRADOS VALUES
('ABC-115', 'prod-1', 900, 5),
('ABC-115', 'prod-3', 700, 10),
('ABC-115', 'prod-6', 3000, 2),
('ABC-115', 'prod-9', 2000, 7),
('ABC-116', 'prod-1', 920, 3),
('ABC-116', 'prod-4', 2200, 7),
('ABC-116', 'prod-8', 3000, 7);


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