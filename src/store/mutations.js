import Vue from 'vue'
import $ from 'jquery'

const mutations = {
  
  setState (state, { tasks, tags, taskTagMaps, logs, settings }) {
    state.tasks = tasks
    state.tags = {}
    state.tagOrder = []
    for (const tag of tags) {
      Vue.set(state.tags, tag.tagName, { color: tag.color })
      state.tagOrder.push(tag.tagName)
    }
    for (const taskTagMap of taskTagMaps) {
      const task = state.tasks.find(t => t.id === taskTagMap.taskId)
      if (task) {
        task.tags.push(taskTagMap.tagName)
      }
    }
    for (const log of logs) {
      const task = state.tasks.find(t => t.id === log.taskId)
      if (task) {
        const logsForTask = logs.filter(l => l.taskId === log.taskId)
        logsForTask.sort((a, b) => a.started - b.started)
        task.log = logsForTask
      }
    }
    for (const key of ['selectedTaskID']) {
      const setting = settings.find(s => s.key === key)
      state[key] = setting ? setting.value : null
    }
  },
  
  setTasks (state, { tasks }) {
    state.tasks = tasks
  },
  
  addTask (state, { task }) {
    task.log = []
    if (state.insertAtTop) {
      state.tasks.unshift(task)
    } else {
      state.tasks.push(task)
    }
    state.selectedTaskID = task.id
  },
  
  updateTask (state, { taskId, taskUpdates }) {
    const index = state.tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      Vue.set(state.tasks, index, { ...state.tasks[index], ...taskUpdates })
    }
  },
  
  updateTasks (state, { tasksToUpdate }) {
    tasksToUpdate.forEach(taskUpdate => {
      const index = state.tasks.findIndex(t => t.id === taskUpdate.id)
      if (index !== -1) {
        Vue.set(state.tasks, index, { ...state.tasks[index], ...taskUpdate })
      }
    })
  },
  
  setTopInsert (state, payload) {
    state.insertAtTop = payload
  },
  
  updateAddSelectedTags (state, newValue) {
    state.addSelectedTags = newValue
  },
  
  updateShowArchived (state, newValue) {
    state.showArchived = newValue
  },
  
  selectTask (state, { taskId }) {
    state.selectedTaskID = taskId
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
  
  startTask (state, { log }) {
    const task = state.tasks.find(t => t.id === log.taskId)
    if (task) {
      task.log.push(log)
      state.activeTaskID = task.id
      state.running = true
    }
  },
  
  updateLog (state, { log }) {
    const task = state.tasks.find(t => t.id === log.taskId)
    if (task) {
      const i = task.log.findIndex(l => l.id === log.id)
      if (i !== -1) {
        Vue.set(task.log, i, log)
        state.running = log.stopped === null
      }
    }
  },
  
  setTaskInactive (state) {
    state.activeTaskID = null
  },
  
  deleteInterval (state, { logId, taskId }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      const logIndex = task.log.findIndex(log => log.id === logId)
      task.log.splice(logIndex, 1)
    }
  },
  
  setRunning (state, value) {
    state.running = value
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
  
  addTaskTag (state, { taskId, tagName, color }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (tagName && color) {
      Vue.set(state.tags, tagName, { color })
      state.tagOrder.push(tagName)
    }
    if (!(task.tags.includes(tagName))) {
      task.tags.push(tagName)
    }
  },
  
  updateTaskTags (state, { taskId, newTagNames }) {
    const task = state.tasks.find(t => t.id === taskId)
    task.tags = newTagNames
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
      Object.keys(state.tags).map(tagName => {
        state.tags[tagName] = { color: state.tags[tagName] }
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
  
  removeTag (state, { tagName }) {
    state.selectedTags = state.selectedTags.filter(tag => tag !== tagName)
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
  
  deleteTasks (state) {
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
  
  setGlobalNotificationsEnabled (state, newValue) {
    state.globalNotificationsEnabled = newValue
  },
  
  setTimeFormat (state, timeFormat24) {
    state.timeFormat24 = timeFormat24
  }
}

export default mutations
