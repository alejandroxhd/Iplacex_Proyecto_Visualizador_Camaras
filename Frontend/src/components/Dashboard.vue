<template>
  <div>
    <Navbar />
    <h2>Cámaras Asignadas</h2>

    <div v-if="camaras.length === 0">
      <p>No tienes cámaras asignadas.</p>
    </div>

    <div v-for="cam in camaras" :key="cam.id_camara">
      <h4>{{ cam.nombre }}</h4>
      <video
        ref="video"
        :id="'video_' + cam.id_camara"
        controls
        autoplay
        muted
        playsinline
        style="width: 100%; max-width: 600px; margin-bottom: 10px;"
      ></video>
      <p v-if="errores.includes(cam.id_camara)" style="color: red;">
        ⚠️ No se pudo cargar el video de esta cámara.
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Hls from 'hls.js'
import Navbar from './Navbar.vue'

export default {
  name: 'DashboardView',
  components: { Navbar },
  data() {
    return {
      camaras: [],
      errores: []
    }
  },
  async created() {
    try {
      const token = this.$store.state.token
      const headers = { Authorization: `Bearer ${token}` }

      const res = await axios.get('http://localhost:3000/api/camaras', { headers })
      this.camaras = res.data

      // Solo reproducir, no iniciar
      setTimeout(() => {
        this.camaras.forEach(c => this.reproducirCamara(c.id_camara))
      }, 1000)
    } catch (error) {
      console.error('Error al cargar cámaras:', error)
    }
  },
  methods: {
    reproducirCamara(id) {
      const video = document.getElementById('video_' + id)
      const src = `http://localhost:3000/streams/cam_${id}/index.m3u8`

      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.ERROR, () => {
          this.mostrarError(id)
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      } else {
        this.mostrarError(id)
      }
    },
    mostrarError(id) {
      if (!this.errores.includes(id)) {
        this.errores.push(id)
      }
    }
  }
}
</script>
