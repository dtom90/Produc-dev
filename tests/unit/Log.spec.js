import { createLocalVue, shallowMount } from '@vue/test-utils'
import Log from '@/components/Log.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'
import moment from 'moment'
import { generateActivity } from './fixtures'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'
const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const { log, day1Duration, day2Duration, completedDate } = generateActivity()
const allDuration = moment.duration(day1Duration + day2Duration)

describe('Log', () => {
  
  describe('Full Log', () => {
    
    const wrapper = shallowMount(Log, {
      propsData: { log, timeSpent: allDuration },
      localVue
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: an hour')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Started ' + moment(log[1].started).format(EXPECTED_DATETIME_FORMAT) +
        '  Stopped ' + moment(log[1].stopped).format(EXPECTED_DATETIME_FORMAT) +
        ' Started ' + moment(log[0].started).format(EXPECTED_DATETIME_FORMAT) +
        '  Stopped ' + moment(log[0].stopped).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
    it('does not render a stopped time when the interval is running', () => {
      
      const startedTime = moment.now()
      const startedWrapper = shallowMount(Log, { propsData: {
        log: [{ started: startedTime, stopped: null }], timeSpent: moment.duration(0)
      },
      localVue })
      
      expect(startedWrapper.find('#activityLog').text()).toEqual(
        'Started ' + moment(startedTime).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 1 Log', () => {
    
    const day = moment(completedDate).subtract(1, 'd')
    
    const wrapper = shallowMount(Log, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      log: [log[0]],
      timeSpent: day1Duration
    },
    localVue })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 25 minutes')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Started ' + moment(log[0].started).format(EXPECTED_DATETIME_FORMAT) +
        '  Stopped ' + moment(log[0].stopped).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
  describe('Day 2 Log', () => {
    
    const day = moment(completedDate)
    
    const wrapper = shallowMount(Log, { propsData: {
      day: day.format(EXPECTED_DAY_KEY_FORMAT),
      log: [log[1]],
      timeSpent: day2Duration
    },
    localVue })
    
    it('renders the day', () => {
      
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
      
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: 20 minutes')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('#activityLog').text()).toEqual(
        'Started ' + moment(log[1].started).format(EXPECTED_DATETIME_FORMAT) +
        '  Stopped ' + moment(log[1].stopped).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
  })
  
})
