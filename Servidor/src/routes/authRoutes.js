/*
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registrar, login } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validateMiddleware');
*/

import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import { registrar, login } from '../controllers/authController.js';
import { validarCampos } from '../middlewares/validateMiddleware.js';



router.post('/registro', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('email', 'Email inválido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], registrar);

router.post('/login', [
    body('identificador', 'Ingrese su usuario, email o teléfono').not().isEmpty(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

//export  {router}
//module.exports = router;
export default router;