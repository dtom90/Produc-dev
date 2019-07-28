
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
        tags: [],
        created: Date.now(),
        log: [],
        completed: null
      }
      state.tasks.push(newTask)
      state.nextTaskID += 1
      state.selectedTaskID = newTask.id
    }
  },
  
  selectTask (state, id) {
    state.selectedTaskID = id
  },
  
  startTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task) {
      if (task.log.length === 0 || task.log[task.log.length - 1].stopped !== null) {
        task.log.push({
          started: Date.now(),
          stopped: null
        })
      } else {
        task.log[task.log.length - 1].started = Date.now()
      }
    }
  },
  
  stopTask (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (task && task.log.length > 0) {
      const lastInterval = task.log[task.log.length - 1]
      if (lastInterval.stopped === null) {
        lastInterval.stopped = Date.now()
      }
    }
  },
  
  addTaskTag (state, payload) {
    const newTag = payload.tag.trim()
    if (newTag) {
      const task = state.tasks.find(t => t.id === payload.id)
      if (task) {
        if (!(newTag in state.tags)) {
          state.tags[newTag] = [task.id]
        } else {
          addElem(state.tags[newTag], task.id)
        }
        addElem(task.tags, newTag)
      }
    }
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
