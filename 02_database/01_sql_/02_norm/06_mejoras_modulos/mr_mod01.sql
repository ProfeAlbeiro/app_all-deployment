DROP DATABASE IF EXISTS BBDD_INVENTARIO;
-- -----------------------------------------------------
-- BBDD_INVENTARIO - VERSIÓN FINAL (1FN + 2FN + 3FN + MEJORAS)
-- -----------------------------------------------------
CREATE SCHEMA BBDD_INVENTARIO DEFAULT CHARACTER SET utf8;
USE BBDD_INVENTARIO;

-- =====================================================
-- CATÁLOGOS BASE
-- =====================================================

CREATE TABLE ROLES (
  codigo_rol INT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL,
  PRIMARY KEY (codigo_rol),
  UNIQUE INDEX uq_nombre_rol (nombre_rol)   -- [4]
) ENGINE = InnoDB;

CREATE TABLE CATEGORIAS (
  codigo_categoria INT NOT NULL AUTO_INCREMENT,
  nombre_categoria VARCHAR(50) NOT NULL,
  PRIMARY KEY (codigo_categoria),
  UNIQUE INDEX uq_nombre_categoria (nombre_categoria)   -- [4]
) ENGINE = InnoDB;

CREATE TABLE CANALES_VENTA (   -- [4] NUEVA
  codigo_canal INT NOT NULL AUTO_INCREMENT,
  nombre_canal VARCHAR(30) NOT NULL,
  PRIMARY KEY (codigo_canal),
  UNIQUE INDEX uq_nombre_canal (nombre_canal)
) ENGINE = InnoDB;

CREATE TABLE ESTADOS_PEDIDO (  -- [4] NUEVA
  codigo_estado INT NOT NULL AUTO_INCREMENT,
  nombre_estado VARCHAR(30) NOT NULL,
  PRIMARY KEY (codigo_estado),
  UNIQUE INDEX uq_nombre_estado (nombre_estado)
) ENGINE = InnoDB;

CREATE TABLE METODOS_PAGO (    -- [4] NUEVA
  codigo_metodo INT NOT NULL AUTO_INCREMENT,
  nombre_metodo VARCHAR(50) NOT NULL,
  PRIMARY KEY (codigo_metodo),
  UNIQUE INDEX uq_nombre_metodo (nombre_metodo)
) ENGINE = InnoDB;

CREATE TABLE PARAMETROS (      -- [4] NUEVA
  codigo_parametro VARCHAR(30) NOT NULL,
  valor_parametro DECIMAL(10,4) NOT NULL,
  descripcion_parametro VARCHAR(100) NOT NULL,
  PRIMARY KEY (codigo_parametro)
) ENGINE = InnoDB;

-- =====================================================
-- USUARIOS Y CREDENCIALES (jerarquía corregida)
-- =====================================================

CREATE TABLE USUARIOS (
  codigo_user VARCHAR(10) NOT NULL,
  nombres_user VARCHAR(50) NOT NULL,
  apellidos_user VARCHAR(50) NOT NULL,
  correo_user VARCHAR(100) NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- [4]
  fecha_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- [4]
  PRIMARY KEY (codigo_user),
  UNIQUE INDEX uq_correo_user (correo_user ASC)
) ENGINE = InnoDB;

CREATE TABLE CREDENCIALES (
  codigo_user VARCHAR(10) NOT NULL,
  foto_cred VARCHAR(255) NOT NULL,           -- [4] BLOB → ruta de archivo
  identificacion_cred VARCHAR(30) NOT NULL,
  fecha_ingreso_cred DATE NOT NULL,
  pass_cred VARCHAR(300) NOT NULL,
  estado_cred TINYINT NOT NULL DEFAULT 1,    -- 0=inactivo, 1=activo
  PRIMARY KEY (codigo_user),
  UNIQUE INDEX uq_identificacion_cred (identificacion_cred ASC),
  CONSTRAINT fk_credencial_usuario
    FOREIGN KEY (codigo_user)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- N:M USUARIOS ↔ ROLES  (permite que un usuario sea cliente Y vendedor)
CREATE TABLE ROLES_USUARIO (   -- [4] NUEVA
  codigo_user VARCHAR(10) NOT NULL,
  codigo_rol INT NOT NULL,
  PRIMARY KEY (codigo_user, codigo_rol),
  CONSTRAINT fk_ru_usuario
    FOREIGN KEY (codigo_user) REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ru_rol
    FOREIGN KEY (codigo_rol) REFERENCES ROLES (codigo_rol)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- ESPECIALIZACIONES
-- =====================================================

CREATE TABLE CLIENTES (
  codigo_customer VARCHAR(10) NOT NULL,
  fecha_nac_customer DATE NOT NULL,
  PRIMARY KEY (codigo_customer),
  CONSTRAINT fk_cliente_usuario
    FOREIGN KEY (codigo_customer)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE VENDEDORES (
  codigo_seller VARCHAR(10) NOT NULL,
  salario_seller DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (codigo_seller),
  CONSTRAINT fk_vendedor_usuario
    FOREIGN KEY (codigo_seller)
    REFERENCES USUARIOS (codigo_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- MENSAJES
-- =====================================================

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
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- PRODUCTOS
-- =====================================================

CREATE TABLE PRODUCTOS (
  codigo_categoria INT NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  nombre_producto VARCHAR(50) NOT NULL,
  precio_producto DECIMAL(10,2) NOT NULL,
  unidad_producto DECIMAL(10,2) NOT NULL,
  medida_producto VARCHAR(20) NOT NULL,
  PRIMARY KEY (codigo_producto),
  INDEX ind_producto_categoria (codigo_categoria ASC),
  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (codigo_categoria)
    REFERENCES CATEGORIAS (codigo_categoria)
    ON DELETE RESTRICT      -- [4] antes CASCADE (protege productos)
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- DIRECCIONES DEL CLIENTE
-- =====================================================

CREATE TABLE DIRECCIONES_CLIENTE (   -- [4] NUEVA
  codigo_direccion INT NOT NULL AUTO_INCREMENT,
  codigo_customer VARCHAR(10) NOT NULL,
  alias_direccion VARCHAR(30) NOT NULL,
  ciudad_direccion VARCHAR(50) NOT NULL,
  direccion_direccion VARCHAR(150) NOT NULL,
  es_principal TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (codigo_direccion),
  INDEX ind_direccion_cliente (codigo_customer ASC),
  CONSTRAINT fk_direccion_cliente
    FOREIGN KEY (codigo_customer) REFERENCES CLIENTES (codigo_customer)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- PEDIDOS
-- =====================================================

CREATE TABLE PEDIDOS (
  codigo_customer VARCHAR(10) NOT NULL,
  codigo_pedido VARCHAR(10) NOT NULL,
  codigo_canal INT NOT NULL,               -- [4] NUEVO
  codigo_estado INT NOT NULL,              -- [4] NUEVO
  codigo_direccion INT,                    -- [4] NUEVO (puede ser NULL)
  fecha_pedido DATE NOT NULL,
  PRIMARY KEY (codigo_pedido),
  INDEX ind_pedido_cliente (codigo_customer ASC),
  INDEX ind_pedido_fecha (fecha_pedido ASC),   -- [4]
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (codigo_customer) REFERENCES CLIENTES (codigo_customer)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_canal
    FOREIGN KEY (codigo_canal) REFERENCES CANALES_VENTA (codigo_canal)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_estado
    FOREIGN KEY (codigo_estado) REFERENCES ESTADOS_PEDIDO (codigo_estado)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_direccion
    FOREIGN KEY (codigo_direccion) REFERENCES DIRECCIONES_CLIENTE (codigo_direccion)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- DETALLE PEDIDOS Y VENDEDORES
-- =====================================================

CREATE TABLE LISTA_PRODUCTOS_PEDIDOS (
  codigo_pedido VARCHAR(10) NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  cantidad_productos INT NOT NULL,
  PRIMARY KEY (codigo_pedido, codigo_producto),
  INDEX ind_lista_producto_producto (codigo_producto ASC),
  CONSTRAINT fk_lista_productos_pedido
    FOREIGN KEY (codigo_pedido) REFERENCES PEDIDOS (codigo_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lista_productos_producto
    FOREIGN KEY (codigo_producto) REFERENCES PRODUCTOS (codigo_producto)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- [4] VENDEDORES_PEDIDOS corregida: PK compuesta + comisión
CREATE TABLE VENDEDORES_PEDIDOS (
  codigo_seller VARCHAR(10) NOT NULL,
  codigo_pedido VARCHAR(10) NOT NULL,
  comision_seller_pedido DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (codigo_seller, codigo_pedido),
  INDEX ind_vp_pedido (codigo_pedido ASC),
  CONSTRAINT fk_vp_seller
    FOREIGN KEY (codigo_seller) REFERENCES VENDEDORES (codigo_seller)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_vp_pedido
    FOREIGN KEY (codigo_pedido) REFERENCES PEDIDOS (codigo_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- COMPRAS
-- =====================================================

CREATE TABLE COMPRAS (
  codigo_compra VARCHAR(10) NOT NULL,
  fecha_compra DATE NOT NULL,
  documento_compra VARCHAR(255) NOT NULL,   -- [4] BLOB → ruta
  PRIMARY KEY (codigo_compra)
) ENGINE = InnoDB;

CREATE TABLE LISTA_PRODUCTOS_COMPRADOS (
  codigo_compra VARCHAR(10) NOT NULL,
  codigo_producto VARCHAR(10) NOT NULL,
  precio_producto_compra DECIMAL(10,2) NOT NULL,
  cantidad_productos_compra INT NOT NULL,
  PRIMARY KEY (codigo_compra, codigo_producto),
  INDEX ind_lista_prod_comp_productos (codigo_producto ASC),
  CONSTRAINT fk_lista_prod_comp_productos
    FOREIGN KEY (codigo_producto) REFERENCES PRODUCTOS (codigo_producto)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lista_prod_comp_compra
    FOREIGN KEY (codigo_compra) REFERENCES COMPRAS (codigo_compra)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- PAGOS
-- =====================================================

CREATE TABLE PAGOS (   -- [4] NUEVA
  codigo_pago VARCHAR(10) NOT NULL,
  codigo_pedido VARCHAR(10) NOT NULL,
  codigo_metodo INT NOT NULL,
  fecha_pago DATETIME NOT NULL,
  monto_pago DECIMAL(10,2) NOT NULL,
  estado_pago VARCHAR(20) NOT NULL,        -- 'pendiente','aprobado','rechazado'
  referencia_pago VARCHAR(50),
  PRIMARY KEY (codigo_pago),
  INDEX ind_pago_pedido (codigo_pedido ASC),
  INDEX ind_pago_fecha (fecha_pago ASC),
  CONSTRAINT fk_pago_pedido
    FOREIGN KEY (codigo_pedido) REFERENCES PEDIDOS (codigo_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pago_metodo
    FOREIGN KEY (codigo_metodo) REFERENCES METODOS_PAGO (codigo_metodo)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- DOMICILIOS
-- =====================================================

CREATE TABLE DOMICIL