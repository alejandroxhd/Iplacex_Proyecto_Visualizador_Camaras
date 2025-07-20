import { createStore } from 'vuex'

export default createStore({
  state: {
    usuario: null,
    token: null
  },
  mutations: {
    setUsuario(state, payload) {
      state.usuario = payload.usuario
      state.token = payload.token
    },
    logout(state) {
      state.usuario = null
      state.token = null
      // Limpia también el localStorage
      localStorage.removeItem('usuario')
      localStorage.removeItem('token')
    }
  },
  actions: {
    inicializarStore({ commit }) {
      const token = localStorage.getItem('token')
      const usuario = localStorage.getItem('usuario')
      if (token && usuario) {
        commit('setUsuario', {
          usuario: JSON.parse(usuario),
          token
        })
      }
    }
  }
})
