const initialState = {
  tasks: [],
  tags: {},
  tagOrder: [],
  selectedTagIds: [],
  modalTagId: null,
  totalTarget: {},
  filterOperator: 'and',
  addSelectedTags: true,
  showArchived: false,
  insertAtTop: false,
  activeTaskID: null,
  running: false,
  timeFormat24: false,
  
  settings: {
    selectedTaskID: null,
    // activeTaskID: null,
    activeMinutes: 25,
    restMinutes: 5,
    continueOnComplete: false,
    secondReminderMinutes: 5,
    secondReminderEnabled: true,
    globalNotificationsEnabled: true,
    
    // selectedTagIds: [],
    // filterOperator: 'and',
    // addSelectedTags: true,
    // showArchived: false,
    // insertAtTop: false,
    
    // timeFormat24: false,
    // totalTarget: {}
  }
}

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

export default initialState
