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
    }
  }
})
