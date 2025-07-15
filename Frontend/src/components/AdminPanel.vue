<template>
  <div class="admin-panel">
    <Navbar />
    <CrudUsuarios />
    <CrudEmpresas />
    <CrudCamaras />
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import CrudUsuarios from './Admin/CrudUsuarios.vue'
import CrudEmpresas from './Admin/CrudEmpresas.vue'
import CrudCamaras from './Admin/CrudCamaras.vue'

export default {
  name: 'AdminPanelView',
  components: {
    Navbar,
    CrudUsuarios,
    CrudEmpresas,
    CrudCamaras
  }
}
</script>

<style scoped>
.admin-panel {
  padding: 1rem;
}

.admin-panel section {
  margin-bottom: 2rem;
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
</style>
