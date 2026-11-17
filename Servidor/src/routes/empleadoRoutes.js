/*
const express = require('express');
const router = express.Router();
const { 
    getEmpleados, 
    getEmpleadoById, 
    updateEmpleado, 
    deleteEmpleado 
} = require('../controllers/empleadoController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');
*/

import express from 'express';
const router = express.Router();
import { 
    getEmpleados, 
    getEmpleadoById, 
    updateEmpleado, 
    deleteEmpleado 
} from '../controllers/empleadoController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

// Estas rutas requieren Token y además perfil de Administrador
router.get('/', verificarToken, verificarAdmin, getEmpleados);
router.get('/:id', verificarToken, verificarAdmin, getEmpleadoById);
router.put('/:id', verificarToken, verificarAdmin, updateEmpleado);
router.delete('/:id', verificarToken, verificarAdmin, deleteEmpleado);

//module.exports = router;
export default router;
