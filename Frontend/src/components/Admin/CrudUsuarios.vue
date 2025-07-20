<template>
  <section class="crud-usuarios">
    <!-- Crear usuario -->
    <div class="card form-card">
      <header class="card-header">
        <h3 class="card-title">Crear nuevo usuario</h3>
      </header>
      <div class="card-body form-grid">
        <input v-model="nuevoUsuario.nombre" placeholder="Nombre" type="text" required />
        <input v-model="nuevoUsuario.correo" placeholder="Correo" type="email" required />
        <input v-model="nuevoUsuario.contrasena" placeholder="Contraseña" type="password" required />
        <select v-model="nuevoUsuario.rol" required>
          <option disabled value="">Selecciona un rol</option>
          <option value="Admin">Administrador</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Usuario">Usuario</option>
        </select>
        <button class="btn btn-success" @click="crearUsuario">Crear</button>
      </div>
    </div>

    <hr class="divider" />

    <!-- Usuarios registrados -->
    <div class="card">
      <header class="card-header">
        <h3 class="card-title">Usuarios registrados</h3>
      </header>
      <div class="card-body">
        <!-- Tabla escritorio -->
        <table class="usuarios-table desktop-table">
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
                <button class="btn btn-edit" @click="cargarUsuario(u)">Editar</button>
                <button class="btn btn-danger" @click="eliminarUsuario(u.id_usuario)">Eliminar</button>
                <button class="btn btn-permisos" @click="abrirPermisos(u)">Permisos</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile: cards -->
        <div class="usuarios-cards-mobile">
          <div v-for="u in usuarios" :key="u.id_usuario" class="usuario-card-mobile">
            <div class="usuario-nombre">{{ u.nombre }}</div>
            <div class="usuario-info"><b>Correo:</b> {{ u.correo }}</div>
            <div class="usuario-info"><b>Rol:</b> {{ u.rol }}</div>
            <div class="usuario-actions">
              <button class="btn btn-edit" @click="cargarUsuario(u)">Editar</button>
              <button class="btn btn-danger" @click="eliminarUsuario(u.id_usuario)">Eliminar</button>
              <button class="btn btn-permisos" @click="abrirPermisos(u)">Permisos</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Editar usuario -->
    <section v-show="editar" class="edit-modal">
      <div class="card form-card">
        <header class="card-header">
          <h3 class="card-title">Editar usuario</h3>
        </header>
        <div class="card-body form-grid">
          <input v-model="usuarioEdit.nombre" placeholder="Nombre" type="text" required />
          <input v-model="usuarioEdit.correo" placeholder="Correo" type="email" required />
          <select v-model="usuarioEdit.rol" required>
            <option value="Admin">Administrador</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Usuario">Usuario</option>
          </select>
          <div class="edit-btn-group">
            <button class="btn btn-success" @click="actualizarUsuario">Actualizar</button>
            <button class="btn btn-cancel" @click="cancelarEdicion">Cancelar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal permisos -->
    <div v-show="mostrarPermisos" class="modal-bg">
      <div class="modal">
        <h3>Asignar cámaras a <span class="txt-accent">{{ usuarioSeleccionado?.nombre }}</span></h3>
        <div class="camaras-list">
          <div v-for="cam in camaras" :key="cam.id_camara" class="cam-checkbox">
            <input
              type="checkbox"
              :id="'cam-' + cam.id_camara"
              :value="cam.id_camara"
              v-model="camarasSeleccionadas"
            />
            <label :for="'cam-' + cam.id_camara">{{ cam.nombre }}</label>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-success" @click="guardarPermisos">Guardar</button>
          <button class="btn btn-cancel" @click="cerrarPermisos">Cerrar</button>
        </div>
      </div>
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
      // Fix: cerrar edición y permisos si el usuario estaba siendo editado o con permisos abiertos
      this.editar = false
      this.mostrarPermisos = false
      this.usuarioSeleccionado = null

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
.crud-usuarios {
  max-width: 950px;
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

/* --- Formulario vertical --- */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: center;
}
input[type="text"],
input[type="email"],
input[type="password"],
select {
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid #bfc7d1;
  background: #f7f8fa;
  transition: border 0.3s;
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
input:focus, select:focus {
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
.btn-permisos {
  background: linear-gradient(90deg,#ffe259 0,#ffa751 100%);
  color: #995510;
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

/* Tabla responsiva escritorio */
.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px #eae9f2;
}
.usuarios-table th, .usuarios-table td {
  padding: 12px 8px;
  text-align: left;
}
.usuarios-table th {
  background: #f5f7fa;
  color: #4e5d78;
  font-weight: 700;
  border-bottom: 1.5px solid #eaeaea;
}
.usuarios-table tr:nth-child(even) td {
  background: #f8fafd;
}
.desktop-table {
  display: table;
}
.usuarios-cards-mobile {
  display: none;
}

/* --- Mobile: cards --- */
@media (max-width: 900px) {
  .crud-usuarios {
    padding: 8px;
    max-width: 100vw;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 13px;
  }
  .card-header, .card-body {
    padding: 13px 7px;
  }
}

@media (max-width: 700px) {
  .crud-usuarios {
    padding: 0;
    margin: 7px auto;
    border-radius: 7px;
  }
  .form-card {
    margin-bottom: 10px;
    border-radius: 7px;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .edit-btn-group {
    margin-top: 8px;
    text-align: center;
  }
  .desktop-table {
    display: none;
  }
  .usuarios-cards-mobile {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 10px;
  }
  .usuario-card-mobile {
    background: #f8fafd;
    border: 1.5px solid #e6e7ec;
    border-radius: 9px;
    padding: 15px 12px;
    box-shadow: 0 2px 9px #e6e7ec45;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .usuario-nombre {
    font-weight: 600;
    color: #225;
    font-size: 1.13rem;
    margin-bottom: 3px;
  }
  .usuario-info {
    color: #336;
    font-size: .99rem;
    margin-bottom: 2px;
  }
  .usuario-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 4px;
  }
  .usuario-actions .btn {
    flex: 1 1 40%;
    min-width: 90px;
    margin: 0;
  }
}

/* MODALES y otros siguen igual */
.edit-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(67, 105, 231, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
}

.modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(40, 58, 92, 0.23);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}
.modal {
  background: #fff;
  border-radius: 14px;
  max-width: 410px;
  width: 100%;
  padding: 28px 32px 20px 32px;
  box-shadow: 0 4px 24px rgba(56,89,188,0.13);
  border: 2px solid #e0e5ff;
}
.modal h3 {
  font-size: 1.2rem;
  color: #4e5d78;
  margin-bottom: 14px;
  text-align: left;
}
.txt-accent {
  color: #1fa2ff;
  font-weight: 600;
}
.camaras-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
  margin-top: 10px;
}
.cam-checkbox {
  margin-bottom: 7px;
}
.modal-actions {
  text-align: right;
}
</style>
