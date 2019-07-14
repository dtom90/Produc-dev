import { eventTypes } from './constants'

const event = type => ({ type, time: Date.now() })

const addElem = (arr, elem) => {
  if (!(arr.includes(elem))) {
    arr.push(elem)
  }
}

const deleteElem = (arr, elem) => {
  arr.splice(arr.indexOf(elem), 1)
}

const mutations = {
  
  addTask (state, newTaskName) {
    const newTask = {
      id: state.tasks.length,
      name: newTaskName,
      tags: [],
      completed: false,
      activity: [event(eventTypes.Created)]
    }
    state.tasks.push(newTask)
    state.selectedTask = newTask
  },
  
  selectTask (state, id) {
    state.selectedTask = state.tasks.find(t => t.id === id)
  },
  
  addTaskEvent (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    task.activity.push(event(payload.type))
  },
  
  addTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (!(payload.tag in state.tags)) {
      state.tags[payload.tag] = [task.id]
    } else {
      addElem(state.tags[payload.tag], task.id)
    }
    addElem(task.tags, payload.tag)
  },
  
  removeTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    deleteElem(task.tags, payload.tag)
    deleteElem(state.tags[payload.tag], payload.id)
  },
  
  completeTask (state, id) {
    const task = state.tasks.find(t => t.id === id)
    if (task.completed) {
      task.activity.push(event(eventTypes.Completed))
    } else {
      task.activity.pop()
    }
  },
  
  deleteTask (state, id) {
    const index = state.tasks.findIndex(t => t.id === id)
    const task = state.tasks[index]
    if (task.completed || confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`)) {
      state.tasks.splice(index, 1)
    }
  },
  
  clearTasks (state) {
    const completedTasks = state.tasks.filter(t => t.completed)
    if (completedTasks.length === 1 || confirm(`Are you sure that you want to delete all ${completedTasks.length} completed tasks?`)) {
      state.tasks = state.tasks.filter(t => !t.completed)
    }
  }
}

export default mutations
