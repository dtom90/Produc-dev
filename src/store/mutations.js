import getters from './getters'
import moment from 'moment'
import Vue from 'vue'

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
        created: Date.now(),
        log: [],
        completed: null
      }
      if (payload.topInsert) {
        state.tasks.unshift(newTask)
      } else {
        state.tasks.push(newTask)
      }
      state.nextTaskID += 1
      if (state.selectedTag !== null) {
        Vue.set(state.tags, state.selectedTag, [newTask.id])
      }
      state.selectedTaskID = newTask.id
    }
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
          Vue.set(state.tags, newTag, [task.id])
        } else {
          addElem(state.tags[newTag], task.id)
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
    deleteElem(state.tags[payload.tag], payload.id)
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
      task.tags.forEach(tag => deleteElem(state.tags[tag], payload.id))
      state.tasks.splice(index, 1)
    }
  },
  
  clearTasks (state) {
    const completedTasks = state.tasks.filter(t => t.completed)
    if (completedTasks.length === 1 || confirm(`Are you sure that you want to delete all ${completedTasks.length} completed tasks?`)) {
      state.tasks.filter(t => t.completed).forEach(task => task.tags.forEach(tag => deleteElem(state.tags[tag], task.id)))
      state.tasks = state.tasks.filter(t => !t.completed)
    }
  }
}

export default mutations
