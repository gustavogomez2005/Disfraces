/*
const express = require('express');
const router = express.Router();
const { 
    createAlquiler,
    getDisfrazMasAlquilado,
    getDisfrazMenosAlquilado,
    getEmpleadoTop,
    getRecaudacionEntreFechas,
    getAlquileresPorCliente
} = require('../controllers/alquilerController');
const { verificarToken } = require('../middlewares/authMiddleware');
*/


import express from 'express';
const router = express.Router();
import { 
    createAlquiler,
    getDisfrazMasAlquilado,
    getDisfrazMenosAlquilado,
    getEmpleadoTop,
    getRecaudacionEntreFechas,
    getAlquileresPorCliente
}  from '../controllers/alquilerController.js';
import { verificarToken }  from '../middlewares/authMiddleware.js';
import {validarCrearAlquiler} from '../middlewares/alquilerValidation.js';

// Ruta para registrar un alquiler mediante transacción (Requiere token)
router.post('/', verificarToken, validarCrearAlquiler,createAlquiler);

// Rutas de consultas analíticas y reportes
router.get('/reportes/disfraz-mas-alquilado', verificarToken, getDisfrazMasAlquilado);
router.get('/reportes/disfraz-menos-alquilado', verificarToken, getDisfrazMenosAlquilado);
router.get('/reportes/empleado-top', verificarToken, getEmpleadoTop);
router.get('/reportes/recaudacion', verificarToken, getRecaudacionEntreFechas);
router.get('/cliente/:codigo_cliente', verificarToken, getAlquileresPorCliente);

//module.exports = router;
//export {router}
export default router;
