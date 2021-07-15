const initialState = {
  tasks: [],
  tags: {},
  tagOrder: [],
  modalTag: null,
  totalTarget: {},
  selectedTags: [],
  filterOperator: 'and',
  addSelectedTags: true,
  nextTaskID: 0,
  insertAtTop: false,
  selectedTaskID: null,
  activeTaskID: null,
  activeMinutes: 25,
  secondReminderEnabled: true,
  secondReminderMinutes: 5,
  restMinutes: 5,
  running: false,
  globalNotificationsEnabled: true,
  continueOnComplete: false,
  timeFormat24: false
}

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

export default initialState
