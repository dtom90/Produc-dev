import { eventTypes } from '@/store/constants'
import moment from 'moment'

export function generateActivity () {
  
  const completedDate = moment()
  
  const log = [
    {
      type: eventTypes.Created,
      time: moment(completedDate).subtract(1, 'd').valueOf()
    },
    {
      type: eventTypes.Started,
      time: moment(completedDate).subtract(1, 'd').add(3, 'm').valueOf()
    },
    {
      type: eventTypes.Stopped,
      time: moment(completedDate).subtract(1, 'd').add(28, 'm').valueOf()
    },
    {
      type: eventTypes.Started,
      time: moment(completedDate).subtract(30, 'm').valueOf()
    },
    {
      type: eventTypes.Stopped,
      time: moment(completedDate).subtract(10, 'm').valueOf()
    },
    {
      type: eventTypes.Completed,
      time: completedDate.valueOf()
    }
  ]
  
  const day1Duration = moment.duration(log[2].time - log[1].time)
  const day2Duration = moment.duration(log[4].time - log[3].time)
  
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
    log: [{
      type: eventTypes.Created,
      time: moment.now()
    }],
    tags,
    completed: false
  }
  
}

export function taskWithActivity () {
  
  const task = newTask()
  task.log = generateActivity().log
  task.completed = true
  return task
  
}
