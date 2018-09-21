import { Selector, ClientFunction } from 'testcafe'; // first import testcafe selectors

const task1 = 'This is my first task'
const task2 = 'This is my second task'
const task3 = 'This is my third task'
const task4 = 'This is my fourth task'

fixture `To Do List`
  .page `http://localhost:8080`;

  const newTaskInput = Selector('input').withAttribute('placeholder', 'enter new task')

  const todoSection = Selector('.section').withText('To Do List')
  const todoList = todoSection.find('.task-list')
  const todoTasks = todoList.find('.task')

  const doneSection = Selector('.section').withText('Completed Tasks')
  const doneList = doneSection.find('.task-list')
  const doneTasks = doneList.find('.task')

  const tasksPresent = ClientFunction((taskList, expectedTasks, checked=false) => {
    const tasks = taskList().childNodes
    return tasks.length === expectedTasks.length &&
      [].every.call(tasks, (task, i) => {
        const input = task.getElementsByTagName("input")[0]
        return task.textContent.includes(expectedTasks[i]) &&
          input.type === 'checkbox' &&
          input.checked === checked
      })
  });

  function deleteButton(taskName) {
    return Selector('.task').withText(taskName).find('button')
      .filter(node => node.getElementsByTagName('svg')[0].classList.contains('fa-trash-alt'))
  }

  const deleteHandler = (type, text) => {
    switch (type) {
      case 'confirm':
        if (text.includes('Are you sure you want to delete task ') &&
          text.includes('? the task is not yet complete!')) {
            return true;
        } else {
          throw 'Unexpected confirm dialog!';
        }
      case 'prompt':
        throw 'A prompt was invoked!';
      case 'alert':
        throw 'An alert was invoked!';
    }
  }

//then create a test and place your code there
test('My first test', async t => {
  await t

    .expect(todoSection.child('h1').innerText).eql('To Do List')
    .expect(todoTasks.count).eql(0)
    .expect(doneTasks.count).eql(0)

    .typeText(newTaskInput, task1).pressKey('enter')
    .expect(tasksPresent(todoList, [task1])).ok()

    .typeText(newTaskInput, task2).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task2])).ok()

    .typeText(newTaskInput, task3).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task2, task3])).ok()

    .click(todoTasks.withText(task2).find('input').withAttribute('type', 'checkbox'))
    .expect(tasksPresent(todoList, [task1, task3])).ok()
    .expect(doneSection.child('h3').innerText).eql('Completed Tasks')
    .expect(tasksPresent(doneList, [task2], true)).ok()

    .typeText(newTaskInput, task4).pressKey('enter')
    .expect(tasksPresent(todoList, [task1, task3, task4])).ok()
    .expect(tasksPresent(doneList, [task2], true)).ok()

    .click(todoTasks.withText(task3).find('input').withAttribute('type', 'checkbox'))
    .expect(tasksPresent(todoList, [task1, task4])).ok()
    .expect(tasksPresent(doneList, [task2, task3], true)).ok()

    .setNativeDialogHandler(deleteHandler)
    .click(deleteButton(task1))
    .expect(tasksPresent(todoList, [task4])).ok()
    .expect(tasksPresent(doneList, [task2, task3], true)).ok()
});
