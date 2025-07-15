const pool = require('../config/db');

const logsController = {};

// Obtener todos los logs de accesos
logsController.obtenerTodosLosLogs = async (req, res) => {
  try {
    const [resultado] = await pool.query('CALL sp_obtener_todos_los_logs()');
    res.json(resultado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los logs' });
  }
};

// Obtener logs por ID de usuario
logsController.obtenerLogsPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [resultado] = await pool.query('CALL sp_obtener_logs_por_usuario(?)', [id_usuario]);
    res.json(resultado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener logs por usuario' });
  }
};

// Obtener logs por ID de cámara
logsController.obtenerLogsPorCamara = async (req, res) => {
  const { id_camara } = req.params;
  try {
    const [resultado] = await pool.query('CALL sp_obtener_logs_por_camara(?)', [id_camara]);
    res.json(resultado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener logs por cámara' });
  }
};

module.exports = logsController;
