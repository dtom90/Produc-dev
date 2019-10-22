import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import getters from './getters'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

export default new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [vuexLocalStorage.plugin]
})

export { state, mutations }
