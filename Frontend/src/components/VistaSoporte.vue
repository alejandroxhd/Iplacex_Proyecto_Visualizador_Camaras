<template>
  <section class="soporte-main">
    <div class="card soporte-card">
      <header class="card-header">
        <h3 class="card-title">Soporte Técnico</h3>
      </header>

      <!-- Crear nuevo ticket -->
      <div v-if="!esAdmin" class="card-body">
        <h4>Crear nuevo ticket</h4>
        <input v-model="nuevoTicket.asunto" placeholder="Asunto" type="text" required />
        <textarea v-model="nuevoTicket.descripcion" placeholder="Descripción del problema" required></textarea>
        <div class="btn-group">
          <button class="btn btn-success" @click="crearTicket">Enviar</button>
        </div>
      </div>

      <hr class="divider" />

      <!-- Lista de tickets -->
      <div class="card-body">
        <h4 class="mb-2">{{ esAdmin ? 'Todos los Tickets' : 'Mis Tickets' }}</h4>
        <ul class="tickets-list desktop-list">
          <li v-for="ticket in tickets" :key="ticket.id_ticket" class="ticket-item">
            <div class="ticket-main">
              <strong>{{ ticket.asunto }}</strong>
              <span class="estado" :class="estadoClase(ticket.estado)">{{ ticket.estado }}</span>
              <span class="fecha">{{ formatearFecha(ticket.fecha_creacion) }}</span>
              <span v-if="esAdmin" class="usuario"> - Usuario: <b>{{ ticket.creado_por }}</b></span>
            </div>
            <div class="ticket-actions">
              <button class="btn btn-edit" @click="verRespuestas(ticket.id_ticket)">Ver respuestas</button>
              <template v-if="esAdmin">
                <label class="mr-1">Estado:</label>
                <select v-model="estados[ticket.id_ticket]">
                  <option value="Abierto">Abierto</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
                <button class="btn btn-success" @click="cambiarEstado(ticket.id_ticket)">Actualizar</button>
              </template>
            </div>
          </li>
        </ul>

        <!-- Lista vertical de tickets para mobile -->
        <div class="tickets-cards-mobile" v-if="tickets.length > 0">
          <div v-for="ticket in tickets" :key="ticket.id_ticket" class="ticket-card-mobile">
            <div><b>Asunto:</b> {{ ticket.asunto }}</div>
            <div>
              <b>Estado:</b>
              <span class="estado" :class="estadoClase(ticket.estado)">{{ ticket.estado }}</span>
            </div>
            <div><b>Fecha:</b> {{ formatearFecha(ticket.fecha_creacion) }}</div>
            <div v-if="esAdmin"><b>Usuario:</b> <span>{{ ticket.creado_por }}</span></div>
            <div class="ticket-actions-mobile">
              <button class="btn btn-edit" @click="verRespuestas(ticket.id_ticket)">Ver respuestas</button>
              <template v-if="esAdmin">
                <div style="margin: 7px 0;">
                  <label class="mr-1">Estado:</label>
                  <select v-model="estados[ticket.id_ticket]">
                    <option value="Abierto">Abierto</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                  <button class="btn btn-success" @click="cambiarEstado(ticket.id_ticket)">Actualizar</button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Respuestas del ticket -->
      <div v-if="ticketSeleccionado" class="respuestas-section">
        <hr class="divider" />
        <h4>Respuestas al ticket: {{ ticketSeleccionado }}</h4>
        <div v-for="respuesta in respuestas" :key="respuesta.id_respuesta" class="respuesta-card">
          <div class="respuesta-header">
            <strong>{{ respuesta.autor }}</strong> dijo:
            <span class="respuesta-fecha">{{ formatearFecha(respuesta.fecha) }}</span>
          </div>
          <p>{{ respuesta.mensaje }}</p>
        </div>
        <textarea v-model="nuevaRespuesta" placeholder="Escribe una respuesta..." class="block mb-2"></textarea>
        <div class="btn-group">
          <button class="btn btn-edit" @click="responderTicket">Responder</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VistaSoporte',
  data() {
    return {
      tickets: [],
      respuestas: [],
      ticketSeleccionado: null,
      nuevoTicket: {
        asunto: '',
        descripcion: ''
      },
      nuevaRespuesta: '',
      estados: {}
    };
  },
  computed: {
    esAdmin() {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      return usuario?.rol === 1 || usuario?.rol === 'Admin';
    }
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No se encontró el token. Debes iniciar sesión nuevamente.');
        this.$router.push('/');
        return {};
      }
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    },
    async cargarTickets() {
      try {
        const url = this.esAdmin
          ? 'http://localhost:3000/api/soporte/admin'
          : 'http://localhost:3000/api/soporte/usuario';
        const res = await axios.get(url, this.getAuthHeaders());
        this.tickets = res.data;
        this.tickets.forEach(t => {
          this.estados[t.id_ticket] = t.estado;
        });
      } catch (err) {
        alert('Error al cargar tickets');
      }
    },
    async crearTicket() {
      try {
        await axios.post('http://localhost:3000/api/soporte/crear', this.nuevoTicket, this.getAuthHeaders());
        this.nuevoTicket = { asunto: '', descripcion: '' };
        this.cargarTickets();
        alert('Ticket enviado');
      } catch (err) {
        console.error('Error al crear el ticket:', err);
        alert('Error al crear el ticket');
      }
    },
    async verRespuestas(id) {
      try {
        this.ticketSeleccionado = id;
        const res = await axios.get(`http://localhost:3000/api/soporte/respuestas/${id}`, this.getAuthHeaders());
        this.respuestas = res.data;
      } catch (err) {
        alert('Error al cargar respuestas');
      }
    },
    async responderTicket() {
      try {
        await axios.post('http://localhost:3000/api/soporte/responder', {
          id_ticket: this.ticketSeleccionado,
          mensaje: this.nuevaRespuesta
        }, this.getAuthHeaders());
        this.nuevaRespuesta = '';
        this.verRespuestas(this.ticketSeleccionado);
      } catch (err) {
        alert('Error al responder');
      }
    },
    async cambiarEstado(id) {
      try {
        await axios.put('http://localhost:3000/api/soporte/estado', {
          id_ticket: id,
          estado: this.estados[id]
        }, this.getAuthHeaders());
        alert('Estado actualizado');
        this.cargarTickets();
      } catch (err) {
        alert('Error al cambiar estado');
      }
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleString();
    },
    estadoClase(estado) {
      if (estado === "Abierto") return "Abierto";
      if (estado === "En Proceso") return "EnProceso";
      if (estado === "Cerrado") return "Cerrado";
      return "";
    }
  },
  mounted() {
    this.cargarTickets();
  }
};
</script>

<style scoped>
/* Fondo degradado para toda la vista */
.soporte-main {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24px 0;
  border-radius: 0;
}

/* Card principal */
.card.soporte-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(140, 160, 200, 0.11);
  border: 1px solid #e6e7ec;
  padding-bottom: 18px;
  width: 100%;
  max-width: 900px;
  margin-top: 32px;
}

/* Header */
.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f1f1;
  background: #f5f7fa;
  border-radius: 14px 14px 0 0;
}
.card-title {
  margin: 0;
  font-size: 1.3rem;
  color: #283a5b;
  font-weight: 700;
  letter-spacing: 1px;
}
.card-body {
  padding: 16px 24px;
}

/* Inputs y botones */
input[type="text"],
textarea,
select {
  width: 100%;
  padding: 9px 12px;
  border-radius: 7px;
  border: 1px solid #bfc7d1;
  background: #f7f8fa;
  font-size: 1rem;
  outline: none;
  margin-bottom: 12px;
  transition: border 0.3s, background 0.3s;
}
input:focus,
textarea:focus,
select:focus {
  border: 1.5px solid #5e7cf4;
  background: #f0f5fe;
}
textarea {
  min-height: 72px;
  resize: vertical;
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
.btn-group {
  text-align: right;
}
.divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg,#a8edea 0,#fed6e3 100%);
  margin: 28px 0 18px 0;
}

/* TICKETS DESKTOP */
.tickets-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ticket-item {
  background: #f8fafd;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 14px 14px 10px 14px;
  box-shadow: 0 1px 5px rgba(90,120,160,0.06);
  border: 1px solid #e7eaf4;
}
.ticket-main {
  font-size: 1.07rem;
  margin-bottom: 6px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.estado {
  font-size: .97rem;
  font-weight: 600;
  border-radius: 5px;
  padding: 1px 11px;
  margin: 0 8px;
}
.estado.Abierto {
  background: #b4ffc6;
  color: #176f26;
}
.estado.EnProceso {
  background: #fff0b2;
  color: #b6850a;
}
.estado.Cerrado {
  background: #ffd0d0;
  color: #ae2323;
}
.fecha, .usuario {
  font-size: .96rem;
  color: #777;
}
.ticket-actions {
  margin-top: 5px;
  display: flex;
  gap: 7px;
  align-items: center;
  flex-wrap: wrap;
}

/* RESPUESTAS */
.respuestas-section {
  padding: 0 24px;
}
.respuesta-card {
  background: #f3f8ff;
  border: 1px solid #d1e4f6;
  border-radius: 7px;
  padding: 12px 16px;
  margin-bottom: 10px;
  box-shadow: 0 0px 7px #e8ecff33;
}
.respuesta-header {
  color: #2260a7;
  font-size: 1.06rem;
  font-weight: 600;
  margin-bottom: 5px;
}
.respuesta-fecha {
  font-size: .92rem;
  font-weight: 400;
  color: #999;
  margin-left: 12px;
}
.mr-1 {
  margin-right: 6px;
}

/* --------- RESPONSIVE: Mostrar tarjetas en móvil ---------- */
.tickets-cards-mobile {
  display: none;
}

@media (max-width: 700px) {
  .soporte-main {
    padding: 0;
  }
  .card.soporte-card {
    max-width: 99vw;
    margin-top: 8px;
    border-radius: 9px;
  }
  .card-header, .card-body {
    padding: 10px 6px;
    border-radius: 8px 8px 0 0;
  }
  .card-title {
    font-size: 1.06rem;
  }
  .tickets-list {
    display: none;
  }
  .tickets-cards-mobile {
    display: flex;
    flex-direction: column;
    gap: 13px;
    margin-top: 8px;
  }
  .ticket-card-mobile {
    background: #f8fafd;
    border: 1.5px solid #e7eaf4;
    border-radius: 9px;
    padding: 14px 11px 10px 13px;
    box-shadow: 0 2px 8px #e6e7ec33;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 6px;
  }
  .ticket-actions-mobile {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 4px;
  }
  .respuestas-section {
    padding: 0 4px;
  }
}
</style>
