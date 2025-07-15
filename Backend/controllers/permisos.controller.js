const pool = require('../config/db');

const permisosController = {};

// Obtener las cámaras asignadas a un usuario
permisosController.obtenerPermisos = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [resultado] = await pool.query('CALL sp_listar_camaras_permitidas(?)', [id_usuario]);
    res.json(resultado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener permisos' });
  }
};

// Asignar una cámara a un usuario
permisosController.asignarPermiso = async (req, res) => {
  const { id_usuario, id_camara } = req.body;
  if (!id_usuario || !id_camara) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  try {
    await pool.query('CALL sp_asignar_permiso(?, ?)', [id_usuario, id_camara]);
    res.status(201).json({ mensaje: 'Permiso asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al asignar permiso' });
  }
};

// Quitar una cámara a un usuario
permisosController.quitarPermiso = async (req, res) => {
  const { id_usuario, id_camara } = req.body;
  if (!id_usuario || !id_camara) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  try {
    await pool.query('CALL sp_quitar_permiso(?, ?)', [id_usuario, id_camara]);
    res.json({ mensaje: 'Permiso eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al quitar permiso' });
  }
};

module.exports = permisosController;
