/*
A continuación te muestro cómo configurar las reglas de validación para la cabecera del alquiler y su lista de ítems (detalles).

1. Creación de las Reglas de Validación (src/middlewares/alquilerValidation.js)
Creamos un archivo dedicado para definir las validaciones que comprobarán:

Que las fechas existan y tengan un formato de fecha válido (YYYY-MM-DD).
Que los códigos de cliente y empleado sean números enteros positivos.
Que el total sea un valor numérico válido y mayor o igual a 0.
Que el arreglo de items exista, no esté vacío y que cada ítem contenga un codigo_disfaz y una cantidad válida.

*/

/*
const { body } = require('express-validator');
const { validarCampos } = require('./validateMiddleware');
*/

import { body } from 'express-validator';
import { validarCampos } from './validateMiddleware.js';

export const validarCrearAlquiler = [
    body('fecha_solicitud')
        .notEmpty().withMessage('La fecha de solicitud es obligatoria')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('La fecha de solicitud debe tener el formato YYYY-MM-DD'),
    
    body('fecha_salida')
        .notEmpty().withMessage('La fecha de salida es obligatoria')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('La fecha de salida debe tener el formato YYYY-MM-DD'),
    
    body('fecha_devolucion')
        .notEmpty().withMessage('La fecha de devolución es obligatoria')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('La fecha de devolución debe tener el formato YYYY-MM-DD'),
    
    body('codigo_cliente')
        .notEmpty().withMessage('El código del cliente es obligatorio')
        .isInt({ min: 1 }).withMessage('El código del cliente debe ser un entero válido'),
    
    body('codigo_empleado')
        .notEmpty().withMessage('El código del empleado es obligatorio')
        .isInt({ min: 1 }).withMessage('El código del empleado debe ser un entero válido'),
    
    body('total')
        .notEmpty().withMessage('El total del alquiler es obligatorio')
        .isNumeric().withMessage('El total debe ser un valor numérico'),
    
    body('items')
        .isArray({ min: 1 }).withMessage('Debe incluir al menos un disfraz en los ítems de alquiler'),
    
    body('items.*.codigo_disfaz')
        .notEmpty().withMessage('Cada ítem debe tener el código del disfraz')
        .isInt({ min: 1 }).withMessage('El código del disfraz debe ser un número válido'),
    
    body('items.*.cantidad')
        .notEmpty().withMessage('La cantidad de cada disfraz es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad del disfraz debe ser al menos 1'),

    // Middleware final que evalúa si hubo errores
    validarCampos
];

//module.exports = { validarCrearAlquiler };
