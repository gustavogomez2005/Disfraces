//const express = require('express');
//const cors = require('cors');
//require('dotenv').config();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Registro de las rutas de la API
/*app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/empleados', require('./routes/empleadoRoutes'));
app.use('/api/disfraces', require('./routes/disfrazRoutes'));
app.use('/api/alquileres', require('./routes/alquilerRoutes'));
*/

import authRoutes from './routes/authRoutes.js'
import clienteRoutes from './routes/clienteRoutes.js'
import empleadoRoutes from './routes/empleadoRoutes.js'
import disfrazRoutes from './routes/disfrazRoutes.js'
import alquilerRoutes from './routes/alquilerRoutes.js'

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/disfraces', disfrazRoutes);
app.use('/api/alquileres', alquilerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
