const getters = {
  selectedTask (state) {
    return state.tasks.find(t => t.id === state.selectedTaskID)
  },
  
  incompleteTasks (state) {
    const incompleteTasks = state.tasks.filter(t => !t.completed)
    return state.incompleteOrder === 'Newest' ? incompleteTasks.reverse() : incompleteTasks
  },
  
  completedTasks (state) {
    const completedTasks = state.tasks.filter(t => t.completed).sort((a, b) => a.completed - b.completed)
    return state.completedOrder === 'Recent' ? completedTasks.reverse() : completedTasks
  },
  
  availableTags: state => (id, snip) => Object.keys(state.tags).filter(tag =>
    tag.startsWith(snip) && !state.tags[tag].includes(id)),
  
  tagActivity: state => tag => [...state.tags[tag]].map(taskID => {
    const task = state.tasks.find(t => t.id === taskID)
    return task.log.map(event => Object.assign({ task: task.name }, event))
  }).flat().sort((a, b) => a.time - b.time)
}

export default getters
