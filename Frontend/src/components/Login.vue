<template>
  <div class="login-bg">
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <input v-model="correo" placeholder="Correo" type="email" />
      <input v-model="contrasena" type="password" placeholder="Contraseña" />
      <button class="btn-login" @click="login">Entrar</button>
    </div>
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
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          correo: this.correo,
          contrasena: this.contrasena
        })

        if (!res.data.token || !res.data.usuario) {
          alert('Respuesta inválida del servidor')
          return
        }

        const usuario = {
          id_usuario: res.data.usuario.id,
          nombre: res.data.usuario.nombre,
          rol: res.data.usuario.rol
        }

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('usuario', JSON.stringify(usuario))
        this.$store.commit('setUsuario', {
          usuario,
          token: res.data.token
        })
        this.$router.push('/dashboard')
      } catch (err) {
        alert('Credenciales inválidas o error de conexión')
      }
    }
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 100%;
  max-width: 380px;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(60, 71, 117, 0.13);
  text-align: center;
  padding: 2.3rem 2rem 2rem 2rem;
}

.login-container h2 {
  margin-bottom: 26px;
  color: #222;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}
input[type="email"],
input[type="password"] {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 11px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #bfc7d1;
  background: #f7f8fa;
  transition: border 0.3s, background 0.3s;
  outline: none;
}
input:focus {
  border: 1.5px solid #5e7cf4;
  background: #f0f5fe;
}
.btn-login {
  width: 100%;
  padding: 12px 0;
  font-size: 1.1rem;
  border: none;
  border-radius: 7px;
  background: linear-gradient(90deg,#43e97b 0,#38f9d7 100%);
  color: #225;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.18s, color 0.18s, box-shadow 0.16s;
  box-shadow: 0 1px 4px rgba(120, 130, 190, 0.09);
}
.btn-login:hover {
  background: linear-gradient(90deg,#1fa2ff 0,#12d8fa 100%);
  color: #fff;
}

/* --- RESPONSIVE --- */
@media (max-width: 600px) {
  .login-bg {
    padding: 0;
    align-items: flex-start;
  }
  .login-container {
    max-width: 97vw;
    border-radius: 12px;
    margin-top: 48px;
    padding: 2rem 5vw 1.6rem 5vw;
    box-shadow: 0 2px 20px rgba(60, 71, 117, 0.11);
  }
  .login-container h2 {
    font-size: 1.18rem;
  }
  input[type="email"],
  input[type="password"] {
    padding: 11px 8px;
    font-size: 0.98rem;
    margin-bottom: 13px;
  }
  .btn-login {
    padding: 11px 0;
    font-size: 1rem;
  }
}
</style>
