/*
const express = require('express');
const router = express.Router();
const { 
    getClientes, 
    getClienteById, 
    createCliente, 
    updateCliente, 
    deleteCliente 
} = require('../controllers/clienteController');
const { verificarToken } = require('../middlewares/authMiddleware');
*/


import express from 'express';
const router = express.Router();
import { 
    getClientes, 
    getClienteById, 
    createCliente, 
    updateCliente, 
    deleteCliente 
} from '../controllers/clienteController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';


// Todas las rutas de clientes requieren que el usuario haya iniciado sesión
router.get('/', verificarToken, getClientes);
router.get('/:id', verificarToken, getClienteById);
router.post('/', verificarToken, createCliente);
router.put('/:id', verificarToken, updateCliente);
router.delete('/:id', verificarToken, deleteCliente); // Validará en el controlador si tiene alquileres activos

//module.exports = router;
export default router;

