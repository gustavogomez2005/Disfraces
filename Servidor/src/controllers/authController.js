/*
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
*/

import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Registro de empleado (con encriptación)
export const registrar = async (req, res) => {
    try {
        const { nombre, apellido, direccion, telefono, email, password, rol } = req.body;
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `INSERT INTO empleados (nombre, apellido, direccion, telefono, email, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            nombre, apellido, direccion, telefono, email, hashedPassword, rol || 'empleado'
        ]);

        res.status(201).json({ mensaje: 'Empleado registrado con éxito', codigo_empleado: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login flexible (por email, teléfono o nombre y apellido)
export const login = async (req, res) => {
    try {
        const { identificador, password } = req.body; 
        // 'identificador' puede ser email, teléfono o nombre completo (ej: "Juan Perez")

        const query = `
            SELECT * FROM empleados 
            WHERE email = ? OR telefono = ? OR CONCAT(nombre, ' ', apellido) = ?
        `;
        const [rows] = await pool.execute(query, [identificador, identificador, identificador]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const empleado = rows[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, empleado.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { codigo_empleado: empleado.codigo_empleado, rol: empleado.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            empleado: {
                codigo: empleado.codigo_empleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                rol: empleado.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//module.exports = { registrar, login };
