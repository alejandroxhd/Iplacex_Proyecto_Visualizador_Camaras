<template>
  <div class="dashboard-bg">
    <div class="dashboard">
      <h2 class="dashboard__title">Cámaras Asignadas</h2>

      <div v-if="camaras.length === 0" class="dashboard__empty">
        <p>No tienes cámaras asignadas.</p>
      </div>

      <div class="dashboard__grid-wrap">
        <Draggable
          v-if="camaras.length > 0"
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
  </div>
</template>

<script>
import { default as Draggable } from 'vuedraggable'
import axios from 'axios'
import Hls from 'hls.js'

export default {
  name: 'DashboardView',
  components: {
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
      // Si quieres persistir el orden en tu back, haz aquí la llamada API
    }
  }
}
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  /* La clave: padding arriba */
  padding-top: 48px;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.dashboard {
  max-width: 1120px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 32px rgba(60, 71, 117, 0.12);
  padding: 38px 32px 44px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.dashboard__title {
  font-size: 2rem;
  margin-bottom: 1.3rem;
  color: #1fa2ff;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center;
}

.dashboard__empty {
  text-align: center;
  color: #777;
  padding: 2.2rem 0;
  font-size: 1.18rem;
}

.dashboard__grid-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.8rem;
  width: 100%;
  max-width: 950px;
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
  min-width: 0;
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
  min-width: 0;
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
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  object-fit: cover;
}

/* TABLET */
@media (max-width: 1020px) {
  .dashboard-bg {
    padding-top: 30px;
  }
  .dashboard {
    max-width: 99vw;
    padding: 18px 2vw 28px 2vw;
    border-radius: 14px;
  }
  .dashboard__grid {
    max-width: 98vw;
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
  }
  .camera-card__video {
    height: 160px;
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .dashboard-bg {
    padding-top: 13vw;
    padding-bottom: 7vw;
  }
  .dashboard {
    padding: 5vw 0 9vw 0;
    border-radius: 0;
    margin: 0;
    max-width: 100vw;
  }
  .dashboard__grid-wrap {
    padding: 0 6px;
  }
  .dashboard__grid {
    grid-template-columns: 1fr;
    max-width: 100vw;
    gap: 13px;
    padding: 0 2vw;
  }
  .camera-card__video {
    height: 130px;
  }
}
</style>
