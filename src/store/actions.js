import dexieDb from './dexieDb'

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
  }
}

export default actions
