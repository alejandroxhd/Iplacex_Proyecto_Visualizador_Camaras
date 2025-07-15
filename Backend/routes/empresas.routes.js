const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const empresasController = require('../controllers/empresas.controller');

// Todas las rutas requieren autenticación y rol de administrador
router.use(verificarToken);
router.use(permitirSolo([1]));

// CRUD de empresas
router.get('/', empresasController.listarEmpresas);
router.get('/:id', empresasController.obtenerEmpresa);
router.post('/', empresasController.crearEmpresa);
router.put('/:id', empresasController.actualizarEmpresa);
router.delete('/:id', empresasController.eliminarEmpresa);

// Cámaras asociadas a una empresa
router.get('/:id/camaras', empresasController.listarCamarasPorEmpresa);

module.exports = router;
