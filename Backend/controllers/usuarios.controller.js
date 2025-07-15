const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const usuariosController = {};

// POST /api/usuarios
usuariosController.crearUsuario = async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;

  try {
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);
    await pool.query('CALL sp_crear_usuario(?, ?, ?, ?)', [
      nombre,
      correo,
      contrasenaHasheada,
      rol
    ]);
    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

// GET /api/usuarios
usuariosController.listarUsuarios = async (req, res) => {
  try {
    const [filas] = await pool.query('CALL sp_listar_usuarios()');
    res.json(filas[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

// GET /api/usuarios/:id
usuariosController.obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [filas] = await pool.query('CALL sp_obtener_usuario_por_id(?)', [id]);
    if (filas[0].length === 0)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(filas[0][0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

// PUT /api/usuarios/:id
usuariosController.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, id_rol } = req.body;

  try {
    await pool.query('CALL sp_actualizar_usuario(?, ?, ?, ?)', [id, nombre, correo, id_rol]);
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

// DELETE /api/usuarios/:id
usuariosController.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL sp_eliminar_usuario(?)', [id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

module.exports = usuariosController;
