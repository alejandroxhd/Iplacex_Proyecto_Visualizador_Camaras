<template>
  <div class="dashboard-bg">
    <div class="dashboard">
      <Navbar />
      <h2 class="dashboard__title">Cámaras Asignadas</h2>

      <div v-if="camaras.length === 0" class="dashboard__empty">
        <p>No tienes cámaras asignadas.</p>
      </div>

      <Draggable
        v-else
        v-model="camaras"
        item-key="id_camara"
        tag="div"
        class="dashboard__grid"
        handle=".camera-card__handle"
        ghost-class="camera-card--dragging"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <div class="camera-card">
            <div class="camera-card__header">
              <span class="camera-card__handle">↕️</span>
              <h3 class="camera-card__title">{{ element.nombre }}</h3>
            </div>
            <div class="camera-card__video-wrap">
              <video
                :id="'video_' + element.id_camara"
                class="camera-card__video"
                controls
                autoplay
                muted
                playsinline
              ></video>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script>
import { default as Draggable } from 'vuedraggable'
import Navbar from './Navbar.vue'
import axios from 'axios'
import Hls from 'hls.js'

export default {
  name: 'DashboardView',
  components: {
    Navbar,
    Draggable
  },
  data() {
    return {
      camaras: []
    }
  },
  async created() {
    try {
      const token = this.$store.state.token
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.get('http://localhost:3000/api/camaras', { headers })
      this.camaras = res.data

      // Reproducir cada stream tras cargar datos
      setTimeout(() => {
        this.camaras.forEach(c => this.reproducirCamara(c.id_camara))
      }, 500)
    } catch (e) {
      console.error('Error al cargar cámaras:', e)
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
        hls.on(Hls.Events.ERROR, () =>
          console.error(`Falló HLS cámara ${id}`)
        )
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      } else {
        console.error(`HLS no soportado en cámara ${id}`)
      }
    },
    onDragEnd() {
      // El array `camaras` ya viene reordenado
      console.log('Nuevo orden de IDs:', this.camaras.map(c => c.id_camara))
      // Si quieres persistir el orden en tu back, haz aquí la llamada API
    }
  }
}
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 0;
}
.dashboard {
  max-width: 1120px;
  margin: 38px auto 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 32px rgba(60, 71, 117, 0.12);
  padding: 34px 38px 40px 38px;
}
.dashboard__title {
  font-size: 2rem;
  margin-bottom: 1.2rem;
  color: #1fa2ff;
  font-weight: 700;
  letter-spacing: 1px;
}
.dashboard__empty {
  text-align: center;
  color: #777;
  padding: 2.2rem 0;
  font-size: 1.18rem;
}
.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.8rem;
}
.camera-card {
  background: linear-gradient(120deg, #f0f5ff 0%, #f5f7fa 100%);
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(130, 180, 255, 0.11);
  display: flex;
  flex-direction: column;
  cursor: grab;
  transition: box-shadow 0.14s;
  border: 1.2px solid #e1e7f7;
}
.camera-card--dragging {
  opacity: 0.6;
  box-shadow: 0 0 0 4px #1fa2ff33;
}
.camera-card__header {
  display: flex;
  align-items: center;
  background: #eaf5ff;
  border-bottom: 1px solid #e3e9f6;
  padding: 0.6rem 1.1rem;
  border-radius: 14px 14px 0 0;
}
.camera-card__handle {
  margin-right: 0.7rem;
  font-size: 1.25rem;
  cursor: grab;
  color: #1fa2ff;
}
.camera-card__title {
  margin: 0;
  font-size: 1.18rem;
  font-weight: 600;
  color: #314464;
  flex: 1;
}
.camera-card__video-wrap {
  padding: 10px 14px 16px 14px;
  background: #f8fafd;
  border-radius: 0 0 14px 14px;
}
.camera-card__video {
  width: 100%;
  height: 205px;
  background: #000;
  border-radius: 8px;
  border: 1px solid #dde5f0;
  outline: none;
}
</style>
