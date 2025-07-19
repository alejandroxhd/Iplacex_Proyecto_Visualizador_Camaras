<template>
  <nav class="navbar-main">
    <div class="navbar-user">
      <span class="navbar-welcome">Bienvenido, <b>{{ usuario?.nombre || 'Usuario' }}</b></span>
    </div>
    <div class="navbar-menu">
      <button class="btn btn-navbar" @click="goToDashboard">Dashboard</button>
      <button v-if="usuario?.rol === 1 || usuario?.rol === 'Admin'" class="btn btn-navbar" @click="goToAdmin">Admin</button>
      <button v-if="usuario?.rol === 1 || usuario?.rol === 'Admin'" class="btn btn-navbar" @click="goToLogs">Ver Logs</button>
      <button class="btn btn-navbar" @click="goToSoporte">Soporte</button>
      <button class="btn btn-navbar btn-logout" @click="logout">Cerrar sesión</button>
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
.navbar-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 32px 14px 32px;
  background: linear-gradient(90deg, #f6f7fb 0%, #f5f7fa 100%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 10px rgba(140, 160, 200, 0.09);
  margin-bottom: 14px;
  border-bottom: 1.5px solid #e6e7ec;
}
.navbar-user {
  font-size: 1.1rem;
  color: #3b4d69;
  font-weight: 500;
  letter-spacing: .5px;
}
.navbar-welcome b {
  color: #1fa2ff;
  font-weight: 600;
}
.navbar-menu {
  display: flex;
  gap: 9px;
}
.btn.btn-navbar {
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(90deg,#43e97b 0,#38f9d7 100%);
  color: #225;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 5px rgba(90,120,160,0.06);
  margin-right: 4px;
}
.btn.btn-navbar:hover {
  filter: brightness(0.97);
  background: linear-gradient(90deg,#1fa2ff 0,#12d8fa 100%);
  color: #fff;
}
.btn.btn-navbar.btn-logout {
  background: linear-gradient(90deg,#f85032 0,#e73827 100%);
  color: #fff;
  margin-left: 18px;
}
.btn.btn-navbar.btn-logout:hover {
  filter: brightness(0.96);
  background: linear-gradient(90deg,#fd746c 0,#ff9068 100%);
  color: #fff;
}
</style>
