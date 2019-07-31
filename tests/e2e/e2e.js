import { t, Selector, ClientFunction } from 'testcafe' // first import TestCafé selectors
import moment from 'moment'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const path = process.env.BASE_URL || ''
const page = `http://${hostname}:${port}${path}`

const handleErrorsAndWarnings = async function () {
  const { error, warn } = await t.getBrowserConsoleMessages()
  await t.expect(error[0]).notOk()
  await t.expect(warn[0]).notOk()
}

const rotationFactor = (turn, color = 'red') => {
  const countdownColor = color === 'red' ? 'red' : 'darkseagreen'
  const buttonColor = color === 'red' ? 'darkred' : 'green'
  return `--rotation-factor:${turn}turn; --countdown-color:${countdownColor}; --button-color:${buttonColor};`
}

fixture(`Testing Produc-dev at ${page}`)
  .page(page)
  .afterEach(() => handleErrorsAndWarnings())

// Tasks
const task1 = 'The first task'
const task2 = 'The second task'
const task2mod = 'The second completed task'
const task3 = 'The third task'
const task3mod = 'The modified third task'
const task4 = 'The fourth task'
const task5 = 'The fifth task'

// To Do List selectors
const todoSection = Selector('.section').withText('To Do')
const todoSortButton = todoSection.find('button').child('svg.fa-ellipsis-v')
const todoSortLabel = todoSortButton.parent().find('label').withText('First')
const todoSortSelect = todoSortButton.parent().find('select')
const todoSortOption = todoSortSelect.child('option')
const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')
const todoList = todoSection.find('.task-list')
const todoTasks = todoList.find('.task')

// Selected Task selectors
const selectedTaskSection = Selector('#selected-task-section')
const selectedTaskName = selectedTaskSection.find('#task-name')
const checkbox = selectedTaskSection.find('input').withAttribute('type', 'checkbox')
const menuButton = selectedTaskSection.find('button').child('svg.fa-ellipsis-v')
const saveButton = () => selectedTaskSection.find('button').find('svg.fa-save')
const deleteButton = taskName => selectedTaskSection.withText(taskName).find('button').find('svg.fa-trash-alt')
const tagAddButton = selectedTaskSection.find('button').child('svg.fa-plus')
const tagInput = selectedTaskSection.find('input[placeholder="add new tag"]')
const tag = selectedTaskSection.find('.tag')
const tagOption = selectedTaskSection.find('button.tag-option')
const activitySection = selectedTaskSection.find('#taskActivity')

// Completed List selectors
const doneSection = Selector('.section').withText('Done')
const doneMenuButton = doneSection.find('button').child('svg.fa-ellipsis-v')
const doneSortLabel = doneMenuButton.parent().find('label').withText('First')
const doneSortSelect = doneMenuButton.parent().find('select')
const doneSortOption = doneSortSelect.child('option')
const doneList = doneSection.find('.task-list')
const doneTasks = doneList.find('.task')
const clearAllButton = Selector('button').withText('Clear All')

const tasksPresent = ClientFunction(list => {
  const tasks = list().querySelectorAll('.task')
  return Array.apply(null, tasks).map(task => task.innerText)
})

const tagsPresent = ClientFunction(() => {
  const tags = document.querySelectorAll('#selected-task-section .tag > .tag-name')
  return Array.apply(null, tags).map(tag => tag.innerText)
})

const tagOptions = ClientFunction(() => {
  const tags = document.querySelectorAll('button.tag-option')
  return Array.apply(null, tags).map(tag => tag.innerText)
})

const dialogHandler = ClientFunction((type, text) => {
  switch (type) { /* eslint-disable no-throw-literal */
    case 'confirm':
      switch (text) { /* eslint-disable no-undef */
        case (typeof taskName !== 'undefined') &&
        `Are you sure you want to delete task ${taskName}? the task is not yet complete!`:
          return deleteTask
        case `Are you sure that you want to delete all ${numCompletedTasks} completed tasks?`:
          return deleteTask
        default:
          throw 'Unexpected confirm dialog!'
      }
    case 'prompt':
      throw 'A prompt was invoked!'
    case 'alert':
      switch (text) {
        case 'Finished Working, Take a Break!':
          return true
        case 'Warning! Permissions to notify you have been denied! You may not tell when your Pomodoro timer ends.':
          return true
        default:
          throw `An unexpected alert was invoked: "${text}"`
      }
  }
})

const eventNow = (type) => {
  const now = moment().local()
  const oneMinAgo = moment(now).subtract(1, 'minute')
  const oneMinAhead = moment(now).add(1, 'minute')
  return new RegExp([
    `${type} ${oneMinAgo.format('ddd MMM DD, h:mm a')}`,
    `${type} ${now.format('ddd MMM DD, h:mm a')}`,
    `${type} ${oneMinAhead.format('ddd MMM DD, h:mm a')}`
  ].join('|'))
}

// then create a test and place your code there
test('Create, Complete and Delete Tasks to Test Functionality', async t => {
  await handleErrorsAndWarnings()
  await t
    
    // Expect an empty Selected Task section
    .expect(selectedTaskName.exists).notOk()
    
    // Expect an empty To Do List
    .expect(todoSection.find('h3').withText('To Do').exists).ok()
    .expect(todoSortButton.exists).ok()
    .expect(todoTasks.count).eql(0)
    .expect(doneTasks.count).eql(0)
    
    // Add task 1
    .setNativeDialogHandler(dialogHandler)
    .typeText(newTaskInput, task1)
    .pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task1])
    .expect(selectedTaskName.textContent).eql(task1)
    
    // Add a tag to task 1
    .expect(tagsPresent()).eql([])
    .click(tagAddButton)
    .expect(tagOptions()).eql([])
    .typeText(tagInput, 'my tag')
    .pressKey('enter')
    .expect(tagsPresent()).eql(['my tag'])
    
    // Add task 2
    .typeText(newTaskInput, task2).pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task2, task1])
    .expect(selectedTaskName.textContent).eql(task2)
    
    // Add the previous tag to task 2
    .expect(tagsPresent()).eql([])
    .click(tagAddButton)
    .expect(tagOptions()).eql(['my tag'])
    .click(tagOption.withText('my tag'))
    .expect(tagsPresent()).eql(['my tag'])
    
    // Add another tag to task 2
    .expect(tagOptions()).eql([])
    .typeText(tagInput, 'another tag')
    .pressKey('enter')
    .expect(tagsPresent()).eql(['my tag', 'another tag'])
    
    // Add task 3
    .typeText(newTaskInput, task3).pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task3, task2, task1])
    .expect(selectedTaskName.textContent).eql(task3)
    
    // Adjust the timer and expect the dial to remain still
    .expect(selectedTaskSection.find('p').withText('25:00').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    .click(selectedTaskSection.find('p').withText('25:00'))
    .expect(selectedTaskSection.find('input[type="number"]').visible).ok()
    .expect(selectedTaskSection.find('button > svg.fa-save').visible).ok()
    .typeText(selectedTaskSection.find('#edit-wrapper input'), '12', { replace: true })
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    .click(selectedTaskSection.find('button > svg.fa-save'))
    .expect(selectedTaskSection.find('p').withText('12:00').visible).ok()
    .click(selectedTaskSection.find('p').withText('12:00'))
    .typeText(selectedTaskSection.find('#edit-wrapper input'), '25', { replace: true })
    .pressKey('enter')
    .expect(selectedTaskSection.find('p').withText('25:00').visible).ok()
    
    // Add the previous tag to task 3
    .expect(tagsPresent()).eql([])
    .click(tagAddButton)
    .expect(tagOptions()).eql(['my tag', 'another tag'])
    .click(tagOption.withText('another tag'))
    .pressKey('enter')
    .expect(tagsPresent()).eql(['another tag'])
    
    // Go back to task 2 and remove 'another tag'
    .click(todoTasks.withText(task2))
    .expect(tagsPresent()).eql(['my tag', 'another tag'])
    .click(tag.withText('another tag').child('button').withText('×'))
    .expect(tagsPresent()).eql(['my tag'])
    
    // Expect option to reappear when input clicked
    .click(tagAddButton)
    .expect(tagOptions()).eql(['another tag'])
    
    // Remove the other tag and then expect both options to reappear
    .click(tag.withText('my tag').child('button').withText('×'))
    .expect(tagsPresent()).eql([])
    .click(tagAddButton)
    .expect(tagOptions()).eql(['my tag', 'another tag'])
    .click(tagOption.withText('my tag'))
    .expect(tagsPresent()).eql(['my tag'])
    
    // Press the countdown play button and expect the countdown to decrement
    .expect(selectedTaskSection.find('p').withText('25:00').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    .click(selectedTaskSection.find('button > svg.fa-play'))
    .expect(selectedTaskSection.find('p').withText('24:59').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1499 / 1500).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('24:58').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1498 / 1500).toPrecision(6)))
    
    // Try to modify timer during countdown, should fail
    .click(selectedTaskSection.find('p').withText('24:58'))
    .expect(selectedTaskSection.find('input[type="number"]').exists).notOk()
    .expect(selectedTaskSection.find('p').withText('24:57').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1497 / 1500).toString()))
    .expect(selectedTaskSection.find('p').withText('24:56').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1496 / 1500).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('24:55').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1495 / 1500).toPrecision(6)))
    
    // Click a tag, should show tag activity modal, timer should not stop
    .click(tag.withText('my tag'))
    .expect(Selector('h3').withText('Activity for my tag').visible).ok()
    .expect(selectedTaskSection.find('p').withText('24:54').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1494 / 1500).toString()))
    .expect(selectedTaskSection.find('p').withText('24:53').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1493 / 1500).toPrecision(6)))
    .click(Selector('button').withText('Close'))
    
    // Pause the timer, should stop
    .expect(selectedTaskSection.find('p').withText('24:52').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1492 / 1500).toPrecision(6)))
    .click(selectedTaskSection.find('button').child('svg[data-icon="pause"]'))
    .click(activitySection.find('button').withText('Full Log'))
    .expect(activitySection.find('tr').textContent).match(eventNow('Stopped'))
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1492 / 1500).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('24:52').visible).ok()
    .expect(selectedTaskSection.find('p').withText('24:51').exists).notOk()
    
    // Switch To Do list order from Oldest First to Newest First
    .expect(todoSortLabel.visible).notOk()
    .expect(todoSortSelect.visible).notOk()
    .click(todoSortButton)
    .expect(todoSortLabel.visible).ok()
    .expect(todoSortSelect.visible).ok()
    .expect(todoSortSelect.value).eql('Newest')
    .click(todoSortSelect)
    .click(todoSortOption.withText('Oldest'))
    .expect(todoSortSelect.value).eql('Oldest')
    .expect(tasksPresent(todoList)).eql([task1, task2, task3])
    
    // Add task 4
    .typeText(newTaskInput, task4).pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task1, task2, task3, task4])
    .expect(selectedTaskName.textContent).eql(task4)
    
    // Add task 5
    .typeText(newTaskInput, task5).pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task1, task2, task3, task4, task5])
    .expect(selectedTaskName.textContent).eql(task5)
  
    // Start timer and switch tasks midway
    .expect(selectedTaskSection.find('p').withText('24:52').visible).ok()
    .click(selectedTaskSection.find('button > svg.fa-play'))
    .expect(activitySection.find('tr').textContent).match(eventNow('Started'))
    .expect(selectedTaskSection.find('p').withText('24:51').visible).ok()
    .expect(selectedTaskSection.find('p').withText('24:50').visible).ok()
    .click(todoTasks.withText(task4))
    .expect(activitySection.find('tr').textContent).match(eventNow('Started'))
    .click(todoTasks.withText(task5))
    .expect(activitySection.find('tr').nth(0).textContent).match(eventNow('Started'))
    .expect(activitySection.find('tr').nth(1).textContent).match(eventNow('Stopped'))
    .expect(activitySection.find('tr').nth(1).textContent).match(eventNow('Started'))
    
    // Complete tasks 4 and 2
    .click(todoTasks.withText(task4))
    .expect(selectedTaskSection.withText(task4).visible).ok()
    .click(checkbox(task4))
    .click(todoTasks.withText(task2))
    .expect(selectedTaskSection.withText(task2).visible).ok()
    .click(checkbox(task2))
    .expect(tasksPresent(todoList)).eql([task1, task3, task5])
    .expect(tasksPresent(doneList)).eql([task2, task4])
    
    // Switch completed list order from Oldest First to Newest First
    .expect(doneSortLabel.visible).notOk()
    .expect(doneSortSelect.visible).notOk()
    .click(doneMenuButton)
    .expect(doneSortLabel.visible).ok()
    .expect(doneSortSelect.visible).ok()
    .expect(doneSortSelect.value).eql('Recent')
    .click(doneSortSelect)
    .click(doneSortOption.withText('Oldest'))
    .expect(doneSortSelect.value).eql('Oldest')
    .expect(tasksPresent(doneList)).eql([task4, task2])
    .expect(doneSortLabel.visible).ok()
    .expect(doneSortSelect.visible).ok()
    .expect(doneSortSelect.value).eql('Oldest')
    .click(doneSortSelect)
    .click(doneSortOption.withText('Recent'))
    .expect(tasksPresent(doneList)).eql([task2, task4])
    
    // Modify task 3 in the Active section
    .click(todoTasks.withText(task3))
    .expect(selectedTaskSection.withText(task3).visible).ok()
    .click(selectedTaskSection.find('span').withText(task3))
    .expect(selectedTaskSection.find('input.edit-task').value).eql(task3)
    .typeText(selectedTaskSection.find('input.edit-task'), ' modified', { caretPos: 3 })
    .pressKey('enter')
    .expect(selectedTaskSection.withText(task3mod).visible).ok()
    .expect(tasksPresent(todoList)).eql([task1, task3mod, task5])
    .expect(tasksPresent(doneList)).eql([task2, task4])
    
    // Mark task 3 as complete
    .click(checkbox(task3mod))
    .expect(tasksPresent(todoList)).eql([task1, task5])
    .expect(tasksPresent(doneList)).eql([task3mod, task2, task4])
    
    // Click task 5 delete button, expect confirmation popup, do not confirm
    .setNativeDialogHandler(dialogHandler, { dependencies: { taskName: task5, deleteTask: false } })
    .click(todoTasks.withText(task5))
    .click(menuButton)
    .click(deleteButton(task5))
    .expect(tasksPresent(todoList)).eql([task1, task5])
    .expect(tasksPresent(doneList)).eql([task3mod, task2, task4])
    
    // Click task 3 delete button, expect no confirmation popup
    .click(doneTasks.withText(task3mod))
    .click(menuButton)
    .click(deleteButton(task3mod))
    .expect(tasksPresent(todoList)).eql([task1, task5])
    .expect(tasksPresent(doneList)).eql([task2, task4])
    
    // Click task 1 delete button, expect confirmation popup, confirm delete
    .setNativeDialogHandler(dialogHandler, { dependencies: { taskName: task1, deleteTask: true } })
    .click(todoTasks.withText(task1))
    .click(menuButton)
    .click(deleteButton(task1))
    .expect(tasksPresent(todoList)).eql([task5])
    .expect(tasksPresent(doneList)).eql([task2, task4])
    
    // Modify task 2 in the completed list
    .click(doneTasks.withText(task2))
    .expect(selectedTaskSection.withText(task2).visible).ok()
    .click(selectedTaskSection.find('span').withText(task2))
    .expect(selectedTaskSection.find('input.edit-task').value).eql(task2)
    .typeText(selectedTaskSection.find('input.edit-task'), 'completed ', { caretPos: 11 })
    .click(saveButton())
    .expect(tasksPresent(todoList)).eql([task5])
    .expect(tasksPresent(doneList)).ok([task2mod, task4])
    
    // Click the Clear button to clear all completed tasks
    .setNativeDialogHandler(dialogHandler, { dependencies: { numCompletedTasks: 2, deleteTask: true } })
    .click(doneMenuButton)
    .click(clearAllButton)
    .expect(tasksPresent(todoList)).eql([task5])
    .expect(tasksPresent(doneList)).eql([])
    
    // Complete task 5, click the Clear button, expect no popup
    .click(todoTasks.withText(task5))
    .click(checkbox(task5))
    .expect(tasksPresent(todoList)).eql([])
    .expect(tasksPresent(doneList)).eql([task5])
    .setNativeDialogHandler(dialogHandler, { dependencies: { numCompletedTasks: 9, deleteTask: false } })
    .click(doneMenuButton)
    .click(clearAllButton)
    .expect(tasksPresent(todoList)).eql([])
    .expect(tasksPresent(doneList)).eql([])
})

test('Countdown funcitonality', async t => {
  await handleErrorsAndWarnings()
  await t
  
  // Add task 1
    .setNativeDialogHandler(dialogHandler)
    .typeText(newTaskInput, task1)
    .pressKey('enter')
    .expect(tasksPresent(todoList)).eql([task1])
    .expect(selectedTaskName.textContent).eql(task1)
    
    // Adjust the timer and expect the dial to remain still
    .expect(selectedTaskSection.find('p').withText('25:00').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    .click(selectedTaskSection.find('p').withText('25:00'))
    .expect(selectedTaskSection.find('input[type="number"]').visible).ok()
    .expect(selectedTaskSection.find('button > svg.fa-save').visible).ok()
    .typeText(selectedTaskSection.find('#edit-wrapper input'), '0.1', { replace: true })
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    .click(selectedTaskSection.find('button > svg.fa-save'))
    .expect(selectedTaskSection.find('p').withText('0:06').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1))
    
    // Press the countdown play button and expect the countdown to decrement
    .click(selectedTaskSection.find('button > svg.fa-play'))
    .expect(selectedTaskSection.find('p').withText('0:05').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((5 / 6).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('0:04').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((4 / 6).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('0:03').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((3 / 6).toString()))
    .expect(selectedTaskSection.find('p').withText('0:02').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((2 / 6).toPrecision(6)))
    .expect(selectedTaskSection.find('p').withText('0:01').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor((1 / 6).toPrecision(6)))
    
    // Expect the timer to switch to a rest timer
    .expect(selectedTaskSection.find('p').withText('5:00').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1, 'green'))
    .click(selectedTaskSection.find('p').withText('5:00'))
    .expect(selectedTaskSection.find('input[type="number"]').visible).ok()
    .expect(selectedTaskSection.find('button > svg.fa-save').visible).ok()
    .typeText(selectedTaskSection.find('#edit-wrapper input'), '0.05', { replace: true })
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1, 'green'))
    .pressKey('enter')
    .expect(selectedTaskSection.find('p').withText('0:03').visible).ok()
    .expect(selectedTaskSection.find('#countdown-container').getAttribute('style')).eql(rotationFactor(1, 'green'))
})
