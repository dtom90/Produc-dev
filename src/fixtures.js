import moment from 'moment'

export function generateActivity () {
  const completedDate = moment()
  
  const log = [
    {
      started: moment(completedDate).subtract(1, 'd').subtract(28, 'm').valueOf(),
      stopped: moment(completedDate).subtract(1, 'd').subtract(3, 'm').valueOf(),
      timeSpent: moment.duration(22, 'm').asMilliseconds()
    },
    {
      started: moment(completedDate).add(10, 'm').valueOf(),
      stopped: moment(completedDate).add(30, 'm').valueOf(),
      timeSpent: moment.duration(15, 'm').asMilliseconds()
    }
  ]
  
  const day1Duration = moment.duration(22, 'm')
  const day2Duration = moment.duration(15, 'm')
  
  return {
    log,
    day1Duration,
    day2Duration,
    completedDate
  }
}

export function newTask (includeTags = false) {
  const tags = includeTags ? ['one tag', 'another tag'] : []
  
  return {
    id: 1,
    name: 'new task 1',
    tags,
    created: moment.now(),
    log: [],
    completed: null
  }
}

export function taskWithActivity () {
  const task = newTask()
  task.log = generateActivity().log
  task.completed = moment.now()
  return task
}
