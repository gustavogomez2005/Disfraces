//const pool = require('../config/db');
import pool from '../config/db.js';

// 1. Cuál es el disfraz más alquilado
export const getDisfrazMasAlquilado = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT d.codigo_disfaz, d.nombre_disfraz, SUM(da.cantidad) AS total_alquileres
        FROM detalle_alquiler da
        JOIN disfraces d ON da.codigo_disfaz = d.codigo_disfaz
        GROUP BY d.codigo_disfaz, d.nombre_disfraz
        ORDER BY total_alquileres DESC
        LIMIT 1;
    `);
    res.json(rows[0] || { mensaje: 'No hay registros' });
};

// 2. Cuál es el disfraz menos alquilado
export const getDisfrazMenosAlquilado = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT d.codigo_disfaz, d.nombre_disfraz, COALESCE(SUM(da.cantidad), 0) AS total_alquileres
        FROM disfraces d
        LEFT JOIN detalle_alquiler da ON d.codigo_disfaz = da.codigo_disfaz
        GROUP BY d.codigo_disfaz, d.nombre_disfraz
        ORDER BY total_alquileres ASC
        LIMIT 1;
    `);
    res.json(rows[0] || { mensaje: 'No hay registros' });
};

// 3. Cuál es el empleado que más alquileres ha realizado
export const getEmpleadoTop = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT e.codigo_empleado, e.nombre, e.apellido, COUNT(fa.numero_alquiler) AS cantidad_alquileres
        FROM empleados e
        JOIN fichas_alquiler fa ON e.codigo_empleado = fa.codigo_empleado
        GROUP BY e.codigo_empleado, e.nombre, e.apellido
        ORDER BY cantidad_alquileres DESC
        LIMIT 1;
    `);
    res.json(rows[0] || { mensaje: 'No hay registros' });
};

// 4. Cuánto dinero se recaudó entre fechas de solicitud
export const getRecaudacionEntreFechas = async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const [rows] = await pool.query(`
        SELECT SUM(total) AS recaudacion_total
        FROM fichas_alquiler
        WHERE fecha_solicitud BETWEEN ? AND ?;
    `, [fecha_inicio, fecha_fin]);
    res.json(rows[0]);
};

// 5. Buscar por un cliente y mostrar todos los alquileres realizados
export const getAlquileresPorCliente = async (req, res) => {
    const { codigo_cliente } = req.params;
    const [rows] = await pool.query(`
        SELECT fa.*, e.nombre AS empleado_nombre, e.apellido AS empleado_apellido
        FROM fichas_alquiler fa
        JOIN empleados e ON fa.codigo_empleado = e.codigo_empleado
        WHERE fa.codigo_cliente = ?
    `, [codigo_cliente]);
    res.json(rows);
};


//const pool = require('../config/db');

// Registrar una nueva ficha de alquiler con sus detalles (Transaccional)
export const createAlquiler = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { fecha_solicitud, fecha_salida, fecha_devolucion, codigo_cliente, codigo_empleado, total, items } = req.body;
        
        // items debe ser un array de objetos, ejemplo: [{ codigo_disfaz: 1, cantidad: 2 }, { codigo_disfaz: 3, cantidad: 1 }]
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'La ficha de alquiler debe incluir al menos un disfraz.' });
        }

        // 1. Iniciar la transacción
        await connection.beginTransaction();

        // 2. Insertar la cabecera de la ficha de alquiler
        const queryFicha = `
            INSERT INTO fichas_alquiler (fecha_solicitud, fecha_salida, fecha_devolucion, codigo_cliente, codigo_empleado, total) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [resultFicha] = await connection.execute(queryFicha, [
            fecha_solicitud, fecha_salida, fecha_devolucion, codigo_cliente, codigo_empleado, total
        ]);

        const numeroAlquiler = resultFicha.insertId;

        // 3. Insertar los detalles del alquiler (cada disfraz asociado)
        const queryDetalle = `
            INSERT INTO detalle_alquiler (numero_alquiler, codigo_disfaz, cantidad) 
            VALUES (?, ?, ?)
        `;

        for (const item of items) {
            await connection.execute(queryDetalle, [
                numeroAlquiler, item.codigo_disfaz, item.cantidad
            ]);
        }

        // 4. Confirmar la transacción si todo fue exitoso
        await connection.commit();
        connection.release();

        res.status(201).json({ 
            mensaje: 'Ficha de alquiler registrada con éxito', 
            numero_alquiler: numeroAlquiler 
        });

    } catch (error) {
        // Si ocurre un error, revertir todos los cambios realizados en la transacción
        await connection.rollback();
        connection.release();
        
        res.status(500).json({ error: 'Error al registrar el alquiler: ' + error.message });
    }
};

/*
module.exports = {
    createAlquiler
};
*/

/*module.exports = {
    getDisfrazMasAlquilado,
    getDisfrazMenosAlquilado,
    getEmpleadoTop,
    getRecaudacionEntreFechas,
    getAlquileresPorCliente
};
*/