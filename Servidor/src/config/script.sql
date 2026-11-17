CREATE DATABASE IF NOT EXISTS tienda_disfraces CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_disfraces;

-- 1. Tabla de Categorías de Disfraces
CREATE TABLE categorias (
    codigo_categoria INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- 2. Tabla de Disfraces
CREATE TABLE disfraces (
    codigo_disfaz INT AUTO_INCREMENT PRIMARY KEY,
    nombre_disfraz VARCHAR(150) NOT NULL,
    cantidad_piezas INT NOT NULL,
    codigo_categoria INT NOT NULL,
    FOREIGN KEY (codigo_categoria) REFERENCES categorias(codigo_categoria)
);

-- 3. Tabla de Clientes
CREATE TABLE clientes (
    codigo_cliente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    localidad VARCHAR(100),
    provincia VARCHAR(100)
);

-- 4. Tabla de Empleados (Con soporte para Auth y Roles)
CREATE TABLE empleados (
    codigo_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(30) UNIQUE,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL, -- Encriptada con bcrypt
    rol ENUM('empleado', 'administrador') DEFAULT 'empleado' NOT NULL
);

-- 5. Tabla de Fichas de Alquiler
CREATE TABLE fichas_alquiler (
    numero_alquiler INT AUTO_INCREMENT PRIMARY KEY,
    fecha_solicitud DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    fecha_devolucion DATE NOT NULL,
    codigo_cliente INT NOT NULL,
    codigo_empleado INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (codigo_cliente) REFERENCES clientes(codigo_cliente),
    FOREIGN KEY (codigo_empleado) REFERENCES empleados(codigo_empleado)
);

-- 6. Tabla de Detalle de Alquiler (Relación Ficha <-> Disfraz)
CREATE TABLE detalle_alquiler (
    numero_alquiler INT NOT NULL,
    codigo_disfaz INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (numero_alquiler, codigo_disfaz),
    FOREIGN KEY (numero_alquiler) REFERENCES fichas_alquiler(numero_alquiler) ON DELETE CASCADE,
    FOREIGN KEY (codigo_disfaz) REFERENCES disfraces(codigo_disfaz)
);
