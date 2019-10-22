import getters from './getters'
import moment from 'moment'
import Vue from 'vue'
import colorManager from 'color-manager'

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
    const taskName = payload.name.trim()
    if (taskName) {
      const newTask = {
        id: state.nextTaskID,
        name: taskName,
        tags: state.selectedTag !== null ? [state.selectedTag] : [],
        notes: '',
        created: Date.now(),
        log: [],
        completed: null
      }
      if (state.insertAtTop) {
        state.tasks.unshift(newTask)
      } else {
        state.tasks.push(newTask)
      }
      state.nextTaskID += 1
      state.selectedTaskID = newTask.id
    }
  },
  
  setTopInsert (state, payload) {
    state.insertAtTop = payload
  },
  
  updateIncompleteTasks (state, payload) {
    state.tasks = payload.concat(getters.completedTasks(state))
  },
  
  selectTask (state, id) {
    state.selectedTaskID = id
  },
  
  startTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task) {
      task.log.push({
        started: Date.now(),
        stopped: null,
        timeSpent: null
      })
      state.activeTaskID = task.id
      state.running = true
    }
  },
  
  stopTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task && task.log.length > 0) {
      const lastInterval = task.log[task.log.length - 1]
      if (lastInterval.stopped === null) {
        lastInterval.stopped = Date.now()
        lastInterval.timeSpent = lastInterval.stopped - lastInterval.started
      }
    }
    state.running = false
  },
  
  endTask (state) {
    state.activeTaskID = null
  },
  
  addInterval (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task) {
      const interval = {
        started: null,
        stopped: moment.now(),
        timeSpent: payload.timeSpent
      }
      interval.started = moment(interval.stopped) - moment.duration(interval.timeSpent, 'ms')
      task.log.push(interval)
    }
  },
  
  addTaskTag (state, payload) {
    const newTag = payload.tag.trim()
    if (newTag) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        if (!(newTag in state.tags)) {
          Vue.set(state.tags, newTag, colorManager.getRandomColor())
        }
        addElem(task.tags, newTag)
      }
    }
  },
  
  selectTag (state, payload) {
    state.selectedTag = payload.tag
  },
  
  removeTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    deleteElem(task.tags, payload.tag)
  },
  
  completeTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (!task.completed) {
      task.completed = Date.now()
    } else {
      task.completed = null
    }
  },
  
  deleteTask (state, payload) {
    const index = state.tasks.findIndex(t => t.id === payload.id)
    const task = state.tasks[index]
    if (task.completed || confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`)) {
      state.tasks.splice(index, 1)
      if (state.activeTaskID === payload.id) { // If we are deleting the active task, clear activeTaskID
        state.activeTaskID = null
        state.running = false
      } else if (state.selectedTaskID === task.id && state.activeTaskID) { // If another task is active while we delete this, switch to it
        state.selectedTaskID = state.activeTaskID
      }
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
