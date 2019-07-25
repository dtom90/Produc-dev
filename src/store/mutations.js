import { eventTypes, eventCodes } from './constants'

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
  
  addTask (state, payload) {
    const newTask = {
      id: state.tasks.length,
      name: payload.name,
      tags: [],
      completed: false,
      log: [event(eventTypes.Created)]
    }
    state.tasks.push(newTask)
    state.selectedTaskID = newTask.id
  },
  
  selectTask (state, id) {
    state.selectedTaskID = id
  },
  
  addTaskEvent (state, payload) {
    if (payload.type in eventCodes) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        task.log.push(event(payload.type))
      }
    }
  },
  
  addTaskTag (state, payload) {
    const newTag = payload.tag.trim()
    if (newTag) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        if (!(newTag in state.tags)) {
          state.tags[newTag] = [task.id]
        } else {
          addElem(state.tags[newTag], task.id)
        }
        addElem(task.tags, newTag)
      }
    }
  },
  
  removeTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    deleteElem(task.tags, payload.tag)
    deleteElem(state.tags[payload.tag], payload.id)
  },
  
  completeTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (!task.completed) {
      if (task.log[task.log.length - 1].type === eventTypes.Started) {
        task.log.push(event(eventTypes.Stopped))
      }
      task.log.push(event(eventTypes.Completed))
      task.completed = true
    } else {
      task.log.pop()
      task.completed = false
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
