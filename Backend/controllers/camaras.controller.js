const pool = require('../config/db');

const camarasController = {};

// Listar cámaras según el rol del usuario
camarasController.listarCamaras = async (req, res) => {
  try {
    let resultado;

    if (req.usuario.rol === 1) {
      [resultado] = await pool.query('CALL sp_listar_camaras_admin()');
    } else if (req.usuario.rol === 2) {
      [resultado] = await pool.query('CALL sp_listar_camaras_por_usuario(?)', [req.usuario.id]);
    } else if (req.usuario.rol === 3) {
      [resultado] = await pool.query('CALL sp_listar_camaras_permitidas(?)', [req.usuario.id]);
    } else {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    res.json(resultado[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar cámaras' });
  }
};

// Listar cámaras particulares (solo administrador)
camarasController.listarCamarasParticulares = async (req, res) => {
  try {
    const [resultado] = await pool.query('CALL sp_listar_camaras_particulares()');
    res.json(resultado[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar cámaras particulares' });
  }
};

// Crear una nueva cámara
camarasController.crearCamara = async (req, res) => {
  const {
    nombre,
    ip,
    usuario_rtsp,
    contrasena_rtsp,
    region,
    comuna,
    direccion,
    id_empresa,
    es_particular
  } = req.body;

  if (![1, 2].includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No autorizado' });
  }

  try {
    await pool.query('CALL sp_crear_camara(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      nombre,
      ip,
      usuario_rtsp,
      contrasena_rtsp,
      req.usuario.id,
      region,
      comuna,
      direccion,
      id_empresa || null,
      es_particular
    ]);
    res.status(201).json({ mensaje: 'Cámara creada con ubicación y empresa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear cámara' });
  }
};

// Obtener cámara por ID y registrar log si corresponde
camarasController.obtenerCamara = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('CALL sp_obtener_camara(?)', [id]);
    const camara = resultado[0][0];

    if (!camara) {
      return res.status(404).json({ mensaje: 'Cámara no encontrada' });
    }

    // Admin o creador tienen acceso
    if (req.usuario.rol === 1 || camara.id_creador === req.usuario.id) {
      await pool.query('CALL sp_registrar_log(?, ?)', [req.usuario.id, id]);
      return res.json(camara);
    }

    // Usuario normal solo si tiene permiso
    if (req.usuario.rol === 3) {
      const [permiso] = await pool.query(
        'SELECT 1 FROM permisos WHERE id_usuario = ? AND id_camara = ?',
        [req.usuario.id, id]
      );

      if (permiso.length > 0) {
        await pool.query('CALL sp_registrar_log(?, ?)', [req.usuario.id, id]);
        return res.json(camara);
      }
    }

    return res.status(403).json({ mensaje: 'No autorizado para ver esta cámara' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener cámara' });
  }
};

// Actualizar una cámara
camarasController.actualizarCamara = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    ip,
    usuario_rtsp,
    contrasena_rtsp
    // Se pueden incluir campos de ubicación/empresa si se actualizan
  } = req.body;

  try {
    const [resultado] = await pool.query('CALL sp_obtener_camara(?)', [id]);
    const camara = resultado[0][0];

    if (!camara) {
      return res.status(404).json({ mensaje: 'Cámara no encontrada' });
    }

    if (req.usuario.rol === 1 || camara.id_creador === req.usuario.id) {
      await pool.query('CALL sp_actualizar_camara(?, ?, ?, ?, ?)', [
        id,
        nombre,
        ip,
        usuario_rtsp,
        contrasena_rtsp
      ]);
      res.json({ mensaje: 'Cámara actualizada' });
    } else {
      res.status(403).json({ mensaje: 'No autorizado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar cámara' });
  }
};

// Eliminar una cámara
camarasController.eliminarCamara = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('CALL sp_obtener_camara(?)', [id]);
    const camara = resultado[0][0];

    if (!camara) {
      return res.status(404).json({ mensaje: 'Cámara no encontrada' });
    }

    if (req.usuario.rol === 1 || camara.id_creador === req.usuario.id) {
      await pool.query('CALL sp_eliminar_camara(?)', [id]);
      res.json({ mensaje: 'Cámara eliminada' });
    } else {
      res.status(403).json({ mensaje: 'No autorizado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar cámara' });
  }
};

// Listar todas las cámaras visibles por el usuario (creadas o asignadas)
camarasController.listarCamarasVisibles = async (req, res) => {
  try {
    let resultado;

    if (req.usuario.rol === 1) {
      [resultado] = await pool.query('CALL sp_listar_camaras_admin()');
      return res.json(resultado[0]);
    }

    if (req.usuario.rol === 2) {
      // Unir las cámaras creadas y las asignadas
      const [creadas] = await pool.query('CALL sp_listar_camaras_por_usuario(?)', [req.usuario.id]);
      const [asignadas] = await pool.query('CALL sp_listar_camaras_permitidas(?)', [req.usuario.id]);

      // Unir sin duplicar (por id_camara)
      const mapa = new Map();
      [...creadas[0], ...asignadas[0]].forEach(cam => mapa.set(cam.id_camara, cam));

      return res.json(Array.from(mapa.values()));
    }

    if (req.usuario.rol === 3) {
      const [asignadas] = await pool.query('CALL sp_listar_camaras_permitidas(?)', [req.usuario.id]);
      return res.json(asignadas[0]);
    }

    res.status(403).json({ mensaje: 'Acceso denegado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar cámaras visibles' });
  }
};


module.exports = camarasController;
