const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporte.controller');
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');

// Crear nuevo ticket (usuario autenticado)
router.post('/crear', verificarToken, soporteController.crearTicket);

// Responder a un ticket (usuario o admin)
router.post('/responder', verificarToken, soporteController.responderTicket);

// Cambiar estado del ticket (solo administrador)
router.put('/estado', verificarToken, permitirSolo([1]), soporteController.cambiarEstado);

// Listar todos los tickets (solo administrador)
router.get('/admin', verificarToken, permitirSolo([1]), soporteController.listarTicketsAdmin);

// Listar tickets del usuario autenticado
router.get('/usuario', verificarToken, soporteController.listarTicketsUsuario);

// Ver respuestas de un ticket específico
router.get('/respuestas/:id', verificarToken, soporteController.listarRespuestas);

module.exports = router;
