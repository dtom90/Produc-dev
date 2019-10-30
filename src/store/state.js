/* eslint-disable import/first */
const state = {
  tasks: [],
  tags: {},
  nextTaskID: 0,
  insertAtTop: false,
  addSelectedTags: true,
  selectedTaskID: null,
  activeTaskID: null,
  selectedTags: [],
  running: false,
  continueOnComplete: false
}

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

export default state
