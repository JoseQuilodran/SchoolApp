import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
})],
  state: {
    texto:false,
    collapsed:false,
    authentified:false,
    user:'',
    idAsignatura:'',
    esquemaNotas:'',
    cursoPac:'',
    fecha:'',
  },
  mutations: {
    toggleCollapsed(state){
      state.collapsed = !state.collapsed
    },
    setAuth(state,Boolean){
      state.authentified = Boolean
    },
    
    setUser(state, payload) {
      state.user = payload.user
    },
    setIdAsignatura(state, payload) {
      state.idAsignatura = payload.idAsignatura
    },
    setEsquemaNotas(state, payload) {
      state.esquemaNotas = payload.esquemaNotas
    },
    setCursoPac(state, payload) {
      state.cursoPac = payload.cursoPac
    },
    setFecha(state, payload) {
      state.fecha = payload.fecha
    },
    clearAll(state) {
      state.texto = false;
      state.collapsed = false;
      state.authentified = false;
      state.user = '';
      state.idAsignatura = '';
      state.esquemaNotas = '';
      state.cursoPac = '';
      state.fecha = '';
    },
  },
  actions: {
    setUser({ commit },payload) {
      commit('setUser',payload)
    },
    setAuth({ commit },Bolean) {
      commit('setAuth',Bolean)
    },
    setIdAsignatura({ commit },payload) {
      commit('setIdAsignatura',payload)
    },
    setEsquemaNotas({ commit },payload) {
      commit('setEsquemaNotas',payload)
    },
    setCursoPac({ commit },payload) {
      commit('setCursoPac',payload)
    },
    setFecha({ commit },payload) {
      commit('setFecha',payload)
    },
    clearAll({ commit }) {
      commit('clearAll')
    },
  },
  getters:{
    getSidebarWidth(state){
      return state.collapsed ? '38px' : '180px'
    }
  },
  modules: {
  }
})
