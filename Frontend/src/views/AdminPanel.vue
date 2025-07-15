<template>
  <div>
    <h2>Panel de Administración</h2>

    <!-- Sección: Crear nueva cámara -->
    <section>
      <h3>Crear nueva cámara</h3>
      <input v-model="nuevaCamara.nombre" placeholder="Nombre de la cámara" />
      <input v-model="nuevaCamara.usuario" placeholder="Usuario RTSP" />
      <input v-model="nuevaCamara.password" placeholder="Contraseña RTSP" />
      <input v-model="nuevaCamara.ip" placeholder="IP de la cámara" />
      <button @click="crearCamara">Crear Cámara</button>
    </section>

    <hr />

    <!-- Sección: Lista de usuarios y asignación de cámaras -->
    <section>
      <h3>Usuarios</h3>
      <div v-for="usuario in usuarios" :key="usuario.id_usuario">
        <p><strong>{{ usuario.nombre }}</strong> - {{ usuario.correo }}</p>

        <label>Asignar cámara:</label>
        <select v-model="camaraSeleccionada[usuario.id_usuario]">
          <option disabled value="">Seleccione una cámara</option>
          <option v-for="cam in camaras" :key="cam.id_camara" :value="cam.id_camara">
            {{ cam.nombre }}
          </option>
        </select>
        <button @click="asignarCamara(usuario.id_usuario)">Asignar</button>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminPanelView',
  data() {
    return {
      usuarios: [],
      camaras: [],
      camaraSeleccionada: {},
      nuevaCamara: {
        nombre: '',
        usuario: '',
        password: '',
        ip: ''
      }
    }
  },
  async created() {
    const token = this.$store.state.token

    const usuariosRes = await axios.get('http://localhost:3000/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const camarasRes = await axios.get('http://localhost:3000/api/camaras/todas', {
      headers: { Authorization: `Bearer ${token}` }
    })

    this.usuarios = usuariosRes.data
    this.camaras = camarasRes.data
  },
  methods: {
    async asignarCamara(id_usuario) {
      const token = this.$store.state.token
      const id_camara = this.camaraSeleccionada[id_usuario]

      if (!id_camara) return alert('Seleccione una cámara')

      try {
        await axios.post(
          'http://localhost:3000/api/asignar-camara',
          { id_usuario, id_camara },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Cámara asignada correctamente')
      } catch (error) {
        alert('Error al asignar cámara')
      }
    },

    async crearCamara() {
      const token = this.$store.state.token
      const { nombre, usuario, password, ip } = this.nuevaCamara

      if (!nombre || !usuario || !password || !ip) {
        return alert('Complete todos los campos')
      }

      try {
        await axios.post(
          'http://localhost:3000/api/camaras',
          { nombre, usuario, password, ip },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Cámara creada con éxito')
        this.nuevaCamara = { nombre: '', usuario: '', password: '', ip: '' }
      } catch (error) {
        alert('Error al crear cámara')
      }
    }
  }
}
</script>
