const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const camarasController = require('../controllers/camaras.controller');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Listar cámaras según el rol del usuario
router.get('/', camarasController.listarCamaras);

// Listar cámaras particulares (solo admin)
router.get('/particulares', permitirSolo([1]), camarasController.listarCamarasParticulares);

// Obtener una cámara por ID
router.get('/:id', camarasController.obtenerCamara);

// Crear una nueva cámara (admin o intermedio)
router.post('/', camarasController.crearCamara);

// Actualizar una cámara (admin o creador)
router.put('/:id', camarasController.actualizarCamara);

// Eliminar una cámara (admin o creador)
router.delete('/:id', camarasController.eliminarCamara);

router.get('/visibles', camarasController.listarCamarasVisibles);


module.exports = router;
