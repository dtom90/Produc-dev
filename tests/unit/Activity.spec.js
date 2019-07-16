import { shallowMount } from '@vue/test-utils'
import Activity from '@/components/Activity.vue'
import moment from 'moment'
import { generateActivity } from './fixtures'

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'
const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const { activity, completedDate } = generateActivity()

describe('SelectedTask', () => {
  
  describe('All Activity', () => {
    
    const wrapper = shallowMount(Activity, { propsData: { activity } })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: an hour')
      
    })
    
    it('renders the task activity sequence in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toMatch(
        'Completed:  ' + moment(activity[5].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(activity[4].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(activity[3].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(activity[2].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(activity[1].time).format(EXPECTED_DATETIME_FORMAT) +
        'Created:  ' + moment(activity[0].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 1 Activity', () => {
    
    const day = moment(completedDate).subtract(1, 'd')
    
    const wrapper = shallowMount(Activity, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      activity: activity.slice(0, 3)
    } })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 25 minutes')
      
    })
    
    it('renders the task activity sequence in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toMatch(
        'Stopped:  ' + moment(activity[2].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(activity[1].time).format(EXPECTED_DATETIME_FORMAT) +
        'Created:  ' + moment(activity[0].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 2 Activity', () => {
    
    const day = moment(completedDate)
    
    const wrapper = shallowMount(Activity, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      activity: activity.slice(3, 6)
    } })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 20 minutes')
      
    })
    
    it('renders the task activity sequence in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toMatch(
        'Completed:  ' + moment(activity[5].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(activity[4].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(activity[3].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
})
