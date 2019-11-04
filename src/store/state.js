/* eslint-disable import/first */
const state = {
  tasks: [],
  tags: {},
  selectedTags: [],
  addSelectedTags: true,
  nextTaskID: 0,
  insertAtTop: false,
  selectedTaskID: null,
  activeTaskID: null,
  running: false,
  continueOnComplete: false
}

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

export default state
