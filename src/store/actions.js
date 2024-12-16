import dexieDb from './dexieDb'
import { nanoid } from 'nanoid'
import ColorManager from 'color-manager'

const actions = {
  async addTask ({ state, commit }, { name }) {
    const taskName = name.trim()
    if (taskName) {
      const nextTaskIdDb = await dexieDb.settings.get('nextTaskID')
      const nextTaskID = nextTaskIdDb ? nextTaskIdDb.value : 0
      const newTask = {
        id: nextTaskID,
        name: taskName,
        tags: state.addSelectedTags && state.selectedTags.length > 0 ? [...state.selectedTags] : [],
        notes: '',
        log: [],
        created: Date.now(),
        completed: null,
        archived: null
      }
      // add to dexie
      await dexieDb.tasks.add(newTask)
      await dexieDb.settings.put({ key: 'nextTaskID', value: nextTaskID + 1 })
      commit('addTask', { task: newTask })
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
    if (!task.completed) {
      if (task.id === state.activeTaskID && state.running) {
        await dispatch('stopTask')
      }
      commit('completeTask', { taskId, completedValue: Date.now() })
    } else {
      commit('completeTask', { taskId, completedValue: null })
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
