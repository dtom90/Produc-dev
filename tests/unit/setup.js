import 'fake-indexeddb/auto'

window.alert = (msg) => msg
window.electronAPI = {
  onMessage: () => {}
}

if (typeof queueMicrotask === 'undefined') {
  global.queueMicrotask = (callback) => Promise.resolve().then(callback).catch((err) => setTimeout(() => { throw err }))
}

if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}
