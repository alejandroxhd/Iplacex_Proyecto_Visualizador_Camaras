<template>
  <section class="crud-empresas">
    <!-- Formulario empresa -->
    <div class="card form-card">
      <header class="card-header">
        <h3 class="card-title">Gestión de Empresas</h3>
      </header>
      <form class="card-body form-grid" @submit.prevent="guardarEmpresa">
        <input v-model="empresa.nombre" placeholder="Nombre" type="text" required />
        <input v-model="empresa.rut" placeholder="RUT" type="text" required />
        <input v-model="empresa.direccion" placeholder="Dirección" type="text" required />
        <div class="edit-btn-group">
          <button class="btn btn-success" type="submit">{{ empresa.id_empresa ? 'Actualizar' : 'Crear' }}</button>
          <button class="btn btn-cancel" type="button" @click="resetEmpresa">Cancelar</button>
        </div>
      </form>
    </div>

    <hr class="divider" />

    <!-- Tabla empresas -->
    <div class="card">
      <header class="card-header">
        <h3 class="card-title">Empresas registradas</h3>
      </header>
      <div class="card-body">
        <table class="empresas-table">
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
                <button class="btn btn-edit" @click="editarEmpresa(e)">Editar</button>
                <button class="btn btn-danger" @click="eliminarEmpresa(e.id_empresa)">Eliminar</button>
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
.crud-empresas {
  max-width: 900px;
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

input[type="text"] {
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

.empresas-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px #eae9f2;
}
.empresas-table th, .empresas-table td {
  padding: 12px 8px;
  text-align: left;
}
.empresas-table th {
  background: #f5f7fa;
  color: #4e5d78;
  font-weight: 700;
  border-bottom: 1.5px solid #eaeaea;
}
.empresas-table tr:nth-child(even) td {
  background: #f8fafd;
}
</style>
