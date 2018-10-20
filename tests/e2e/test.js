import {Selector, ClientFunction} from 'testcafe'; // first import testcafe selectors

const hostname = 'localhost'
const port = process.env.PORT || '8080'

fixture`To Do List`
  .page`http://${hostname}:${port}`;

const task1 = 'This is my first task'
const task2 = 'This is my second task'
const task2mod = 'This is my second completed task'
const task3 = 'This is my third task'
const task3mod = 'This is my modified third task'
const task4 = 'This is my fourth task'
const task5 = 'This is my fifth task'

const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')

const todoSection = Selector('.section').withText('To Do List')
const todoList = todoSection.find('.task-list')
const todoTasks = todoList.find('.task')

const doneSection = Selector('.section').withText('Completed Tasks')
const doneList = doneSection.find('.task-list')
const doneTasks = doneList.find('.task')
const clearButton = Selector('button').withText('Clear')

const tasksPresent = ClientFunction((taskList, expectedTasks, checked = false) => {
  const tasks = taskList().childNodes
  return tasks.length === expectedTasks.length &&
    [].every.call(tasks, (task, i) => {
      const input = task.getElementsByTagName("input")[0]
      return task.textContent.includes(expectedTasks[i]) &&
        input.type === 'checkbox' &&
        input.checked === checked
    })
})

function saveButton() {
  return Selector('input.edit-task').parent('.task').find('button')
    .filter(node => node.getElementsByTagName('svg')[0].classList.contains('fa-save'))
}

function deleteButton(taskName) {
  return Selector('.task').withText(taskName).find('button')
    .filter(node => node.getElementsByTagName('svg')[0].classList.contains('fa-trash-alt'))
}

const deleteHandler = ClientFunction((type, text) => {
  switch (type) {
    case 'confirm':
      switch (text) { /* eslint-disable no-undef */
        case (typeof taskName !== 'undefined') &&
          `Are you sure you want to delete task ${taskName}? the task is not yet complete!`:
          return deleteTask
        case `Are you sure that you want to delete all ${numCompletedTasks} completed tasks?`:
          return deleteTask
        default:
          throw 'Unexpected confirm dialog!';
      }
    case 'prompt':
      throw 'A prompt was invoked!';
    case 'alert':
      throw 'An alert was invoked!';
  }
})

//then create a test and place your code there
test('My first test', async t => {
  await t

    // Expect an empty To Do List
    .expect(todoSection.find('h1').withText('To Do List').exists).ok()
    // TODO: setting to stack vs queue
    .expect(Selector('button').child('svg.fa-cog').exists).ok()
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

    // Mark task 2 as complete
    .expect(doneSection.exists).notOk()
    .click(todoTasks.withText(task2).find('input').withAttribute('type', 'checkbox'))
    .expect(tasksPresent(todoList, [task1, task3])).ok()
    .expect(doneSection.exists).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    // Add task 4
    .typeText(newTaskInput, task4).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task3, task4])).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    // Modify task 3 in the To Do list
    .click(todoTasks.find('span').withText(task3))
    .expect(Selector('input.edit-task').value).eql(task3)
    .typeText(Selector('input.edit-task'), ' modified', {caretPos: 10})
    .pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task3mod, task4])).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    // Mark task 3 as complete
    .click(todoTasks.withText(task3mod).find('input').withAttribute('type', 'checkbox'))
    .expect(tasksPresent(todoList, [task1, task4])).ok()
    .expect(tasksPresent(doneList, [task2, task3mod], true)).ok()

    // Click task 4 delete button, expect confirmation popup, do not confirm
    .setNativeDialogHandler(deleteHandler, {dependencies: {taskName: task4, deleteTask: false}})
    .click(deleteButton(task4))
    .expect(tasksPresent(todoList, [task1, task4])).ok()
    .expect(tasksPresent(doneList, [task2, task3mod], true)).ok()

    // Click task 3 delete button, expect no confirmation popup
    .click(deleteButton(task3mod))
    .expect(tasksPresent(todoList, [task1, task4])).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    // Click task 1 delete button, expect confirmation popup, confirm delete
    .setNativeDialogHandler(deleteHandler, {dependencies: {taskName: task1, deleteTask: true}})
    .click(deleteButton(task1))
    .expect(tasksPresent(todoList, [task4])).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    // Modify task 2 in the completed list
    .click(doneTasks.find('span').withText(task2))
    .expect(Selector('input.edit-task').value).eql(task2)
    .typeText(Selector('input.edit-task'), 'completed ', {caretPos: 18})
    .click(saveButton())
    .expect(tasksPresent(todoList, [task4])).ok()
    .expect(tasksPresent(doneList, [task2mod], true)).ok()

    // Add task 5 and complete it, the click the Clear button to clear all completed
    .expect(clearButton.exists).ok()
    .typeText(newTaskInput, task5).pressKey('enter')
    .click(todoTasks.withText(task5).find('input').withAttribute('type', 'checkbox'))
    .expect(tasksPresent(todoList, [task4])).ok()
    .expect(tasksPresent(doneList, [task2mod, task5], true)).ok()
    .setNativeDialogHandler(deleteHandler, {dependencies: {numCompletedTasks: 2, deleteTask: true}})
    .click(clearButton)
    .expect(tasksPresent(todoList, [task4])).ok()
    .expect(doneSection.exists).notOk()

    // TODO: click and drag to rearrange tasks
});
