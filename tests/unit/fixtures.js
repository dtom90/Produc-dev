import { eventTypes } from '@/store/constants'
import moment from 'moment'

export function generateActivity () {
  
  const completedDate = new Date()
  completedDate.setHours(12)
  
  return {
    activity: [
      {
        type: eventTypes.Created,
        time: moment(completedDate).subtract(1, 'd')
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
        time: completedDate
      }
    ],
    completedDate
  }
}
