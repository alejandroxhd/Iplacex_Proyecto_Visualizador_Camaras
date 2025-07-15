<template>
  <div>
    <Navbar />
    <h2>Panel de Administración</h2>

    <!-- Formulario nuevo usuario -->
    <section>
      <h3>Crear nuevo usuario</h3>
      <input v-model="nuevoUsuario.nombre" placeholder="Nombre" />
      <input v-model="nuevoUsuario.correo" placeholder="Correo" />
      <input v-model="nuevoUsuario.contrasena" placeholder="Contraseña" />
      <select v-model="nuevoUsuario.rol">
        <option disabled value="">Selecciona un rol</option>
        <option value="Admin">Administrador</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Usuario">Usuario</option>
      </select>
      <button @click="crearUsuario">Crear</button>
    </section>

    <hr />

    <!-- Tabla de usuarios -->
    <section>
      <h3>Usuarios registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id_usuario">
            <td>{{ u.nombre }}</td>
            <td>{{ u.correo }}</td>
            <td>{{ u.rol }}</td>
            <td>
              <button @click="cargarUsuario(u)">Editar</button>
              <button @click="eliminarUsuario(u.id_usuario)">Eliminar</button>
              <button @click="abrirPermisos(u)">Permisos</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Edición -->
    <section v-if="editar">
      <h3>Editar usuario</h3>
      <input v-model="usuarioEdit.nombre" placeholder="Nombre" />
      <input v-model="usuarioEdit.correo" placeholder="Correo" />
      <select v-model="usuarioEdit.rol">
        <option value="Admin">Administrador</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Usuario">Usuario</option>
      </select>
      <button @click="actualizarUsuario">Actualizar</button>
      <button @click="cancelarEdicion">Cancelar</button>
    </section>

    <!-- Modal permisos -->
    <div v-if="mostrarPermisos" class="modal">
      <h3>Asignar cámaras a {{ usuarioSeleccionado?.nombre }}</h3>
      <div v-for="cam in camaras" :key="cam.id_camara">
        <input
          type="checkbox"
          :id="'cam-' + cam.id_camara"
          :value="cam.id_camara"
          v-model="camarasSeleccionadas"
        />
        <label :for="'cam-' + cam.id_camara">{{ cam.nombre }}</label>
      </div>
      <button @click="guardarPermisos">Guardar</button>
      <button @click="cerrarPermisos">Cerrar</button>
    </div>

    <hr />

    <!-- CRUD de Empresas -->
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
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from './Navbar.vue'

export default {
  name: 'AdminPanelView',
  components: { Navbar },
  data() {
    return {
      usuarios: [],
      camaras: [],
      empresas: [],
      nuevoUsuario: {
        nombre: '',
        correo: '',
        contrasena: '',
        rol: ''
      },
      usuarioEdit: {},
      editar: false,
      mostrarPermisos: false,
      usuarioSeleccionado: null,
      camarasSeleccionadas: [],
      empresa: {
        id_empresa: null,
        nombre: '',
        rut: '',
        direccion: ''
      }
    }
  },
  async created() {
    await this.cargarUsuarios()
    await this.cargarCamaras()
    await this.cargarEmpresas()
  },
  methods: {
    async cargarUsuarios() {
      const res = await axios.get('http://localhost:3000/api/usuarios', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.usuarios = res.data
    },
    async cargarCamaras() {
      const res = await axios.get('http://localhost:3000/api/camaras', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.camaras = res.data
    },
    async crearUsuario() {
      const rolNumerico = {
        Admin: 1,
        Intermedio: 2,
        Usuario: 3
      }

      const payload = {
        nombre: this.nuevoUsuario.nombre,
        correo: this.nuevoUsuario.correo,
        contrasena: this.nuevoUsuario.contrasena,
        rol: rolNumerico[this.nuevoUsuario.rol]
      }

      await axios.post(
        'http://localhost:3000/api/usuarios',
        payload,
        { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
      )
      alert('Usuario creado')
      this.nuevoUsuario = { nombre: '', correo: '', contrasena: '', rol: '' }
      await this.cargarUsuarios()
    },
    cargarUsuario(u) {
      this.editar = true
      this.usuarioEdit = {
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        correo: u.correo,
        rol: u.rol
      }
    },
    cancelarEdicion() {
      this.editar = false
      this.usuarioEdit = {}
    },
    async actualizarUsuario() {
      const rolNumerico = {
        Admin: 1,
        Intermedio: 2,
        Usuario: 3
      }

      const payload = {
        id_usuario: this.usuarioEdit.id_usuario,
        nombre: this.usuarioEdit.nombre,
        correo: this.usuarioEdit.correo,
        id_rol: rolNumerico[this.usuarioEdit.rol]
      }

      await axios.put(
        `http://localhost:3000/api/usuarios/${this.usuarioEdit.id_usuario}`,
        payload,
        { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
      )
      alert('Usuario actualizado')
      this.cancelarEdicion()
      await this.cargarUsuarios()
    },
    async eliminarUsuario(id) {
      if (!confirm('¿Eliminar este usuario?')) return
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      alert('Usuario eliminado')
      await this.cargarUsuarios()
    },
    abrirPermisos(usuario) {
      this.usuarioSeleccionado = usuario
      this.camarasSeleccionadas = []
      this.mostrarPermisos = true
    },
    cerrarPermisos() {
      this.mostrarPermisos = false
      this.usuarioSeleccionado = null
    },
    async guardarPermisos() {
      await axios.post(
        'http://localhost:3000/api/permisos',
        {
          id_usuario: this.usuarioSeleccionado.id_usuario,
          camaras: this.camarasSeleccionadas
        },
        { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
      )
      alert('Permisos asignados')
      this.cerrarPermisos()
    },
    async cargarEmpresas() {
      const res = await axios.get('http://localhost:3000/api/empresas', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })
      this.empresas = res.data
    },
    async guardarEmpresa() {
      const headers = { Authorization: `Bearer ${this.$store.state.token}` }
      if (this.empresa.id_empresa) {
        await axios.put(`http://localhost:3000/api/empresas/${this.empresa.id_empresa}`, this.empresa, { headers })
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
section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ccc;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}
.modal {
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  background: white;
  padding: 1rem;
  border: 2px solid #333;
  z-index: 100;
}
</style>
