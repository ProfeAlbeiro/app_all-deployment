-- =====================================================
-- BASE DE DATOS: bbdd_ventas
-- Estado: 1FN ✅ + 2FN ✅ + 3FN ✅ + RBAC (punto 4) ✅
-- Pendiente: punto 5 (pagos, métodos de pago, domicilios,
--            comisiones, proveedores ampliados)
-- SIN DATOS SEMILLA
-- =====================================================

DROP DATABASE IF EXISTS bbdd_ventas;
CREATE DATABASE bbdd_ventas DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bbdd_ventas;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1) SEGURIDAD / RBAC  (punto 4)
-- =====================================================

-- -----------------------------------------------------
-- Table MODULOS
-- -----------------------------------------------------
CREATE TABLE MODULOS (
  codigo_modulo INT NOT NULL AUTO_INCREMENT,
  nombre_modulo VARCHAR(50) NOT NULL,
  descripcion_modulo VARCHAR(150) NULL,
  ruta_modulo VARCHAR(100) NULL,
  icono_modulo VARCHAR(50) NULL,
  orden_modulo INT NOT NULL DEFAULT 0,
  estado_modulo TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (codigo_modulo),
  UNIQUE INDEX uq_nombre_modulo (nombre_modulo ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table ACCIONES
-- -----------------------------------------------------
CREATE TABLE ACCIONES (
  codigo_accion INT NOT NULL AUTO_INCREMENT,
  nombre_accion VARCHAR(30) NOT NULL,
  descripcion_accion VARCHAR(150) NULL,
  PRIMARY KEY (codigo_accion),
  UNIQUE INDEX uq_nombre_accion (nombre_accion ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table ROLES
-- -----------------------------------------------------
CREATE TABLE ROLES (
  codigo_rol INT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL,
  descripcion_rol VARCHAR(150) NULL,
  jerarquia_rol INT NOT NULL DEFAULT 0,
  estado_rol TINYINT NOT NULL DEFAULT 1,
  fecha_creacion_rol DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (codigo_rol),
  UNIQUE INDEX uq_nombre_rol (nombre_rol ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table USUARIOS
-- -----------------------------------------------------
CREATE TABLE USUARIOS (
  codigo_user VARCHAR(10) NOT NULL,
  nombres_user VARCHAR(50) NOT NULL,
  apellidos_user VARCHAR(50) NOT NULL,
  correo_user VARCHAR(100) NOT NULL,
  telefono_user VARCHAR(30) NULL,
  estado_user TINYINT NOT NULL DEFAULT 1,
  fecha_creacion_user DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (codigo_user),
  UNIQUE INDEX uq_correo_user (correo_user ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table PERMISOS
-- -----------------------------------------------------
CREATE TABLE PERMISOS (
  codigo_permiso INT NOT NULL AUTO_INCREMENT,
  codigo_modulo INT NOT NULL,
  codigo_accion INT NOT NULL,
  descripcion_permiso VARCHAR(150) NULL,
  PRIMARY KEY (codigo_permiso),
  UNIQUE INDEX uq_permiso_modulo_accion (codigo_modulo ASC, codigo_accion ASC),
  INDEX ind_permiso_modulo (codigo_modulo ASC),
  INDEX ind_permiso_accion (codigo_accion ASC),
  CONSTRAINT fk_permiso_modulo
    FOREIGN KEY (codigo_modulo)
    REFERENCES MODULOS (codigo_modulo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_permiso_accion
    FOREIGN KEY (codigo_accion)
    REFERENCES ACCIONES (codigo_accion)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table ROLES_PERMISOS (N:M)
-- -----------------------------------------------------
CREATE TABLE ROLES_PERMISOS (
  codigo_rol INT NOT NULL,
  codigo_permiso INT NOT NULL,
  PRIMARY KEY (codigo_rol, codigo_permiso),
  INDEX ind_rol_permiso_rol (codigo_rol ASC),
  INDEX ind_rol_permiso_permiso (codigo_permiso ASC),
  CONSTRAINT fk_rol_permiso_rol
    FOREIGN KEY (codigo_rol)
    REFERENCES ROLES (codigo_rol)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_rol_permiso_permiso
    FOREIGN KEY (codigo_permiso)
    REFERENCES PERMISOS (codigo_permiso)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table USUARIOS_ROLES (N:M)
-- -----------------------------------------------------
CREATE TABLE USUARIOS_ROLES (
  codigo_user VARCHAR(10) NOT NULL,
  codigo_rol INT NOT NULL,
  fecha_asignacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (codigo_user, codigo_rol),
  INDEX ind_user_rol_user (codigo_user ASC),
  INDEX ind_user_rol_rol (codigo_rol ASC),
  CONSTRAINT fk_user_rol_user
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_rol_rol
    FOREIGN KEY (codigo_rol)
    REFERENCES ROLES (codigo_rol)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table AUDITORIA
-- -----------------------------------------------------
CREATE TABLE AUDITORIA (
  codigo_auditoria BIGINT NOT NULL AUTO_INCREMENT,
  codigo_user VARCHAR(10) NULL,
  tabla_afectada VARCHAR(50) NOT NULL,
  accion_auditoria VARCHAR(30) NOT NULL,
  descripcion_auditoria VARCHAR(300) NULL,
  fecha_auditoria DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_auditoria VARCHAR(45) NULL,
  PRIMARY KEY (codigo_auditoria),
  INDEX ind_auditoria_user (codigo_user ASC),
  INDEX ind_auditoria_fecha (fecha_auditoria ASC),
  CONSTRAINT fk_auditoria_user
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- =====================================================
-- 2) PERSONAS / ROLES DE NEGOCIO
-- =====================================================

-- -----------------------------------------------------
-- Table CREDENCIALES
-- -----------------------------------------------------
CREATE TABLE CREDENCIALES (
  codigo_cred VARCHAR(10) NOT NULL,
  codigo_user VARCHAR(10) NOT NULL,
  foto_cred BLOB NOT NULL,
  identificacion_cred VARCHAR(30) NOT NULL,
  fecha_ingreso_cred DATE NOT NULL,
  pass_cred VARCHAR(150) NOT NULL,
  estado_cred TINYINT NOT NULL,
  PRIMARY KEY (codigo_cred),
  UNIQUE INDEX uq_identificacion_cred (identificacion_cred ASC),
  UNIQUE INDEX uq_cred_user (codigo_user ASC),
  CONSTRAINT fk_credencial_usuario
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table CLIENTES
-- -----------------------------------------------------
CREATE TABLE CLIENTES (
  codigo_customer VARCHAR(10) NOT NULL,
  codigo_user VARCHAR(10) NOT NULL,
  fecha_nac_customer DATE NOT NULL,
  PRIMARY KEY (codigo_customer),
  UNIQUE INDEX uq_cliente_user (codigo_user ASC),
  CONSTRAINT fk_cliente_usuario
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table VENDEDORES
-- -----------------------------------------------------
CREATE TABLE VENDEDORES (
  codigo_seller VARCHAR(10) NOT NULL,
  codigo_user VARCHAR(10) NOT NULL,
  salario_seller DECIMAL(8,2) NOT NULL,
  fecha_contratacion_seller DATE NULL,
  porcentaje_comision_seller DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (codigo_seller),
  UNIQUE INDEX uq_vendedor_user (codigo_user ASC),
  CONSTRAINT fk_vendedor_usuario
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table MENSAJES
-- -----------------------------------------------------
CREATE TABLE MENSAJES (
  codigo_mensaje INT NOT NULL AUTO_INCREMENT,
  codigo_user VARCHAR(10) NOT NULL,
  fecha_mensaje DATE NOT NULL,
  asunto_mensaje VARCHAR(50) NOT NULL,
  descripcion_mensaje VARCHAR(300) NOT NULL,
  PRIMARY KEY (codigo_mensaje),
  INDEX ind_mensaje_usuario (codigo_user ASC),
  CONSTRAINT fk_mensaje_usuario
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- =====================================================
-- 3) CATÁLOGO / INVENTARIO
-- =====================================================

-- -----------------------------------------------------
-- Table CATEGORIAS
-- -----------------------------------------------------
CREATE TABLE CATEGORIAS (
  codigo_categoria INT NOT NULL AUTO_INCREMENT,
  nombre_categoria VARCHAR(50) NOT NULL,
  PRIMARY KEY (codigo_categoria))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table PRODUCTOS
-- -----------------------------------------------------
CREATE TABLE PRODUCTOS (
  codigo_categoria INT NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  nombre_producto VARCHAR(50) NOT NULL,
  precio_producto DECIMAL(10,2) NOT NULL,
  unidad_producto DECIMAL(5,2) NOT NULL,
  medida_producto VARCHAR(20) NOT NULL,
  stock_productos INT NOT NULL,
  PRIMARY KEY (codigo_producto),
  INDEX ind_producto_categoria (codigo_categoria ASC),
  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (codigo_categoria)
    REFERENCES CATEGORIAS (codigo_categoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- =====================================================
-- 4) VENTAS
-- =====================================================

-- -----------------------------------------------------
-- Table DIRECCIONES
-- -----------------------------------------------------
CREATE TABLE DIRECCIONES (
  codigo_direccion INT NOT NULL AUTO_INCREMENT,
  codigo_customer VARCHAR(10) NOT NULL,
  ciudad_direccion VARCHAR(50) NOT NULL,
  direccion_direccion VARCHAR(100) NOT NULL,
  tipo_direccion VARCHAR(30) NOT NULL,
  es_principal TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (codigo_direccion),
  INDEX ind_direccion_cliente (codigo_customer ASC),
  CONSTRAINT fk_direccion_cliente
    FOREIGN KEY (codigo_customer)
    REFERENCES CLIENTES (codigo_customer)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table ESTADOS_PEDIDO
-- -----------------------------------------------------
CREATE TABLE ESTADOS_PEDIDO (
  codigo_estado INT NOT NULL AUTO_INCREMENT,
  nombre_estado VARCHAR(30) NOT NULL,
  PRIMARY KEY (codigo_estado),
  UNIQUE INDEX uq_nombre_estado (nombre_estado ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table PEDIDOS
-- -----------------------------------------------------
CREATE TABLE PEDIDOS (
  codigo_pedido VARCHAR(10) NOT NULL,
  codigo_customer VARCHAR(10) NOT NULL,
  codigo_direccion INT NULL,
  codigo_seller VARCHAR(10) NULL,
  codigo_estado INT NOT NULL,
  fecha_pedido DATE NOT NULL,
  canal_venta ENUM('LOCAL','ONLINE') NOT NULL,
  PRIMARY KEY (codigo_pedido),
  INDEX ind_pedido_cliente (codigo_customer ASC),
  INDEX ind_pedido_direccion (codigo_direccion ASC),
  INDEX ind_pedido_seller (codigo_seller ASC),
  INDEX ind_pedido_estado (codigo_estado ASC),
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (codigo_customer)
    REFERENCES CLIENTES (codigo_customer)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_direccion
    FOREIGN KEY (codigo_direccion)
    REFERENCES DIRECCIONES (codigo_direccion)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_seller
    FOREIGN KEY (codigo_seller)
    REFERENCES VENDEDORES (codigo_seller)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_estado
    FOREIGN KEY (codigo_estado)
    REFERENCES ESTADOS_PEDIDO (codigo_estado)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table LISTA_PRODUCTOS_PEDIDOS
-- -----------------------------------------------------
CREATE TABLE LISTA_PRODUCTOS_PEDIDOS (
  codigo_pedido VARCHAR(10) NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  cantidad_productos INT NOT NULL,
  precio_unitario_pedido DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (codigo_pedido, codigo_producto),
  INDEX ind_lista_productos_pedido (codigo_pedido ASC),
  INDEX ind_lista_producto_producto (codigo_producto ASC),
  CONSTRAINT fk_lista_productos_pedido
    FOREIGN KEY (codigo_pedido)
    REFERENCES PEDIDOS (codigo_pedido)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_lista_productos_producto
    FOREIGN KEY (codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- =====================================================
-- 5) COMPRAS
-- =====================================================

-- -----------------------------------------------------
-- Table PROVEEDORES (versión mínima; se amplía en punto 5)
-- -----------------------------------------------------
CREATE TABLE PROVEEDORES (
  codigo_proveedor VARCHAR(10) NOT NULL,
  nombre_proveedor VARCHAR(100) NOT NULL,
  telefono_proveedor VARCHAR(30) NULL,
  correo_proveedor VARCHAR(100) NULL,
  PRIMARY KEY (codigo_proveedor))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table COMPRAS
-- -----------------------------------------------------
CREATE TABLE COMPRAS (
  codigo_compra VARCHAR(10) NOT NULL,
  codigo_proveedor VARCHAR(10) NOT NULL,
  fecha_compra DATE NOT NULL,
  documento_compra BLOB NOT NULL,
  PRIMARY KEY (codigo_compra),
  INDEX ind_compra_proveedor (codigo_proveedor ASC),
  CONSTRAINT fk_compra_proveedor
    FOREIGN KEY (codigo_proveedor)
    REFERENCES PROVEEDORES (codigo_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table LISTA_PRODUCTOS_COMPRADOS
-- -----------------------------------------------------
CREATE TABLE LISTA_PRODUCTOS_COMPRADOS (
  codigo_compra VARCHAR(10) NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  precio_unitario_compra DECIMAL(10,2) NOT NULL,
  cantidad_productos_compra INT NOT NULL,
  PRIMARY KEY (codigo_compra, codigo_producto),
  INDEX ind_lista_prod_comp_productos (codigo_producto ASC),
  INDEX ind_lista_prod_comp_compra (codigo_compra ASC),
  CONSTRAINT fk_lista_prod_comp_productos
    FOREIGN KEY (codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_lista_prod_comp_compra
    FOREIGN KEY (codigo_compra)
    REFERENCES COMPRAS (codigo_compra)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- FIN DEL SCRIPT (estado actual)
-- =====================================================