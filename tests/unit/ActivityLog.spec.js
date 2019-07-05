import { shallowMount } from '@vue/test-utils'
import ActivityLog from '@/components/ActivityLog.vue'
import { eventTypes } from '@/constants'
import moment from 'moment'

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'

const completedDate = Date.now()

const activity = [
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
]

describe('ActivityLog', () => {
  
  const wrapper = shallowMount(ActivityLog, { propsData: { activity } })
  
  it('renders the time spent on the task', () => {
    
    expect(wrapper.text()).toMatch('Time Spent: an hour')
    
  })
  
  it('renders the task activity sequence in reverse-chronological order', () => {
    
    expect(wrapper.find('#activity-log').text()).toMatch(
      'Completed:  ' + moment(activity[5].time).format(EXPECTED_DATETIME_FORMAT) +
      'Stopped:  ' + moment(activity[4].time).format(EXPECTED_DATETIME_FORMAT) +
      'Started:  ' + moment(activity[3].time).format(EXPECTED_DATETIME_FORMAT) +
      'Stopped:  ' + moment(activity[2].time).format(EXPECTED_DATETIME_FORMAT) +
      'Started:  ' + moment(activity[1].time).format(EXPECTED_DATETIME_FORMAT) +
      'Created:  ' + moment(activity[0].time).format(EXPECTED_DATETIME_FORMAT)
    )
    
  })
  
})
