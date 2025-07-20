<template>
  <section class="logs-main">
    <div class="card logs-card">
      <header class="card-header">
        <h2 class="card-title">Registro de Actividades</h2>
      </header>
      <div class="card-body">
        <div v-if="cargando" class="cargando-text">Cargando logs...</div>
        <!-- Tabla escritorio -->
        <table v-else class="logs-table desktop-table">
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
        <!-- Cards mobile -->
        <div class="logs-cards-mobile" v-if="!cargando">
          <div v-for="log in logs" :key="log.id_log" class="log-card-mobile">
            <div class="campo"><b>Usuario:</b> {{ nombreUsuario(log.id_usuario) }}</div>
            <div class="campo"><b>Cámara:</b> {{ nombreCamara(log.id_camara) }}</div>
            <div class="campo"><b>Evento:</b> {{ log.evento }}</div>
            <div class="campo"><b>Fecha:</b> {{ new Date(log.fecha).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VistaLogs',
  data() {
    return {
      logs: [],
      usuarios: {},
      camaras: {},
      cargando: true
    }
  },
  async created() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const esAdmin = usuario?.rol === 1 || usuario?.rol === "1" || usuario?.rol === 'Admin';

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
}
</script>

<style scoped>
/* Fondo con degradé */
.logs-main {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  border-radius: 0;
}

/* Card Logs */
.card.logs-card {
  background: #fff;
  border-radius: 14px;
  margin-top: 32px;
  box-shadow: 0 2px 10px rgba(140, 160, 200, 0.11);
  border: 1px solid #e6e7ec;
  width: 100%;
  max-width: 950px;
}

/* Header Card */
.card-header {
  padding: 20px 32px;
  border-bottom: 1px solid #f1f1f1;
  background: #f5f7fa;
  border-radius: 14px 14px 0 0;
}
.card-title {
  margin: 0;
  font-size: 1.5rem;
  color: #283a5b;
  font-weight: 700;
  letter-spacing: 1px;
}
.card-body {
  padding: 24px 32px;
}
.cargando-text {
  text-align: center;
  font-size: 1.1rem;
  color: #888;
  padding: 26px;
}

/* Tabla logs escritorio */
.logs-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px #eae9f2;
}
.logs-table th, .logs-table td {
  padding: 12px 10px;
  text-align: left;
}
.logs-table th {
  background: #f5f7fa;
  color: #4e5d78;
  font-weight: 700;
  border-bottom: 1.5px solid #eaeaea;
}
.logs-table tr:nth-child(even) td {
  background: #f8fafd;
}

/* MOBILE */
.logs-cards-mobile {
  display: none;
}

/* RESPONSIVE: Mostrar cards en móvil */
@media (max-width: 700px) {
  .logs-main {
    padding-bottom: 10px;
    margin: 0;
    border-radius: 0;
  }
  .card.logs-card {
    border-radius: 8px;
    margin-top: 10px;
    max-width: 99vw;
  }
  .card-header, .card-body {
    padding: 14px 6px;
    border-radius: 8px 8px 0 0;
  }
  .card-title {
    font-size: 1.1rem;
  }
  .logs-table {
    display: none;
  }
  .logs-cards-mobile {
    display: flex;
    flex-direction: column;
    gap: 13px;
    margin-top: 8px;
  }
  .log-card-mobile {
    background: #f8fafd;
    border: 1.5px solid #e6e7ec;
    border-radius: 9px;
    padding: 14px 11px 10px 13px;
    box-shadow: 0 2px 9px #e6e7ec45;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .campo {
    margin-bottom: 2px;
  }
}
</style>
