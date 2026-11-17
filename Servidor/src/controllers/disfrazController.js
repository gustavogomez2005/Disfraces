//const pool = require('../config/db');
import pool from '../config/db.js';

// Obtener todos los disfraces con su categoría
export const getDisfraces = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.*, c.descripcion AS categoria_descripcion 
            FROM disfraces d
            JOIN categorias c ON d.codigo_categoria = c.codigo_categoria
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un disfraz por ID
export const getDisfrazById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(`
            SELECT d.*, c.descripcion AS categoria_descripcion 
            FROM disfraces d
            JOIN categorias c ON d.codigo_categoria = c.codigo_categoria
            WHERE d.codigo_disfaz = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Disfraz no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear disfraz
export const createDisfraz = async (req, res) => {
    try {
        const { nombre_disfraz, cantidad_piezas, codigo_categoria } = req.body;
        const query = `INSERT INTO disfraces (nombre_disfraz, cantidad_piezas, codigo_categoria) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(query, [nombre_disfraz, cantidad_piezas, codigo_categoria]);
        res.status(201).json({ mensaje: 'Disfraz creado exitosamente', codigo_disfaz: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar disfraz
export const updateDisfraz = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_disfraz, cantidad_piezas, codigo_categoria } = req.body;
        const query = `UPDATE disfraces SET nombre_disfraz = ?, cantidad_piezas = ?, codigo_categoria = ? WHERE codigo_disfaz = ?`;
        const [result] = await pool.execute(query, [nombre_disfraz, cantidad_piezas, codigo_categoria, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Disfraz no encontrado' });
        res.json({ mensaje: 'Disfraz actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar disfraz (Regla: No eliminar si está alquilado y exclusivo para admin)
export const deleteDisfraz = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el disfraz está actualmente alquilado (fecha de devolución posterior o igual a hoy)
        const [enAlquiler] = await pool.execute(`
            SELECT * FROM detalle_alquiler da 
            JOIN fichas_alquiler fa ON da.numero_alquiler = fa.numero_alquiler 
            WHERE da.codigo_disfaz = ? AND fa.fecha_devolucion >= CURDATE()
        `, [id]);

        if (enAlquiler.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar un disfraz que esté alquilado.' });
        }

        const [result] = await pool.execute('DELETE FROM disfraces WHERE codigo_disfaz = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Disfraz no encontrado' });

        res.json({ mensaje: 'Disfraz eliminado correctamente por el administrador' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar un disfraz y ver si está disponible
export const verificarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(`
            SELECT d.*, 
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM detalle_alquiler da 
                    JOIN fichas_alquiler fa ON da.numero_alquiler = fa.numero_alquiler 
                    WHERE da.codigo_disfaz = d.codigo_disfaz AND fa.fecha_devolucion >= CURDATE()
                ) THEN 'No disponible'
                ELSE 'Disponible'
            END AS estado_disponibilidad
            FROM disfraces d WHERE d.codigo_disfaz = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Disfraz no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*
module.exports = { 
    getDisfraces, 
    getDisfrazById, 
    createDisfraz, 
    updateDisfraz, 
    deleteDisfraz, 
    verificarDisponibilidad 
};
*/