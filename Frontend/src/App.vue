<template>
  <div id="app">
    <!-- Navbar solo si NO estás en / (login) -->
    <Navbar v-if="!esLogin" />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: { Navbar },
  setup() {
    const route = useRoute()
    // Ajusta el path si tu login está en otro lugar
    const esLogin = computed(() => route.path === '/')
    return { esLogin }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
