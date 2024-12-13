import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import config from './config'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

export default new Vuex.Store(Object.assign({
  plugins: [vuexLocalStorage.plugin]
}, config))

const initialState = config.state
const mutations = config.mutations
const actions = config.actions

export { initialState, mutations, actions }
