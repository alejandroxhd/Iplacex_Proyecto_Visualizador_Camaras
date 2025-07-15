<template>
  <section>
    <h3>Gestión de Cámaras</h3>

    <form @submit.prevent="guardarCamara">
      <input v-model="camara.nombre" placeholder="Nombre" required />
      <input v-model="camara.ip" placeholder="IP" required />
      <input v-model="camara.usuario" placeholder="Usuario RTSP" />
      <input v-model="camara.contrasena" placeholder="Contraseña RTSP" />
      <input v-model="camara.region" placeholder="Región" required />
      <input v-model="camara.comuna" placeholder="Comuna" required />
      <input v-model="camara.direccion" placeholder="Dirección" required />

      <label>
        <input type="checkbox" v-model="camara.es_particular" />
        ¿Es particular?
      </label>

      <select v-model="camara.id_empresa" :disabled="camara.es_particular">
        <option disabled value="">Seleccione empresa</option>
        <option v-for="emp in empresas" :key="emp.id_empresa" :value="emp.id_empresa">
          {{ emp.nombre }}
        </option>
      </select>

      <button type="submit">{{ camara.id_camara ? 'Actualizar' : 'Crear' }}</button>
      <button type="button" @click="resetCamara">Cancelar</button>
    </form>

    <table class="tabla">
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
            <button @click="editarCamara(c)">Editar</button>
            <button @click="eliminarCamara(c.id_camara)">Eliminar</button>
            <button
              @click="iniciarStream(c.id_camara)"
              :disabled="estadoStream[c.id_camara]"
            >
              Iniciar
            </button>
            <button
              v-if="estadoStream[c.id_camara]"
              @click="detenerStream(c.id_camara)"
            >
              Detener
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
        usuario_rtsp: this.camara.usuario,
        contrasena_rtsp: this.camara.contrasena,
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
        usuario: c.usuario_rtsp,
        contrasena: c.contrasena_rtsp,
        region: c.region,
        comuna: c.comuna,
        direccion: c.direccion,
        id_empresa: c.id_empresa,
        es_particular: Boolean(c.es_particular)
      }
    },
    resetCamara() {
      this.camara = {
        id_camara: null,
        nombre: '',
        ip: '',
        usuario: '',
        contrasena: '',
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
.tabla {
  width: 100%;
  border-collapse: collapse;
}
.tabla th,
.tabla td {
  border: 1px solid #ccc;
  padding: 6px;
}
</style>
