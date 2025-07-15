const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const permisosController = require('../controllers/permisos.controller');

router.use(verificarToken);

// Solo el administrador puede asignar o quitar permisos
router.get('/:id_usuario', permitirSolo([1]), permisosController.obtenerPermisos);
router.post('/', permitirSolo([1]), permisosController.asignarPermiso);
router.delete('/', permitirSolo([1]), permisosController.quitarPermiso);


module.exports = router;
