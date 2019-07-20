import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import { eventTypes } from './constants'
import mutations from './mutations'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

const completedDate = task => task.log.filter(event => event.type === eventTypes.Completed)[0].time

export default new Vuex.Store({
  
  state: {
    tasks: [],
    tags: {},
    selectedTask: null
  },
  
  getters: {
    incompleteTasks (state) {
      const incompleteTasks = state.tasks.filter(t => !t.completed)
      return state.incompleteOrder === 'Newest' ? incompleteTasks.reverse() : incompleteTasks
    },
    
    completedTasks (state) {
      const completedTasks = state.tasks.filter(t => t.completed).sort((a, b) => completedDate(a) - completedDate(b))
      return state.completedOrder === 'Recent' ? completedTasks.reverse() : completedTasks
    },
    
    availableTags: state => (id, snip) => Object.keys(state.tags).filter(tag =>
      tag.startsWith(snip) && !state.tags[tag].includes(id)),
    
    tagActivity: state => tag => [...state.tags[tag]].map(taskID => {
      const task = state.tasks.find(t => t.id === taskID)
      return task.log.map(event => Object.assign({ task: task.name }, event))
    }).flat().sort((a, b) => a.time - b.time)
  },
  
  mutations,
  
  plugins: [vuexLocalStorage.plugin]
  
})

export { mutations }
