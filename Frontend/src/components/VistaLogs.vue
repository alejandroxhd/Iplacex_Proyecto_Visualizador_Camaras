<template>
  <div>
    <h2>Registro de Actividades</h2>
    <div v-if="cargando">Cargando logs...</div>
    <table v-else>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Cámara</th>
          <th>Evento</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id_log">
          <td>{{ nombreUsuario(log.id_usuario) }}</td>
          <td>{{ nombreCamara(log.id_camara) }}</td>
          <td>{{ log.evento }}</td>
          <td>{{ new Date(log.fecha).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VistaLogs',
  data() {
    return {
      logs: [],
      usuarios: {},
      camaras: {},
      cargando: true
    };
  },
  async created() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const esAdmin = usuario?.rol === 1 || usuario?.rol === "1";

      if (!usuario || !esAdmin) {
        alert('Acceso restringido a administradores');
        this.$router.push('/');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Obtener usuarios
      const usuariosRes = await axios.get('http://localhost:3000/api/usuarios', config);
      usuariosRes.data.forEach(u => {
        this.usuarios[u.id_usuario] = u.nombre;
      });

      // Obtener cámaras
      const camarasRes = await axios.get('http://localhost:3000/api/camaras', config);
      camarasRes.data.forEach(c => {
        this.camaras[c.id_camara] = c.nombre;
      });

      // Obtener logs
      const logsRes = await axios.get('http://localhost:3000/api/logs', config);
      this.logs = logsRes.data;
    } catch (error) {
      console.error('Error al cargar logs:', error);
      alert('Error al cargar los datos. Ver consola.');
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    nombreUsuario(id) {
      return this.usuarios[id] || 'Desconocido';
    },
    nombreCamara(id) {
      return id ? (this.camaras[id] || '-') : '-';
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #aaa;
  padding: 8px;
  text-align: left;
}
thead {
  background-color: #eee;
}
</style>
