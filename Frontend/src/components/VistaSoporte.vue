<template>
  <div class="p-4">
    <h3 class="mb-2">Soporte Técnico</h3>

    <!-- Crear nuevo ticket -->
    <div v-if="!esAdmin" class="mt-4">
      <h4>Crear nuevo ticket</h4>
      <input v-model="nuevoTicket.asunto" placeholder="Asunto" class="block mb-2" />
      <textarea v-model="nuevoTicket.descripcion" placeholder="Descripción del problema" class="block mb-2"></textarea>
      <button @click="crearTicket">Enviar</button>
    </div>

    <hr class="my-4" />

    <!-- Lista de tickets -->
    <h4>{{ esAdmin ? 'Todos los Tickets' : 'Mis Tickets' }}</h4>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.id_ticket" class="mb-2 border p-2">
        <strong>{{ ticket.asunto }}</strong> ({{ ticket.estado }}) - {{ formatearFecha(ticket.fecha_creacion) }}
        <span v-if="esAdmin"> - Usuario: {{ ticket.creado_por }}</span>
        <button @click="verRespuestas(ticket.id_ticket)">Ver respuestas</button>

        <!-- Cambiar estado (solo admin) -->
        <div v-if="esAdmin" class="mt-2">
          <label>Estado:</label>
          <select v-model="estados[ticket.id_ticket]">
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <button @click="cambiarEstado(ticket.id_ticket)">Actualizar</button>
        </div>
      </li>
    </ul>

    <!-- Respuestas del ticket -->
    <div v-if="ticketSeleccionado">
      <hr class="my-4" />
      <h4>Respuestas al ticket: {{ ticketSeleccionado }}</h4>
      <div v-for="respuesta in respuestas" :key="respuesta.id_respuesta" class="mb-2 p-2 border">
        <strong>{{ respuesta.autor }}</strong> dijo:
        <p>{{ respuesta.mensaje }}</p>
        <small>{{ formatearFecha(respuesta.fecha) }}</small>
      </div>

      <textarea v-model="nuevaRespuesta" placeholder="Escribe una respuesta..." class="block mb-2"></textarea>
      <button @click="responderTicket">Responder</button>
    </div>
  </div>
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
    }
  },
  mounted() {
    this.cargarTickets();
  }
};
</script>

<style scoped>
input,
textarea,
select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 6px 12px;
  margin-top: 4px;
  cursor: pointer;
}
</style>
