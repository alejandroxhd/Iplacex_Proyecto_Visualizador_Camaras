<template>
  <section>
    <h3>Gestión de Empresas</h3>

    <form @submit.prevent="guardarEmpresa">
      <input v-model="empresa.nombre" placeholder="Nombre" required />
      <input v-model="empresa.rut" placeholder="RUT" required />
      <input v-model="empresa.direccion" placeholder="Dirección" required />
      <button type="submit">{{ empresa.id_empresa ? 'Actualizar' : 'Crear' }}</button>
      <button type="button" @click="resetEmpresa">Cancelar</button>
    </form>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>RUT</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in empresas" :key="e.id_empresa">
          <td>{{ e.id_empresa }}</td>
          <td>{{ e.nombre }}</td>
          <td>{{ e.rut }}</td>
          <td>{{ e.direccion }}</td>
          <td>
            <button @click="editarEmpresa(e)">Editar</button>
            <button @click="eliminarEmpresa(e.id_empresa)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CrudEmpresas',
  data() {
    return {
      empresas: [],
      empresa: {
        id_empresa: null,
        nombre: '',
        rut: '',
        direccion: ''
      }
    }
  },
  async created() {
    await this.cargarEmpresas()
  },
  methods: {
    async cargarEmpresas() {
      const res = await axios.get('http://localhost:3000/api/empresas', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.empresas = res.data
    },
    async guardarEmpresa() {
      const headers = { Authorization: `Bearer ${this.$store.state.token}` }

      if (this.empresa.id_empresa) {
        await axios.put(
          `http://localhost:3000/api/empresas/${this.empresa.id_empresa}`,
          this.empresa,
          { headers }
        )
        alert('Empresa actualizada')
      } else {
        await axios.post('http://localhost:3000/api/empresas', this.empresa, { headers })
        alert('Empresa creada')
      }

      this.resetEmpresa()
      this.cargarEmpresas()
    },
    editarEmpresa(e) {
      this.empresa = { ...e }
    },
    resetEmpresa() {
      this.empresa = {
        id_empresa: null,
        nombre: '',
        rut: '',
        direccion: ''
      }
    },
    async eliminarEmpresa(id) {
      if (!confirm('¿Eliminar esta empresa?')) return

      await axios.delete(`http://localhost:3000/api/empresas/${id}`, {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.cargarEmpresas()
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
