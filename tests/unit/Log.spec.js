import { shallowMount } from '@vue/test-utils'
import Log from '@/components/Log.vue'
import moment from 'moment'
import { generateActivity } from './fixtures'

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'
const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const { log, day1Duration, day2Duration, completedDate } = generateActivity()
const allDuration = moment.duration(day1Duration + day2Duration)

describe('Log', () => {
  
  describe('Full Log', () => {
    
    const wrapper = shallowMount(Log, { propsData: { log, timeSpent: allDuration } })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: an hour')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Completed:  ' + moment(log[5].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(log[4].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(log[3].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(log[2].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(log[1].time).format(EXPECTED_DATETIME_FORMAT) +
        'Created:  ' + moment(log[0].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 1 Log', () => {
    
    const day = moment(completedDate).subtract(1, 'd')
    
    const wrapper = shallowMount(Log, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      log: log.slice(0, 3),
      timeSpent: day1Duration
    } })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 25 minutes')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Stopped:  ' + moment(log[2].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(log[1].time).format(EXPECTED_DATETIME_FORMAT) +
        'Created:  ' + moment(log[0].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 2 Log', () => {
    
    const day = moment(completedDate)
    
    const wrapper = shallowMount(Log, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      log: log.slice(3, 6),
      timeSpent: day2Duration
    } })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 20 minutes')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Completed:  ' + moment(log[5].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(log[4].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(log[3].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
})
