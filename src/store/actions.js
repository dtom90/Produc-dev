import dexieDb from './dexieDb'
import { nanoid } from 'nanoid'
import ColorManager from 'color-manager'

const actions = {
  async loadInitialData ({ commit }) {
    const tasks = await dexieDb.tasks.orderBy('order').toArray()
    const tags = await dexieDb.tags.orderBy('order').toArray()
    const taskTagMaps = await dexieDb.taskTagMap.toArray()
    const settings = await dexieDb.settings.toArray()
    const logs = await dexieDb.logs.toArray()
    // If any logs were running but not stopped, stop them.
    for (const log of logs) {
      if (!log.stopped) {
        log.stopped = log.started + log.timeSpent
        await dexieDb.logs.put(log)
      }
    }
    commit('setState', { tasks, tags, taskTagMaps, logs, settings })
  },

  async addTask ({ state, commit, dispatch }, { name }) {
    const taskName = name.trim()
    if (taskName) {
      const order = state.settings.insertAtTop
        ? state.tasks.reduce((min, t) => t.order < min ? t.order : min, 0) - 1
        : state.tasks.reduce((max, t) => t.order > max ? t.order : max, 0) + 1
      const newTask = {
        id: 'task-' + nanoid(),
        name: taskName,
        notes: '',
        order,
        created_at: Date.now(),
        completed: null,
        archived: null
      }
      // Note: task added to dexie without tags array
      await dexieDb.tasks.add(newTask)
      if (state.settings.addSelectedTags && state.settings.selectedTagIds.length) {
        const taskTagMaps = state.settings.selectedTagIds.map(tagId => ({
          id: 'taskTag-' + nanoid(),
          taskId: newTask.id,
          tagId
        }))
        await dexieDb.taskTagMap.bulkAdd(taskTagMaps)
        newTask.tags = state.settings.selectedTagIds
      } else {
        newTask.tags = []
      }
      commit('addTask', { task: newTask })
      await dispatch('updateSetting', { key: 'selectedTaskID', value: newTask.id })
    }
  },
  
  async reorderIncompleteTasks ({ state, commit }, { newIncompleteTaskOrder }) {
    const incompleteTasks = state.tasks.filter(t => !t.completed)
    const completedTasks = state.tasks.filter(t => t.completed)
    const origLength = incompleteTasks.length
    if (newIncompleteTaskOrder.length === origLength) {
      const fullTaskOrder = newIncompleteTaskOrder.concat(completedTasks)
      for (const [i, task] of fullTaskOrder.entries()) {
        task.order = i
      }
      await dexieDb.tasks.bulkPut(fullTaskOrder)
      commit('setTasks', { tasks: fullTaskOrder })
    } else {
      const reorderTaskIds = {}
      newIncompleteTaskOrder.forEach(task => {
        reorderTaskIds[task.id] = true
      })
      let r = 0
      for (let i = 0; i < incompleteTasks.length; i++) {
        if (incompleteTasks[i].id in reorderTaskIds) {
          incompleteTasks[i] = newIncompleteTaskOrder[r]
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
        if (task.id === state.tempState.activeTaskID && state.tempState.running) {
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
  
  async addTaskTagByName ({ state, commit }, { taskId, tagName }) {
    tagName = tagName.trim()
    if (tagName) {
      const task = state.tasks.find(t => t.id === taskId)
      if (task) {
        let tag = await dexieDb.tags.where('tagName').equals(tagName).first()
        const isNewTag = !tag
        if (isNewTag) {
          const colors = Object.values(state.tags).map(tag => tag.color)
          const colorManager = new ColorManager(colors)
          // get the maximum order value in all tags in dexie
          const maxOrder = await dexieDb.tags.orderBy('order').last()
          const order = maxOrder ? maxOrder.order + 1 : 0
          tag = {
            id: 'tag-' + nanoid(),
            tagName: tagName,
            color: colorManager.getRandomColor(),
            order
          }
          await dexieDb.tags.add(tag)
        }
        await dexieDb.taskTagMap.add({
          id: 'taskTag-' + nanoid(),
          taskId,
          tagId: tag.id
        })
        commit('addTaskTag', { taskId, tag, isNewTag })
      }
    }
  },
  
  async addTaskTagById ({ state, commit }, { taskId, tagId }) {
    const task = state.tasks.find(t => t.id === taskId)
    const tag = state.tags[tagId]
    if (task && tag) {
      await dexieDb.taskTagMap.add({
        id: 'taskTag-' + nanoid(),
        taskId,
        tagId
      })
      commit('addTaskTag', { taskId, tag, isNewTag: false })
    }
  },
  
  async updateTag ({ state, commit }, { tagId, tagName, color }) {
    const tag = await dexieDb.tags.where('id').equals(tagId).first()
    if (!tag) {
      alert('Error: the tag you are trying to update does not exist. Please refresh the page and try again.')
      return
    }
    
    const existingTagWithName = await dexieDb.tags
      .where('tagName').equals(tagName)
      .and(tag => tag.id !== tagId)
      .first()
    if (existingTagWithName) {
      alert('Error: the new tag name you entered already exists. Please rename it to something else.')
      return
    }
    
    const tagUpdates = { tagName, color }
    await dexieDb.tags.update(tagId, tagUpdates)
    
    commit('updateTag', { tagId, tagUpdates })
  },
  
  async reorderTags ({ state, commit }, { newOrder }) {
    const reorderedTags = []
    for (const [i, tagId] of newOrder.entries()) {
      const tag = state.tags[tagId]
      if (tag.order !== i) {
        tag.order = i
        await dexieDb.tags.put(tag)
        reorderedTags.push(tag)
      }
    }
    commit('updateTagOrder', { reorderedTags })
  },
  
  async removeTaskTag ({ state, commit }, { taskId, tagId }) {
    await dexieDb.taskTagMap
      .where('taskId').equals(taskId)
      .and(taskTagMap => taskTagMap.tagId === tagId)
      .delete()
    
    const newTags = await dexieDb.taskTagMap.where('taskId').equals(taskId).toArray()
    const newTagIds = newTags.map(tag => tag.tagId)
    commit('updateTask', { taskId, taskUpdates: { tags: newTagIds } })
  },
  
  async deleteTag ({ state, commit }, { tagId }) {
    const tag = await dexieDb.tags.where('id').equals(tagId).first()
    if (confirm(`Are you sure you want to delete the tag "${tag.tagName}"?\nAll tasks with this tag will lose the tag.`)) {
      await dexieDb.taskTagMap.where('tagId').equals(tagId).delete()
      await dexieDb.tags.where('id').equals(tagId).delete()
      commit('deleteTag', { tagId })
    }
  },
  
  async selectTask ({ state, dispatch }, { taskId }) {
    await dispatch('updateSetting', { key: 'selectedTaskID', value: taskId })
  },
  
  async addTagFilter ({ state, dispatch }, { tagId }) {
    const selectedTagIds = state.settings.selectedTagIds
    selectedTagIds.push(tagId)
    await dispatch('updateSetting', { key: 'selectedTagIds', value: selectedTagIds })
  },
  
  async removeTagFilter ({ state, dispatch }, { tagId }) {
    const selectedTagIds = state.settings.selectedTagIds.filter(selectedTagId => selectedTagId !== tagId)
    await dispatch('updateSetting', { key: 'selectedTagIds', value: selectedTagIds })
  },
  
  async updateSetting ({ state, commit }, { key, value }) {
    await dexieDb.settings.put({ key, value })
    commit('updateSetting', { key, value })
  }
  
}

export default actions
