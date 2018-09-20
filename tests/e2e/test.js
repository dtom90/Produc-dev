import { Selector } from 'testcafe'; // first import testcafe selectors

const task1 = 'This is my first task'
const task2 = 'This is my second task'
const task3 = 'This is my third task'

fixture `To Do List`
  .page `http://localhost:8080`;

  const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')

  const todoList = Selector('.section').withText('To Do List')
  const todoTasks = todoList.find('.task')
  const todoLabels = todoTasks.find('label')
  const todoCheckboxes = todoTasks.find('input').withAttribute('type', 'checkbox')

  const doneList = Selector('.section').withText('Completed Tasks')
  const doneTasks = doneList.find('.task')
  const doneCheckboxes = doneTasks.find('input').withAttribute('type', 'checkbox')

//then create a test and place your code there
test('My first test', async t => {
  await t

    .expect(todoList.child('h1').innerText).eql('To Do List')
    .expect(todoTasks.count).eql(0)

    .typeText(newTaskInput, task1).pressKey('enter')
    .expect(todoTasks.count).eql(1)
    .expect(todoLabels.nth(0).innerText).eql(task1)
    .expect(todoCheckboxes.count).eql(1)
    .expect(todoCheckboxes.nth(0).checked).notOk()

    .typeText(newTaskInput, task2).pressKey('enter')
    .expect(todoTasks.count).eql(2)
    .expect(todoLabels.nth(0).innerText).eql(task1)
    .expect(todoLabels.nth(1).innerText).eql(task2)
    .expect(todoCheckboxes.count).eql(2)
    .expect(todoCheckboxes.nth(0).checked).notOk()
    .expect(todoCheckboxes.nth(1).checked).notOk()

    .typeText(newTaskInput, task3).pressKey('enter')
    .expect(todoTasks.count).eql(3)
    .expect(todoLabels.nth(0).innerText).eql(task1)
    .expect(todoLabels.nth(1).innerText).eql(task2)
    .expect(todoLabels.nth(2).innerText).eql(task3)
    .expect(todoCheckboxes.count).eql(3)
    .expect(todoCheckboxes.nth(0).checked).notOk()
    .expect(todoCheckboxes.nth(1).checked).notOk()
    .expect(todoCheckboxes.nth(2).checked).notOk()

    .click(todoTasks.withText(task2).find('input').withAttribute('type', 'checkbox'))
    .expect(todoTasks.count).eql(2)
    .expect(todoCheckboxes.count).eql(2)
    .expect(todoCheckboxes.nth(0).checked).notOk()
    .expect(todoCheckboxes.nth(1).checked).notOk()
    .expect(doneList.child('h3').innerText).eql('Completed Tasks')
    .expect(doneTasks.count).eql(1)
    .expect(doneCheckboxes.count).eql(1)
    .expect(doneCheckboxes.nth(0).checked).ok()
});