/*
const pool = require('../config/db');
const bcrypt = require('bcrypt');
*/

import pool from '../config/db.js';
import bcrypt from 'bcrypt';


// Obtener todos los empleados
export const getEmpleados = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT codigo_empleado, nombre, apellido, direccion, telefono, email, rol FROM empleados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un empleado por ID
export const getEmpleadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT codigo_empleado, nombre, apellido, direccion, telefono, email, rol FROM empleados WHERE codigo_empleado = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, direccion, telefono, email, rol, password } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const query = `UPDATE empleados SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, rol = ?, password = ? WHERE codigo_empleado = ?`;
            const [result] = await pool.execute(query, [nombre, apellido, direccion, telefono, email, rol, hashedPassword, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        } else {
            const query = `UPDATE empleados SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, rol = ? WHERE codigo_empleado = ?`;
            const [result] = await pool.execute(query, [nombre, apellido, direccion, telefono, email, rol, id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        res.json({ mensaje: 'Empleado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar empleado
export const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM empleados WHERE codigo_empleado = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        res.json({ mensaje: 'Empleado eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//module.exports = { getEmpleados, getEmpleadoById, updateEmpleado, deleteEmpleado };
