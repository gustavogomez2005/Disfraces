/*
const express = require('express');
const router = express.Router();
const { 
    getDisfraces, 
    getDisfrazById, 
    createDisfraz, 
    updateDisfraz, 
    deleteDisfraz, 
    verificarDisponibilidad 
} = require('../controllers/disfrazController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');
*/

import express from 'express';
const router = express.Router();
import { 
    getDisfraces, 
    getDisfrazById, 
    createDisfraz, 
    updateDisfraz, 
    deleteDisfraz, 
    verificarDisponibilidad 
} from '../controllers/disfrazController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';


// Consultas y operaciones generales para empleados autenticados
router.get('/', verificarToken, getDisfraces);
router.get('/:id/disponibilidad', verificarToken, verificarDisponibilidad); // Consulta específica de stock/alquiler
router.get('/:id', verificarToken, getDisfrazById);
router.post('/', verificarToken, createDisfraz);
router.put('/:id', verificarToken, updateDisfraz);

// REGLA DE NEGOCIO: La baja de un disfraz la puede realizar SOLAMENTE el administrador
router.delete('/:id', verificarToken, verificarAdmin, deleteDisfraz);

//module.exports = router;
export default router;
