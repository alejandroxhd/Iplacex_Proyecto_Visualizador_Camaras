<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <input v-model="correo" placeholder="Correo" />
    <input v-model="contrasena" type="password" placeholder="Contraseña" />
    <button @click="login">Entrar</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      correo: '',
      contrasena: ''
    }
  },
  methods: {
    async login() {
      console.log('Intentando iniciar sesión con:', this.correo, this.contrasena)

      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          correo: this.correo,
          contrasena: this.contrasena
        })

        console.log('Respuesta del backend:', res.data)

        if (!res.data.token || !res.data.usuario) {
          alert('Respuesta inválida del servidor')
          return
        }

        // ✅ Normalizar usuario con id_usuario
        const usuario = {
          id_usuario: res.data.usuario.id,
          nombre: res.data.usuario.nombre,
          rol: res.data.usuario.rol
        }

        // ✅ Guardar en localStorage
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('usuario', JSON.stringify(usuario))

        // ✅ Guardar en Vuex con el payload que tu store espera
        this.$store.commit('setUsuario', {
          usuario,
          token: res.data.token
        })

        // ✅ Redirigir
        console.log('Redirigiendo al dashboard...')
        this.$router.push('/dashboard')
      } catch (err) {
        console.error('Error en login:', err)
        alert('Credenciales inválidas o error de conexión')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #125ea6;
}
</style>
