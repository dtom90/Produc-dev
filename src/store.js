const eventMapping = {
  Created: 0,
  Started: 1,
  Stopped: 2,
  Completed: 3
}

export default {
  
  tasks: [],
  selectedTask: null,
  
  eventTypes: eventMapping,
  eventNames: Object.keys(eventMapping),
  
  incompleteTasks () {
    return this.tasks.filter(t => !t.completed)
  },
  
  completedTasks () {
    return this.tasks.filter(t => t.completed).sort((a, b) => a.completedDate - b.completedDate)
  },
  
  addTask (newTaskName) {
    const newTask = {
      id: this.tasks.length,
      name: newTaskName,
      completed: false,
      createdDate: new Date(),
      activity: [],
      completedDate: null
    }
    this.tasks.push(newTask)
    return newTask.id
  },
  
  selectTask (id) {
    this.selectedTask = this.tasks.find(t => t.id === id)
  },
  
  addTaskEvent (id, type, time) {
    const task = this.tasks.find(t => t.id === id)
    task.activity.push({
      type,
      time
    })
  },
  
  completeTask (id) {
    const task = this.tasks.find(t => t.id === id)
    if (task.completed) { task.completedDate = Date.now() } else { task.completedDate = null }
  },
  
  deleteTask (id) {
    const index = this.tasks.findIndex(t => t.id === id)
    const task = this.tasks[index]
    if (task.completed || confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`)) {
      this.tasks.splice(index, 1)
    }
  },
  
  clearTasks () {
    const completedTasks = this.tasks.filter(t => t.completed)
    if (completedTasks.length === 1 || confirm(`Are you sure that you want to delete all ${completedTasks.length} completed tasks?`)) {
      this.tasks = this.tasks.filter(t => !t.completed)
    }
  }
  
}
