import dexieDb from './dexieDb'
import { nanoid } from 'nanoid'
import ColorManager from 'color-manager'

const actions = {
  async loadInitialData ({ commit }) {
    const tasks = await dexieDb.tasks.orderBy('order').toArray()
    const tags = await dexieDb.tags.toArray()
    const taskTagMaps = await dexieDb.taskTagMap.toArray()
    const logs = await dexieDb.logs.toArray()
    const settings = await dexieDb.settings.toArray()
    commit('setState', { tasks, tags, taskTagMaps, logs, settings })
  },

  async addTask ({ state, commit }, { name }) {
    const taskName = name.trim()
    if (taskName) {
      const count = await dexieDb.tasks.count()
      const newTask = {
        id: 'task-' + nanoid(),
        name: taskName,
        tags: state.addSelectedTags && state.selectedTags.length > 0 ? [...state.selectedTags] : [],
        notes: '',
        order: count,
        log: [],
        created_at: Date.now(),
        completed: null,
        archived: null
      }
      // add to dexie
      await dexieDb.tasks.add(newTask)
      await dexieDb.settings.put({ key: 'selectedTaskID', value: newTask.id })
      commit('addTask', { task: newTask })
    }
  },
  
  async selectTask ({ state, commit }, { taskId }) {
    await dexieDb.settings.put({ key: 'selectedTaskID', value: taskId })
    commit('selectTask', { taskId })
  },
  
  async reorderIncompleteTasks ({ state, commit }, { newTaskOrder }) {
    const incompleteTasks = state.tasks.filter(t => !t.completed)
    const completedTasks = state.tasks.filter(t => t.completed)
    const origLength = incompleteTasks.length
    if (newTaskOrder.length === origLength) {
      const fullTaskOrder = newTaskOrder.concat(completedTasks)
      for (const [i, task] of fullTaskOrder.entries()) {
        task.order = i
      }
      await dexieDb.tasks.bulkPut(fullTaskOrder)
      commit('setTasks', { tasks: newTaskOrder })
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
        const fullTaskOrder = incompleteTasks.concat(completedTasks)
        for (const [i, task] of fullTaskOrder.entries()) {
          task.order = i
        }
        await dexieDb.tasks.bulkPut(fullTaskOrder)
        commit('setTasks', { tasks: fullTaskOrder })
      }
    }
  },
  
  async startTask ({ state, commit, dispatch }, { taskId }) {
    // stop any running task
    await dispatch('stopTask')

    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      const log = {
        id: 'log-' + nanoid(),
        taskId,
        started: Date.now(),
        stopped: null,
        timeSpent: null
      }
      await dexieDb.logs.add(log)
      commit('startTask', { log })
    }
  },
  
  async updateTaskTimer ({ state, commit }, { taskId }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task && task.log.length > 0) {
      const runningLog = await dexieDb.logs.where('taskId').equals(taskId).and(log => log.stopped == null).first()
      if (runningLog) {
        runningLog.timeSpent = Date.now() - runningLog.started
        await dexieDb.logs.put(runningLog)
        commit('updateLog', { log: runningLog })
      }
    }
  },
  
  async stopTask ({ commit }) {
    const runningLog = await dexieDb.logs.filter(log => log.stopped === null).first()
    if (runningLog) {
      runningLog.stopped = Date.now()
      runningLog.timeSpent = runningLog.stopped - runningLog.started
      await dexieDb.logs.put(runningLog)
      commit('updateLog', { log: runningLog })
    }
  },
  
  async completeTask ({ state, commit, dispatch }, { taskId }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      let completedValue = null
      if (!task.completed) {
        if (task.id === state.activeTaskID && state.running) {
          await dispatch('stopTask')
        }
        completedValue = Date.now()
      }
      const taskUpdates = { completed: completedValue }
      await dexieDb.tasks.update(taskId, taskUpdates)
      commit('updateTask', { taskId, taskUpdates })
    }
  },
  
  async archiveTask ({ state, commit }, { taskId }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      const taskUpdates = { archived: !task.archived }
      await dexieDb.tasks.update(taskId, taskUpdates)
      commit('updateTask', { taskId, taskUpdates })
    }
  },
  
  async archiveTasks ({ state, commit }) {
    const completedTasks = state.tasks.filter(t => t.completed && !t.archived)
    if (completedTasks.length === 0) {
      alert('No completed tasks to archive')
      return
    }
    if (completedTasks.length === 1 || confirm(`Are you sure that you want to archive all ${completedTasks.length} completed tasks?`)) {
      const taskIds = completedTasks.map(task => task.id)
      await dexieDb.tasks.where('id').anyOf(taskIds).modify({ archived: true })

      const tasksToUpdate = await dexieDb.tasks.where('id').anyOf(taskIds).toArray()
      commit('updateTasks', { tasksToUpdate })
    }
  },
  
  async addInterval ({ state, commit }, { taskId, stopped, timeSpent }) {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      const log = {
        id: 'log-' + nanoid(),
        taskId,
        started: stopped - timeSpent,
        stopped: stopped,
        timeSpent: timeSpent
      }
      await dexieDb.logs.add(log)
      commit('startTask', { log })
    }
  },
  
  async deleteInterval ({ state, commit }, { logId }) {
    const log = await dexieDb.logs.get(logId)
    await dexieDb.logs.delete(logId)
    commit('deleteInterval', { logId, taskId: log.taskId })
  },
  
  async addTaskTag ({ state, commit }, { taskId, tagName }) {
    const newTagName = tagName.trim()
    if (newTagName) {
      const task = state.tasks.find(t => t.id === taskId)
      if (task) {
        let tag = await dexieDb.tags.where('tagName').equals(tagName).first()
        if (!tag) {
          const colors = Object.values(state.tags).map(tag => tag.color)
          const colorManager = new ColorManager(colors)
          tag = {
            tagName: newTagName,
            color: colorManager.getRandomColor()
          }
          await dexieDb.tags.add(tag)
        }
        await dexieDb.taskTagMap.add({
          id: 'taskTag-' + nanoid(),
          taskId,
          tagName
        })
        commit('addTaskTag', { taskId, ...tag })
      }
    }
  },
  
  async removeTaskTag ({ state, commit }, { taskId, tagName }) {
    await dexieDb.taskTagMap
      .where('taskId').equals(taskId)
      .and(tag => tag.tagName === tagName)
      .delete()
    
    const newTags = await dexieDb.taskTagMap.where('taskId').equals(taskId).toArray()
    const newTagNames = newTags.map(tag => tag.tagName)
    commit('updateTaskTags', { taskId, newTagNames })
  }
  
}

export default actions
