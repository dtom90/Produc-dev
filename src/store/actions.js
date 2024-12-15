import dexieDb from './dexieDb'
import { nanoid } from 'nanoid'

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
    console.log('startTask')
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
    console.log('stopTask')
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
    console.log('addInterval')
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
  }
  
}

export default actions
