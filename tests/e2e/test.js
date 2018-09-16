import { Selector } from 'testcafe'; // first import testcafe selectors

const task1 = 'This is my first task'
const task2 = 'This is my second task'
const task3 = 'This is my third task'

fixture `Getting Started`// declare the fixture
  .page `http://localhost:8080`;  // specify the start page


//then create a test and place your code there
test('My first test', async t => {
  await t
    .expect(Selector('h1').innerText).eql('To Do List')
    .typeText(Selector('input').withAttribute('placeholder', 'enter new task'), task1).pressKey('enter')
    .expect(Selector('li').nth(0).innerText).eql(task1)
    .typeText(Selector('input').withAttribute('placeholder', 'enter new task'), task2).pressKey('enter')
    .expect(Selector('li').nth(0).innerText).eql(task1)
    .expect(Selector('li').nth(1).innerText).eql(task2)
    .typeText(Selector('input').withAttribute('placeholder', 'enter new task'), task3).pressKey('enter')
    .expect(Selector('li').nth(0).innerText).eql(task1)
    .expect(Selector('li').nth(1).innerText).eql(task2)
    .expect(Selector('li').nth(2).innerText).eql(task3)
});