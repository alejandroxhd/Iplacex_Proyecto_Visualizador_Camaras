import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import AdminPanel from '../components/AdminPanel.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiereAuth: true }
  },
  {
    path: '/admin',
    component: AdminPanel,
    meta: { requiereAuth: true, soloAdmin: true }
  },
  {
    path: '/logs',
    component: () => import('@/components/VistaLogs.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/soporte',
    component: () => import('@/components/VistaSoporte.vue'),
    meta: { requiereAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = store.state.usuario

  if (to.meta.requiereAuth && !usuario) {
    return next('/')
  }

  if (to.meta.soloAdmin && usuario?.rol !== 1) {
    alert('Acceso denegado: solo administradores')
    return next('/dashboard')
  }

  next()
})

export default router
