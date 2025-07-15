const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const logsController = require('../controllers/logs.controller');

// Todas las rutas protegidas y solo accesibles por admins
router.use(verificarToken, permitirSolo([1]));

// Obtener todos los logs
router.get('/', logsController.obtenerTodosLosLogs);

// Obtener logs por usuario
router.get('/usuario/:id_usuario', logsController.obtenerLogsPorUsuario);

// Obtener logs por cámara
router.get('/camara/:id_camara', logsController.obtenerLogsPorCamara);

module.exports = router;
