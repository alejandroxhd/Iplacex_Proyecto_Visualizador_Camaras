const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { permitirSolo } = require('../middlewares/roles.middleware');
const pool = require('../config/db');
const {
  iniciarStream,
  detenerStream,
  streamActivo,
  obtenerStreamsActivos
} = require('../scripts/convertirRtspHls');

// Iniciar stream por ID de cámara
router.post('/iniciar/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('CALL sp_obtener_camara(?)', [id]);
    const camara = resultado[0][0];

    if (!camara) {
      return res.status(404).json({ mensaje: 'Cámara no encontrada' });
    }

    const nombreStream = `cam_${camara.id_camara}`;
    const urlHLS = `/streams/${nombreStream}/index.m3u8`;

    if (streamActivo(nombreStream)) {
      return res.json({ mensaje: 'Stream ya estaba activo', url: urlHLS });
    }

    const rtspUrl = `rtsp://${camara.usuario_rtsp}:${camara.contrasena_rtsp}@${camara.ip}:554`;
    iniciarStream(rtspUrl, nombreStream);

    await pool.query('CALL sp_registrar_log(?, ?, ?)', [req.usuario.id, id, 'Inicio de cámara']);
    res.json({ mensaje: 'Stream iniciado', url: urlHLS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al iniciar stream' });
  }
});

// Detener stream por ID de cámara
router.post('/detener/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const nombreStream = `cam_${id}`;

  const detenido = detenerStream(nombreStream);

  if (detenido) {
    try {
      await pool.query('CALL sp_registrar_log(?, ?, ?)', [req.usuario.id, id, 'Cámara detenida']);
    } catch (err) {
      console.error('Error registrando log de cámara detenida:', err);
    }
    res.json({ mensaje: 'Stream detenido' });
  } else {
    res.status(404).json({ mensaje: 'Stream no estaba activo' });
  }
});

// Listar streams activos (solo admin)
router.get('/activos', verificarToken, permitirSolo([1]), (req, res) => {
  const activos = obtenerStreamsActivos();
  res.json({ activos });
});

module.exports = router;
