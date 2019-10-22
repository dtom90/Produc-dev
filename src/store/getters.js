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
  
  allTags: state => Object.keys(state.tags),
  
  availableTags: state => (id, snip) => Object.keys(state.tags).filter(tag =>
    tag.startsWith(snip) && !state.tasks[id].tags.includes(tag)),
  
  tagActivity: state => tag => state.tasks.filter(task => task.tags.includes(tag))
    .map(task => task.log.map(event => Object.assign({ task: task.name }, event)))
    .flat().sort((a, b) => a.started - b.started)
}

export default getters
