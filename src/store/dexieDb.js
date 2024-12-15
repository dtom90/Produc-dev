import Dexie from 'dexie'
// import {Task} from "../types/Task";

const dexieDb = new Dexie('DevTrackDatabase')
dexieDb.version(1).stores({
  tasks: 'id, name, notes, completed, archived, created',
  tags: 'tagName, color',
  taskTagMap: 'id, taskId, tagName',
  logs: 'id, taskId, started, stopped, timeSpent',
  settings: 'key'
})

// // Add hooks
// dexieDb.tasks.hook('creating', function (primaryKey: string, obj: Task) {
//   obj.created = new Date()//.toISOString()
// })

export default dexieDb