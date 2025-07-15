const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'REEMPLAZAR_POR_DIRECCION_DE_MYSQL',
  user: 'REEMPLAZAR_POR_USUARIO_SQL',
  password: 'REEMPLAZAR_POR_CONTRASEÑA_DEL_USUARIO_SQL',
  database: 'REEMPLAZAR_POR_NOMBRE_DE_LA_BASE_DE_DATOS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
