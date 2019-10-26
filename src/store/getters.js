const getters = {
  selectedTask (state) {
    return state.tasks.find(t => t.id === state.selectedTaskID)
  },
  
  incompleteTasks: state => state.tasks.filter(t => !t.completed),
  
  completedTasks (state) {
    const completedTasks = state.tasks.filter(t => t.completed).sort((a, b) => a.completed - b.completed)
    return state.completedOrder === 'Recent' ? completedTasks.reverse() : completedTasks
  },
  
  unselectedTags: state => Object.keys(state.tags).filter(tag => !state.selectedTags.includes(tag)),
  
  availableTags: state => (id, snip) => Object.keys(state.tags).filter(tag =>
    tag.startsWith(snip) && !state.tasks.find(t => t.id === id).tags.includes(tag)),
  
  tagActivity: state => tag => state.tasks.filter(task => task.tags.includes(tag))
    .map(task => {
      const logEvents = task.log.map(event => Object.assign({ task: task.name }, event))
      if (task.completed) {
        logEvents.unshift({ task: task.name, completed: task.completed })
      }
      return logEvents
    }).flat().sort((a, b) => ('started' in a ? a.started : a.completed) - ('started' in b ? b.started : b.completed))
}

export default getters
