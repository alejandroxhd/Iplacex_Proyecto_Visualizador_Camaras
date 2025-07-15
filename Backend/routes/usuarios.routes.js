const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const usuariosController = require('../controllers/usuarios.controller');

router.use(verificarToken);

// ✅ Crear usuario (solo admin)
router.post('/', permitirSolo([1]), usuariosController.crearUsuario);

// Obtener usuarios
router.get('/', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.obtenerUsuario);

// Actualizar y eliminar (solo admin)
router.put('/:id', permitirSolo([1]), usuariosController.actualizarUsuario);
router.delete('/:id', permitirSolo([1]), usuariosController.eliminarUsuario);

module.exports = router;
