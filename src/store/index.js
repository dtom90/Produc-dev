import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// // Load state with fixtures
// import { taskWithActivity } from '../fixtures'
// state.tasks.push(taskWithActivity())

// // Load state from sample file
// import sample1 from '../fixtures/sample1'
// const state = sample1

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
