import getters from './getters'
import Vue from 'vue'
import ColorManager from 'color-manager'
import $ from 'jquery'

const mutations = {
  
  addTask (state, payload) {
    const taskName = payload.name.trim()
    if (taskName) {
      const newTask = {
        id: state.nextTaskID,
        name: taskName,
        tags: state.addSelectedTags && state.selectedTags.length > 0 ? [...state.selectedTags] : [],
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
  
  updateAddSelectedTags (state, newValue) {
    state.addSelectedTags = newValue
  },
  
  updateContinueOnComplete (state, newValue) {
    state.continueOnComplete = newValue
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
  
  setTaskInactive (state) {
    state.activeTaskID = null
  },
  
  addInterval (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task) {
      const interval = {
        started: null,
        stopped: Date.now(),
        timeSpent: payload.timeSpent
      }
      interval.started = interval.stopped - interval.timeSpent
      task.log.push(interval)
    }
  },
  
  addTaskTag (state, payload) {
    const newTag = payload.tag.trim()
    if (newTag) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        if (!(newTag in state.tags)) {
          const colorManager = new ColorManager(Object.values(state.tags))
          Vue.set(state.tags, newTag, colorManager.getRandomColor())
        }
        if (!(task.tags.includes(newTag))) {
          task.tags.push(newTag)
        }
      }
    }
  },
  
  setTagColor (state, payload) {
    Vue.set(state.tags, payload.tag, payload.color)
  },
  
  selectTag (state, payload) {
    state.selectedTags.push(payload.tag)
  },
  
  removeTag (state, payload) {
    state.selectedTags = state.selectedTags.filter(tag => tag !== payload.tag)
  },
  
  removeTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    task.tags.splice(task.tags.indexOf(payload.tag), 1)
  },
  
  completeTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (!task.completed) {
      task.completed = Date.now()
      if (task.id === state.activeTaskID && state.running) {
        state.running = false
      }
    } else {
      task.completed = null
    }
  },
  
  renameTag (state, payload) {
    if (payload.newName !== payload.oldName) {
      if (payload.newName in state.tags) {
        alert('Error: the new tag name you entered already exists. Please rename it to something else.')
      } else {
        state.tasks.forEach(task => {
          task.tags = task.tags.map(tag => tag === payload.oldName ? payload.newName : tag)
        })
        state.tags[payload.newName] = state.tags[payload.oldName]
        const idx = state.selectedTags.indexOf(payload.oldName)
        if (idx >= 0) {
          state.selectedTags[idx] = payload.newName
        }
        Vue.delete(state.tags, payload.oldName)
        $('#activityModal').modal('hide')
      }
    }
  },
  
  deleteTag (state, payload) {
    if (confirm(`Are you sure you want to delete the tag "${payload.tag}"? All tasks with this tag will lose the tag.`)) {
      state.tasks.forEach(task => {
        task.tags = task.tags.filter(tag => tag !== payload.tag)
      })
      state.selectedTags = state.selectedTags.filter(tag => tag !== payload.tag)
      Vue.delete(state.tags, payload.tag)
      $('#activityModal').modal('hide')
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
