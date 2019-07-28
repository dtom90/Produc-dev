import moment from 'moment'

export function generateActivity () {
  
  const completedDate = moment()
  
  const log = [
    {
      started: moment(completedDate).subtract(1, 'd').add(3, 'm').valueOf(),
      stopped: moment(completedDate).subtract(1, 'd').add(28, 'm').valueOf()
    },
    {
      started: moment(completedDate).subtract(30, 'm').valueOf(),
      stopped: moment(completedDate).subtract(10, 'm').valueOf()
    }
  ]
  
  const day1Duration = moment.duration(log[0].stopped - log[0].started)
  const day2Duration = moment.duration(log[1].stopped - log[1].started)
  
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
