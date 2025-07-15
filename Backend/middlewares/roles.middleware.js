function permitirSolo(rolesPermitidos = []) {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: permiso insuficiente' });
    }

    next();
  };
}

module.exports = { permitirSolo };
