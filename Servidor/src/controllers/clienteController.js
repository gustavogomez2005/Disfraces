//const pool = require('../config/db');
import pool from '../config/db.js';

// Obtener todos los clientes
export const getClientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT * FROM clientes WHERE codigo_cliente = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear cliente
export const createCliente = async (req, res) => {
    try {
        const { dni, nombre, apellido, direccion, telefono, email, localidad, provincia } = req.body;
        const query = `INSERT INTO clientes (dni, nombre, apellido, direccion, telefono, email, localidad, provincia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [dni, nombre, apellido, direccion, telefono, email, localidad, provincia]);
        res.status(201).json({ mensaje: 'Cliente creado exitosamente', codigo_cliente: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { dni, nombre, apellido, direccion, telefono, email, localidad, provincia } = req.body;
        const query = `UPDATE clientes SET dni = ?, nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, localidad = ?, provincia = ? WHERE codigo_cliente = ?`;
        const [result] = await pool.execute(query, [dni, nombre, apellido, direccion, telefono, email, localidad, provincia, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json({ mensaje: 'Cliente actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cliente (Regla: No se puede eliminar si alquiló algún disfraz)
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [alquileres] = await pool.execute('SELECT * FROM fichas_alquiler WHERE codigo_cliente = ?', [id]);
        if (alquileres.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar un cliente que haya alquilado algún disfraz.' });
        }

        const [result] = await pool.execute('DELETE FROM clientes WHERE codigo_cliente = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        
        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//module.exports = { getClientes, getClienteById, createCliente, updateCliente, deleteCliente };
