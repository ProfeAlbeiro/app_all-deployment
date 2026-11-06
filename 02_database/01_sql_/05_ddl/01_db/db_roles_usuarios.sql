DROP DATABASE IF EXISTS db_roles_usuarios;

CREATE SCHEMA db_roles_usuarios DEFAULT CHARACTER SET utf8;
USE db_roles_usuarios;

-- Tabla de roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de usuarios (con columnas de credenciales)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- Datos personales
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  image VARCHAR(255),
  
  -- 🔐 COLUMNAS DE CREDENCIALES
  username VARCHAR(50) NOT NULL UNIQUE,  -- Nombre de usuario para login
  password VARCHAR(255) NOT NULL,         -- Hash de la contraseña
  status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',  -- Estado de la cuenta
  
  -- Metadatos de la cuenta
  last_login DATETIME,                    -- Último inicio de sesión
  login_attempts INT DEFAULT 0,           -- Intentos fallidos de login
  locked_until DATETIME,                  -- Cuándo se desbloquea la cuenta (si está bloqueada)
  password_changed_at TIMESTAMP NULL,     -- Último cambio de contraseña
  
  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla pivote (relación muchos a muchos)
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_by INT,                         -- Quién asignó el rol (referencia a users.id)
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insertar roles base
INSERT INTO roles (name, description) VALUES 
  ('admin', 'Administrador del sistema con todos los permisos'),
  ('user', 'Usuario regular con permisos básicos'),
  ('moderator', 'Moderador con permisos especiales');

-- Insertar usuario administrador
INSERT INTO users (
  name, lastname, email, phone, image,
  username, password, status, last_login, login_attempts
) VALUES (
  'Albeiro',
  'Ramos',
  'profealbeiro2020@gmail.com',
  '3103103101',
  'profile',
  'albeiro.ramos',  -- username para login
  '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',  -- password hash
  'active',         -- estado activo
  NULL,             -- sin último login aún
  0                 -- sin intentos fallidos
);

-- Asignar rol admin al usuario (id=1)
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES 
  (1, (SELECT id FROM roles WHERE name = 'admin'), 1);