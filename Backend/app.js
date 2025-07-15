const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const camarasRoutes = require('./routes/camaras.routes');
const permisosRoutes = require('./routes/permisos.routes');
const logsRoutes = require('./routes/logs.routes');
const streamRoutes = require('./routes/stream.routes');
const empresasRoutes = require('./routes/empresas.routes');
const soporteRoutes = require('./routes/soporte.routes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/camaras', camarasRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/soporte', soporteRoutes);
app.use('/streams', express.static(path.join(__dirname, 'stream')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
