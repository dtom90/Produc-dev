import { Selector } from 'testcafe'; // first import testcafe selectors

const task1 = 'This is my first task'
const task2 = 'This is my second task'
const task3 = 'This is my third task'

fixture `Getting Started`// declare the fixture
  .page `http://localhost:8080`;  // specify the start page

  const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')
  const li = Selector('li')
  const checkbox = li.child('input').withAttribute('type', 'checkbox')

//then create a test and place your code there
test('My first test', async t => {
  await t
    .expect(Selector('h1').innerText).eql('To Do List')
    .typeText(newTaskInput, task1).pressKey('enter')
    .expect(li.nth(0).innerText).eql(task1).expect(checkbox.nth(0)).ok()
    .typeText(newTaskInput, task2).pressKey('enter')
    .expect(li.nth(0).innerText).eql(task1).expect(checkbox.nth(0)).ok()
    .expect(li.nth(1).innerText).eql(task2).expect(checkbox.nth(1)).ok()
    .typeText(newTaskInput, task3).pressKey('enter')
    .expect(li.nth(0).innerText).eql(task1).expect(checkbox.nth(0)).ok()
    .expect(li.nth(1).innerText).eql(task2).expect(checkbox.nth(1)).ok()
    .expect(li.nth(2).innerText).eql(task3).expect(checkbox.nth(2)).ok()
});