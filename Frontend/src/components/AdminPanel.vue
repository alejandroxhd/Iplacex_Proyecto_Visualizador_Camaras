<template>
  <div class="admin-panel">
    <CrudUsuarios />
    <CrudEmpresas />
    <CrudCamaras />
  </div>
</template>

<script>
/* import Navbar from './Navbar.vue' */
import CrudUsuarios from './Admin/CrudUsuarios.vue'
import CrudEmpresas from './Admin/CrudEmpresas.vue'
import CrudCamaras from './Admin/CrudCamaras.vue'

export default {
  name: 'AdminPanelView',
  components: {
    CrudUsuarios,
    CrudEmpresas,
    CrudCamaras
  }
}
</script>

<style scoped>
.admin-panel {
  padding: 2rem 2vw;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  min-height: 100vh;
}
.admin-panel section {
  margin-bottom: 2rem;
  padding: 1.2rem 1rem;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e3e7f0;
  box-shadow: 0 2px 10px rgba(140, 160, 200, 0.07);
}

/* Tablas responsivas */
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px #eae9f2;
}
th,
td {
  border: 1px solid #eee;
  padding: 10px 7px;
  text-align: left;
  font-size: 1rem;
}
th {
  background: #f5f7fa;
  color: #4e5d78;
  font-weight: 700;
  border-bottom: 1.5px solid #eaeaea;
}

/* Mobile: Tablas en bloque con scroll horizontal */
@media (max-width: 900px) {
  .admin-panel {
    padding: 1rem 0.5rem;
  }
  .admin-panel section {
    padding: 0.7rem 0.3rem;
  }
  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    font-size: 0.97rem;
  }
  th,
  td {
    min-width: 110px;
    padding: 9px 5px;
    font-size: 0.97rem;
  }
}

/* Muy móvil */
@media (max-width: 540px) {
  .admin-panel {
    padding: 0.3rem 0;
  }
  .admin-panel section {
    margin-bottom: 1rem;
    padding: 0.45rem 0.1rem;
    border-radius: 7px;
  }
  th,
  td {
    min-width: 90px;
    padding: 7px 3px;
    font-size: 0.93rem;
  }
}
</style>
