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
  
  updateIncompleteTasks (state, { newTaskOrder }) {
    const incompleteTasks = getters.incompleteTasks(state)
    const origLength = incompleteTasks.length
    if (newTaskOrder.length === origLength) {
      state.tasks = newTaskOrder.concat(getters.completedTasks(state))
    } else {
      const reorderTaskIds = {}
      newTaskOrder.forEach(task => {
        reorderTaskIds[task.id] = true
      })
      let r = 0
      for (let i = 0; i < incompleteTasks.length; i++) {
        if (incompleteTasks[i].id in reorderTaskIds) {
          incompleteTasks[i] = newTaskOrder[r]
          r++
        }
      }
      if (incompleteTasks.length === origLength) { // ensure that the length has not changed
        state.tasks = incompleteTasks.concat(getters.completedTasks(state))
      }
    }
  },
  
  selectTask (state, id) {
    state.selectedTaskID = id
  },
  
  updateActiveMinutes (state, { activeMinutes }) {
    state.activeMinutes = activeMinutes
  },
  
  updateSecondReminderEnabled (state, { value }) {
    state.secondReminderEnabled = value
  },
  
  updateSecondReminderMinutes (state, { value }) {
    state.secondReminderMinutes = value
  },
  
  updateRestMinutes (state, { restMinutes }) {
    state.restMinutes = restMinutes
  },
  
  updateContinueOnComplete (state, newValue) {
    state.continueOnComplete = newValue
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
      lastInterval.stopped = Date.now()
      lastInterval.timeSpent = lastInterval.stopped - lastInterval.started
      if ('running' in payload) {
        lastInterval.running = payload.running
      } else {
        if ('running' in lastInterval) {
          Vue.delete(lastInterval, 'running')
        }
        state.running = false
      }
    }
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
  
  deleteInterval (state, { taskId, startedTime }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      const intervalIndex = task.log.findIndex(interval => interval.started === startedTime)
      task.log.splice(intervalIndex, 1)
    }
  },
  
  resetRunning (state) {
    if (state.activeTaskID) {
      const activeTask = state.tasks.find(t => t.id === state.activeTaskID)
      if (activeTask && activeTask.log.length > 0) {
        const lastInterval = activeTask.log[activeTask.log.length - 1]
        if ('running' in lastInterval) {
          Vue.delete(lastInterval, 'running')
        }
      }
    }
    state.running = false
  },
  
  addTaskTag (state, payload) {
    const newTag = payload.tag.trim()
    if (newTag) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        if (!(newTag in state.tags)) {
          const colors = Object.values(state.tags).map(tag => tag.color)
          const colorManager = new ColorManager(colors)
          Vue.set(state.tags, newTag, { color: colorManager.getRandomColor() })
          state.tagOrder.push(newTag)
        }
        if (!(task.tags.includes(newTag))) {
          task.tags.push(newTag)
        }
      }
    }
  },
  
  ensureTagOrder (state) {
    if (state.tagOrder.length === 0) {
      state.tagOrder = Object.keys(state.tags)
    }
  },
  
  updateTagOrder (state, { newOrder }) {
    state.tagOrder = newOrder
  },
  
  setTagColor (state, payload) {
    Vue.set(state.tags[payload.tag], 'color', payload.color)
  },
  
  upgradeTagColor (state) {
    if (typeof Object.values(state.tags)[0] === 'string') {
      Object.keys(state.tags).map(tag => {
        state.tags[tag] = { color: state.tags[tag] }
      })
    }
  },
  
  setTarget (state, payload) {
    const targetElement = 'tag' in payload ? state.tags[payload.tag] : state.totalTarget
    const targetType = Object.keys(payload).filter(key => key.includes('Target'))
    Vue.set(targetElement, targetType, payload[targetType])
  },
  
  setModalTag (state, { newTag }) {
    state.modalTag = newTag
  },
  
  selectTag (state, payload) {
    state.selectedTags.push(payload.tag)
  },
  
  setFilterOperator (state, newFilterOperatorValue) {
    if (['and', 'or'].includes(newFilterOperatorValue)) {
      state.filterOperator = newFilterOperatorValue
    }
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
        Vue.set(state.tagOrder, state.tagOrder.indexOf(payload.oldName), payload.newName)
        if (state.modalTag === payload.oldName) {
          state.modalTag = payload.newName
        }
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
      state.tagOrder = state.tagOrder.filter(tag => tag !== payload.tag)
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
  },
  
  overwriteState (state, newState) {
    const r = confirm('WARNING: Loading state from this file will COMPLETELY OVERWRITE your current data with the data provided in this file. Are you ABSOLUTELY sure that you want to do this?')
    if (r === true) {
      Object.keys(state).forEach(key => {
        state[key] = newState[key]
      })
    }
  },
  
  setNotificationsEnabled (state, newValue) {
    state.notificationsEnabled = newValue
  },
  
  setTimeFormat (state, timeFormat24) {
    state.timeFormat24 = timeFormat24
  }
}

export default mutations
