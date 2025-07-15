<template>
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

    <hr />

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
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CrudUsuarios',
  data() {
    return {
      usuarios: [],
      camaras: [],
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
      camarasSeleccionadas: []
    }
  },
  async created() {
    await this.cargarUsuarios()
    await this.cargarCamaras()
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
      const rolNumerico = { Admin: 1, Intermedio: 2, Usuario: 3 }

      const payload = {
        nombre: this.nuevoUsuario.nombre,
        correo: this.nuevoUsuario.correo,
        contrasena: this.nuevoUsuario.contrasena,
        rol: rolNumerico[this.nuevoUsuario.rol]
      }

      await axios.post('http://localhost:3000/api/usuarios', payload, {
        headers: { Authorization: `Bearer ${this.$store.state.token}` }
      })

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
      const rolNumerico = { Admin: 1, Intermedio: 2, Usuario: 3 }

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
    async abrirPermisos(usuario) {
      this.usuarioSeleccionado = usuario
      this.mostrarPermisos = true

      try {
        const res = await axios.get(`http://localhost:3000/api/permisos/${usuario.id_usuario}`, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        })
        this.camarasSeleccionadas = res.data.map(p => p.id_camara)
      } catch (error) {
        console.error('Error al cargar permisos del usuario:', error)
        this.camarasSeleccionadas = []
      }
    },
    cerrarPermisos() {
      this.mostrarPermisos = false
      this.usuarioSeleccionado = null
      this.camarasSeleccionadas = []
    },
    async guardarPermisos() {
      if (!this.usuarioSeleccionado?.id_usuario) {
        alert('Usuario inválido')
        return
      }

      const headers = { Authorization: `Bearer ${this.$store.state.token}` }

      try {
        // Obtener permisos actuales
        const res = await axios.get(`http://localhost:3000/api/permisos/${this.usuarioSeleccionado.id_usuario}`, {
          headers
        })
        const permisosActuales = res.data.map(p => p.id_camara)

        // Determinar cuáles agregar y cuáles eliminar
        const nuevos = this.camarasSeleccionadas.filter(id => !permisosActuales.includes(id))
        const eliminados = permisosActuales.filter(id => !this.camarasSeleccionadas.includes(id))

        // Agregar nuevos permisos
        const crear = nuevos.map(id_camara =>
          axios.post('http://localhost:3000/api/permisos', {
            id_usuario: this.usuarioSeleccionado.id_usuario,
            id_camara
          }, { headers })
        )

        // Eliminar permisos desmarcados
        const borrar = eliminados.map(id_camara =>
          axios.delete('http://localhost:3000/api/permisos', {
            headers,
            data: {
              id_usuario: this.usuarioSeleccionado.id_usuario,
              id_camara
            }
          })
        )

        await Promise.all([...crear, ...borrar])
        alert('Permisos actualizados correctamente')
        this.cerrarPermisos()

      } catch (error) {
        console.error('Error al actualizar permisos:', error)
        alert('Error al actualizar permisos')
      }
    }
  }
}
</script>

<style scoped>
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
