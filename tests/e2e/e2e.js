import { Selector, ClientFunction } from 'testcafe' // first import testcafe selectors

const hostname = 'localhost'
const port = process.env.PORT || '8080'

fixture`To Do List`
  .page`http://${hostname}:${port}`

// Tasks
const task1 = 'The first task'
const task2 = 'The second task'
const task2mod = 'The second completed task'
const task3 = 'The third task'
const task3mod = 'The modified third task'
const task4 = 'The fourth task'
const task5 = 'The fifth task'

// To Do List selectors
const todoSection = Selector('.section').withText('To Do List')
const todoSortButton = todoSection.find('button').child('svg.fa-cog')
const todoSortLabel = todoSortButton.parent().find('label').withText('First')
const todoSortSelect = todoSortButton.parent().find('select')
const todoSortOption = todoSortSelect.child('option')
const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')
const todoList = todoSection.find('.task-list')
const todoTasks = todoList.find('.task')

// Active Task selectors
const activeSection = Selector('.section').withText('Active Task')
const checkbox = activeSection.find('input').withAttribute('type', 'checkbox')

// Completed List selectors
const doneSection = Selector('.section').withText('Completed Tasks')
const doneSortButton = doneSection.find('button').child('svg.fa-cog')
const doneSortLabel = doneSortButton.parent().find('label').withText('First')
const doneSortSelect = doneSortButton.parent().find('select')
const doneSortOption = doneSortSelect.child('option')
const doneList = doneSection.find('.task-list')
const doneTasks = doneList.find('.task')
const doneMenuButton = doneSection.find('button').child('svg.fa-cog')
const clearAllButton = Selector('button').withText('Clear All')

const tasksPresent = ClientFunction((taskList, expectedTasks) => {
  const tasks = taskList().childNodes
  return tasks.length === expectedTasks.length &&
    [].every.call(tasks, (task, i) => task.textContent.includes(expectedTasks[i]))
})

function saveButton () {
  return activeSection.find('button')
    .filter(node => node.getElementsByTagName('svg')[0].classList.contains('fa-save'))
}

function deleteButton (taskName) {
  return activeSection.withText(taskName).find('button')
    .filter(node => node.getElementsByTagName('svg')[0].classList.contains('fa-trash-alt'))
}

const deleteHandler = ClientFunction((type, text) => {
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
      throw 'An alert was invoked!'
  }
})

// then create a test and place your code there
test('Create, Complete and Delete Tasks to Test Functionality', async t => {
  await t
    
    // Expect an empty To Do List
    .expect(todoSection.find('h3').withText('To Do List').exists).ok()
    .expect(todoSortButton.exists).ok()
    .expect(todoTasks.count).eql(0)
    .expect(doneTasks.count).eql(0)
    
    // Add task 1
    .typeText(newTaskInput, task1).pressKey('enter')
    .expect(tasksPresent(todoList, [task1])).ok()
    
    // Add task 2
    .typeText(newTaskInput, task2).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task2])).ok()
    
    // Add task 3
    .typeText(newTaskInput, task3).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task2, task3])).ok()
    
    // Switch To Do list order from Oldest First to Newest First
    .expect(todoSortLabel.visible).notOk()
    .expect(todoSortSelect.visible).notOk()
    .click(todoSortButton)
    .expect(todoSortLabel.visible).ok()
    .expect(todoSortSelect.visible).ok()
    .expect(todoSortSelect.value).eql('Oldest')
    .click(todoSortSelect)
    .click(todoSortOption.withText('Newest'))
    .expect(todoSortSelect.value).eql('Newest')
    .expect(tasksPresent(todoList, [task3, task2, task1])).ok()
    
    // Add task 4
    .typeText(newTaskInput, task4).pressKey('enter')
    .expect(tasksPresent(todoList, [task4, task3, task2, task1])).ok()
    
    // Add task 5
    .typeText(newTaskInput, task5).pressKey('enter')
    .expect(tasksPresent(todoList, [task5, task4, task3, task2, task1])).ok()
    
    // Complete tasks 4 and 2
    .click(todoTasks.withText(task4))
    .expect(activeSection.withText(task4).visible).ok()
    .click(checkbox(task4))
    .click(todoTasks.withText(task2))
    .expect(activeSection.withText(task2).visible).ok()
    .click(checkbox(task2))
    .expect(tasksPresent(todoList, [task5, task3, task1])).ok()
    .expect(tasksPresent(doneList, [task2, task4])).ok()
    
    // Switch completed list order from Oldest First to Newest First
    .expect(doneSortLabel.visible).notOk()
    .expect(doneSortSelect.visible).notOk()
    .click(doneSortButton)
    .expect(doneSortLabel.visible).ok()
    .expect(doneSortSelect.visible).ok()
    .expect(doneSortSelect.value).eql('Recent')
    .click(doneSortSelect)
    .click(doneSortOption.withText('Oldest'))
    .expect(doneSortSelect.value).eql('Oldest')
    .expect(tasksPresent(doneList, [task4, task2])).ok()
    .expect(doneSortLabel.visible).ok()
    .expect(doneSortSelect.visible).ok()
    .expect(doneSortSelect.value).eql('Oldest')
    .click(doneSortSelect)
    .click(doneSortOption.withText('Recent'))
    .expect(tasksPresent(doneList, [task2, task4])).ok()
    
    // Modify task 3 in the Active section
    .click(todoTasks.withText(task3))
    .expect(activeSection.withText(task3).visible).ok()
    .click(activeSection.find('span').withText(task3))
    .expect(activeSection.find('input.edit-task').value).eql(task3)
    .typeText(activeSection.find('input.edit-task'), ' modified', { caretPos: 3 })
    .pressKey('enter')
    .expect(activeSection.withText(task3mod).visible).ok()
    .expect(tasksPresent(todoList, [task5, task3mod, task1])).ok()
    .expect(tasksPresent(doneList, [task2, task4])).ok()
    
    // Mark task 3 as complete
    .click(checkbox(task3mod))
    .expect(tasksPresent(todoList, [task5, task1])).ok()
    .expect(tasksPresent(doneList, [task3mod, task2, task4])).ok()
    
    // Click task 5 delete button, expect confirmation popup, do not confirm
    .setNativeDialogHandler(deleteHandler, { dependencies: { taskName: task5, deleteTask: false } })
    .click(todoTasks.withText(task5))
    .click(deleteButton(task5))
    .expect(tasksPresent(todoList, [task5, task1])).ok()
    .expect(tasksPresent(doneList, [task3mod, task2, task4])).ok()
    
    // Click task 3 delete button, expect no confirmation popup
    .click(doneTasks.withText(task3mod))
    .click(deleteButton(task3mod))
    .expect(tasksPresent(todoList, [task5, task1])).ok()
    .expect(tasksPresent(doneList, [task2, task4])).ok()
    
    // Click task 1 delete button, expect confirmation popup, confirm delete
    .setNativeDialogHandler(deleteHandler, { dependencies: { taskName: task1, deleteTask: true } })
    .click(todoTasks.withText(task1))
    .click(deleteButton(task1))
    .expect(tasksPresent(todoList, [task5])).ok()
    .expect(tasksPresent(doneList, [task2, task4])).ok()
    
    // Modify task 2 in the completed list
    .click(doneTasks.withText(task2))
    .expect(activeSection.withText(task2).visible).ok()
    .click(activeSection.find('span').withText(task2))
    .expect(activeSection.find('input.edit-task').value).eql(task2)
    .typeText(activeSection.find('input.edit-task'), 'completed ', { caretPos: 11 })
    .click(saveButton())
    .expect(tasksPresent(todoList, [task5])).ok()
    .expect(tasksPresent(doneList, [task2mod, task4])).ok()
    
    // Click the Clear button to clear all completed tasks
    .setNativeDialogHandler(deleteHandler, { dependencies: { numCompletedTasks: 2, deleteTask: true } })
    .click(doneMenuButton)
    .click(clearAllButton)
    .expect(tasksPresent(todoList, [task5])).ok()
    .expect(tasksPresent(doneList, [])).ok()
    
    // Complete task 5, click the Clear button, expect no popup
    .click(todoTasks.withText(task5))
    .click(checkbox(task5))
    .expect(tasksPresent(todoList, [])).ok()
    .expect(tasksPresent(doneList, [task5])).ok()
    .setNativeDialogHandler(deleteHandler, { dependencies: { numCompletedTasks: 9, deleteTask: false } })
    .click(doneMenuButton)
    .click(clearAllButton)
    .expect(tasksPresent(todoList, [])).ok()
    .expect(tasksPresent(doneList, [])).ok()
})
