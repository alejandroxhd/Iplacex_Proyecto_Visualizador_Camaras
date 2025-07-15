const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {};

// REGISTRO
authController.register = async (req, res) => {
  const { nombre, correo, contrasena, id_rol } = req.body;

  try {
    const hash = await bcrypt.hash(contrasena, 10);

    const [resultado] = await pool.query('CALL sp_crear_usuario(?, ?, ?, ?)', [
      nombre,
      correo,
      hash,
      id_rol
    ]);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// LOGIN
authController.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [filas] = await pool.query('CALL sp_obtener_usuario_por_correo(?)', [correo]);
    const usuario = filas[0][0];

    if (!usuario) return res.status(401).json({ mensaje: 'Correo no registrado' });

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.id_rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    await pool.query('CALL sp_registrar_log(?, NULL, ?)', [usuario.id_usuario, 'Inicio de sesión']);
    res.status(200).json({ token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.id_rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = authController;
