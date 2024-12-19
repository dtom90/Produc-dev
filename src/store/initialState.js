const initialState = {
  tasks: [],
  tags: {},
  tagOrder: [],
  running: false,
  modalTagId: null,
  
  settings: {
    selectedTaskID: null,
    activeTaskID: null,
    activeMinutes: 25,
    restMinutes: 5,
    secondReminderMinutes: 5,
    secondReminderEnabled: true,
    globalNotificationsEnabled: true,
    continueOnComplete: false,
    
    selectedTagIds: [],
    filterOperator: 'and',
    addSelectedTags: true,
    showArchived: false,
    insertAtTop: false,
    
    timeFormat24: false,
    totalTarget: {}
  }
}

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

export default initialState
