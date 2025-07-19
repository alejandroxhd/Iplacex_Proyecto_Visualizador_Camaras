<template>
  <section class="crud-camaras">
    <!-- Formulario de cámara -->
    <div class="card form-card">
      <header class="card-header" ref="headerForm">
        <h3 class="card-title">Gestión de Cámaras</h3>
      </header>
      <form class="card-body form-grid" @submit.prevent="guardarCamara">
        <input v-model="camara.nombre" placeholder="Nombre" type="text" required />
        <input v-model="camara.ip" placeholder="IP" type="text" required />
        <input v-model="camara.usuario_rtsp" placeholder="Usuario RTSP" type="text" />
        <input v-model="camara.contrasena_rtsp" placeholder="Contraseña RTSP" type="password" />
        <input v-model="camara.region" placeholder="Región" type="text" required />
        <input v-model="camara.comuna" placeholder="Comuna" type="text" required />
        <input v-model="camara.direccion" placeholder="Dirección" type="text" required />

        <label class="chk-particular">
          <input type="checkbox" v-model="camara.es_particular" />
          ¿Es particular?
        </label>

        <select v-model="camara.id_empresa" :disabled="camara.es_particular">
          <option disabled value="">Seleccione empresa</option>
          <option v-for="emp in empresas" :key="emp.id_empresa" :value="emp.id_empresa">
            {{ emp.nombre }}
          </option>
        </select>

        <div class="edit-btn-group">
          <button class="btn btn-success" type="submit">{{ camara.id_camara ? 'Actualizar' : 'Crear' }}</button>
          <button class="btn btn-cancel" type="button" @click="resetCamara">Cancelar</button>
        </div>
      </form>
    </div>

    <hr class="divider" />

    <!-- Tabla de cámaras -->
    <div class="card">
      <header class="card-header">
        <h3 class="card-title">Cámaras registradas</h3>
      </header>
      <div class="card-body">
        <table class="camaras-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>IP</th>
              <th>Ubicación</th>
              <th>Empresa</th>
              <th>Particular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in camaras" :key="c.id_camara">
              <td>{{ c.id_camara }}</td>
              <td>{{ c.nombre }}</td>
              <td>{{ c.ip }}</td>
              <td>{{ c.region }}, {{ c.comuna }} - {{ c.direccion }}</td>
              <td>{{ c.id_empresa || '—' }}</td>
              <td>{{ c.es_particular ? 'Sí' : 'No' }}</td>
              <td>
                <button class="btn btn-edit" @click="editarCamara(c)">Editar</button>
                <button class="btn btn-danger" @click="eliminarCamara(c.id_camara)">Eliminar</button>
                <button
                  class="btn btn-success"
                  @click="iniciarStream(c.id_camara)"
                  :disabled="estadoStream[c.id_camara]"
                >
                  Iniciar
                </button>
                <button
                  v-if="estadoStream[c.id_camara]"
                  class="btn btn-cancel"
                  @click="detenerStream(c.id_camara)"
                >
                  Detener
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CrudCamaras',
  data() {
    return {
      camaras: [],
      empresas: [],
      estadoStream: {},
      camara: {
        id_camara: null,
        nombre: '',
        ip: '',
        usuario_rtsp: '',
        contrasena_rtsp: '',
        region: '',
        comuna: '',
        direccion: '',
        id_empresa: '',
        es_particular: false
      }
    }
  },
  async created() {
    await this.cargarCamaras()
    await this.cargarEmpresas()
    await this.marcarCamarasActivas()
  },
  methods: {
    async cargarCamaras() {
      const res = await axios.get('http://localhost:3000/api/camaras', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.camaras = res.data
    },
    async cargarEmpresas() {
      const res = await axios.get('http://localhost:3000/api/empresas', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.empresas = res.data
    },
    async marcarCamarasActivas() {
      try {
        const res = await axios.get('http://localhost:3000/api/stream/activos', {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        const activos = res.data.activos

        for (const cam of this.camaras) {
          this.estadoStream[cam.id_camara] = activos.includes(`cam_${cam.id_camara}`)
        }
      } catch (error) {
        console.error('Error al obtener cámaras activas:', error)
      }
    },
    async guardarCamara() {
      const headers = { Authorization: `Bearer ${this.$store.state.token}` }
      const payload = {
        nombre: this.camara.nombre,
        ip: this.camara.ip,
        usuario_rtsp: this.camara.usuario_rtsp,
        contrasena_rtsp: this.camara.contrasena_rtsp,
        region: this.camara.region,
        comuna: this.camara.comuna,
        direccion: this.camara.direccion,
        id_empresa: this.camara.es_particular ? null : this.camara.id_empresa,
        es_particular: this.camara.es_particular ? 1 : 0
      }

      if (this.camara.id_camara) {
        await axios.put(`http://localhost:3000/api/camaras/${this.camara.id_camara}`, payload, { headers })
        alert('Cámara actualizada')
      } else {
        await axios.post('http://localhost:3000/api/camaras', payload, { headers })
        alert('Cámara creada')
      }

      this.resetCamara()
      await this.cargarCamaras()
      await this.marcarCamarasActivas()
    },
    editarCamara(c) {
      this.camara = {
        id_camara: c.id_camara,
        nombre: c.nombre,
        ip: c.ip,
        usuario_rtsp: c.usuario_rtsp,
        contrasena_rtsp: c.contrasena_rtsp,
        region: c.region,
        comuna: c.comuna,
        direccion: c.direccion,
        id_empresa: c.id_empresa,
        es_particular: Boolean(c.es_particular)
      }
      this.$nextTick(() => {
        this.$refs.headerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    resetCamara() {
      this.camara = {
        id_camara: null,
        nombre: '',
        ip: '',
        usuario_rtsp: '',
        contrasena_rtsp: '',
        region: '',
        comuna: '',
        direccion: '',
        id_empresa: '',
        es_particular: false
      }
    },
    async eliminarCamara(id) {
      if (!confirm('¿Eliminar esta cámara?')) return
      await axios.delete(`http://localhost:3000/api/camaras/${id}`, {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      alert('Cámara eliminada')
      await this.cargarCamaras()
      await this.marcarCamarasActivas()
    },
    async iniciarStream(id) {
      try {
        await axios.post(`http://localhost:3000/api/stream/iniciar/${id}`, {}, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        this.estadoStream[id] = true
        alert(`Streaming iniciado para cámara ${id}`)
      } catch (err) {
        console.error('Error al iniciar stream:', err)
        alert('Error al iniciar el streaming')
      }
    },
    async detenerStream(id) {
      try {
        await axios.post(`http://localhost:3000/api/stream/detener/${id}`, {}, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        this.estadoStream[id] = false
        alert(`Streaming detenido para cámara ${id}`)
      } catch (err) {
        console.error('Error al detener stream:', err)
        alert('Error al detener el streaming')
      }
    }
  }
}
</script>

<style scoped>
.crud-camaras {
  max-width: 1100px;
  margin: 32px auto;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f6f7fb;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(60, 71, 117, 0.13);
}

.card {
  background: #fff;
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(140, 160, 200, 0.07);
  border: 1px solid #e6e7ec;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f1f1;
  background: #f5f7fa;
  border-radius: 14px 14px 0 0;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  color: #283a5b;
  font-weight: 600;
  letter-spacing: 1px;
}

.card-body {
  padding: 18px 24px;
}

.form-card {
  margin-bottom: 28px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: center;
}

input[type="text"],
input[type="password"] {
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid #bfc7d1;
  background: #f7f8fa;
  transition: border 0.3s;
  font-size: 1rem;
  outline: none;
}
input:focus {
  border: 1.5px solid #5e7cf4;
  background: #f0f5fe;
}

.chk-particular {
  grid-column: 1 / -1;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
}

select {
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid #bfc7d1;
  background: #f7f8fa;
  font-size: 1rem;
  outline: none;
  margin-bottom: 2px;
}
select:disabled {
  background: #ebebeb;
  color: #aaa;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 7px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 7px;
  margin-bottom: 7px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(120, 130, 190, 0.07);
}
.btn-success {
  background: linear-gradient(90deg,#43e97b 0,#38f9d7 100%);
  color: #225;
}
.btn-danger {
  background: linear-gradient(90deg,#f85032 0,#e73827 100%);
  color: #fff;
}
.btn-edit {
  background: linear-gradient(90deg,#1fa2ff 0,#12d8fa 100%);
  color: #fff;
}
.btn-cancel {
  background: #ccc;
  color: #444;
}
.btn:active {
  filter: brightness(0.96);
}
.edit-btn-group {
  grid-column: 1/-1;
  text-align: right;
}

.divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg,#a8edea 0,#fed6e3 100%);
  margin: 30px 0;
}

.camaras-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px #eae9f2;
}
.camaras-table th, .camaras-table td {
  padding: 12px 8px;
  text-align: left;
}
.camaras-table th {
  background: #f5f7fa;
  color: #4e5d78;
  font-weight: 700;
  border-bottom: 1.5px solid #eaeaea;
}
.camaras-table tr:nth-child(even) td {
  background: #f8fafd;
}
</style>
