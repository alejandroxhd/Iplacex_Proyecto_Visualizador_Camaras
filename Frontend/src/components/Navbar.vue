<template>
  <nav>
    <span>Bienvenido, {{ usuario?.nombre || 'Usuario' }}</span>
    <div>
      <button @click="goToDashboard">Dashboard</button>
      <button v-if="usuario?.rol === 1" @click="goToAdmin">Admin</button>
      <button v-if="usuario?.rol === 1" @click="goToLogs">Ver Logs</button>
      <button @click="goToSoporte">Soporte</button>
      <button @click="logout">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarView',
  computed: {
    usuario() {
      return this.$store.state.usuario
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
    },
    goToDashboard() {
      this.$router.push('/dashboard')
    },
    goToAdmin() {
      this.$router.push('/admin')
    },
    goToLogs() {
      this.$router.push('/logs')
    },
    goToSoporte() {
      this.$router.push('/soporte')
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
}
button {
  margin-left: 10px;
  padding: 6px 12px;
  border: none;
  background-color: #1976d2;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #125ea6;
}
</style>
