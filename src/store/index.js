import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import getters from './getters'
import mutations from './mutations'
import initialState from './initialState'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: initialState,
  getters,
  mutations,
  plugins: [vuexLocalStorage.plugin]
})

export { initialState, mutations }
