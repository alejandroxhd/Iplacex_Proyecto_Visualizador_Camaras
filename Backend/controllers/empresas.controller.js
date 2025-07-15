const pool = require('../config/db');

const empresasController = {};

// Listar todas las empresas
empresasController.listarEmpresas = async (req, res) => {
  try {
    const [resultado] = await pool.query('CALL sp_listar_empresas()');
    res.json(resultado[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar empresas' });
  }
};

// Obtener una empresa por ID
empresasController.obtenerEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query('CALL sp_obtener_empresa(?)', [id]);
    if (resultado[0].length === 0) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    res.json(resultado[0][0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener empresa' });
  }
};

// Crear una nueva empresa
empresasController.crearEmpresa = async (req, res) => {
  const { nombre, rut, direccion } = req.body;
  try {
    await pool.query('CALL sp_crear_empresa(?, ?, ?)', [nombre, rut, direccion]);
    res.status(201).json({ mensaje: 'Empresa creada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear empresa' });
  }
};

// Actualizar una empresa existente
empresasController.actualizarEmpresa = async (req, res) => {
  const { id } = req.params;
  const { nombre, rut, direccion } = req.body;
  try {
    await pool.query('CALL sp_actualizar_empresa(?, ?, ?, ?)', [id, nombre, rut, direccion]);
    res.json({ mensaje: 'Empresa actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar empresa' });
  }
};

// Eliminar una empresa
empresasController.eliminarEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('CALL sp_eliminar_empresa(?)', [id]);
    res.json({ mensaje: 'Empresa eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar empresa' });
  }
};

// Listar todas las cámaras asociadas a una empresa
empresasController.listarCamarasPorEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query('CALL sp_listar_camaras_por_empresa(?)', [id]);
    res.json(resultado[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar cámaras de la empresa' });
  }
};

module.exports = empresasController;
