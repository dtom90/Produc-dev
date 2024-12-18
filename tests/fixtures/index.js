import moment from 'moment'

export function generateActivity () {
  const completedDate = moment().set({ hour: 12, minute: 0, second: 0 })
  
  const log = [
    {
      started: moment(completedDate).subtract(1, 'd').subtract(28, 'm').valueOf(),
      stopped: moment(completedDate).subtract(1, 'd').subtract(3, 'm').valueOf(),
      timeSpent: moment.duration(22, 'm').asMilliseconds()
    },
    {
      started: moment(completedDate).subtract(1, 'd').valueOf(),
      stopped: moment(completedDate).subtract(1, 'd').add(25, 'm').valueOf(),
      timeSpent: moment.duration(25, 'm').asMilliseconds()
    },
    {
      started: moment(completedDate).add(10, 'm').valueOf(),
      stopped: moment(completedDate).add(30, 'm').valueOf(),
      timeSpent: moment.duration(15, 'm').asMilliseconds()
    },
    {
      started: moment(completedDate).add(35, 'm').valueOf(),
      stopped: moment(completedDate).add(60, 'm').valueOf(),
      timeSpent: moment.duration(25, 'm').asMilliseconds()
    }
  ]
  
  const day1Duration = moment.duration(47, 'm').asMilliseconds()
  const day2Duration = moment.duration(40, 'm').asMilliseconds()
  
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
    id: 'id-1',
    name: 'new task 1',
    tags,
    created_at: moment.now(),
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
