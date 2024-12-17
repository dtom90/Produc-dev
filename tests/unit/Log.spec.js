import { createLocalVue, shallowMount } from '@vue/test-utils'
import Log from '@/components/Log.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import moment from 'moment'
import humanizeDuration from 'humanize-duration'
import Vuex from 'vuex'
import { generateActivity } from '../fixtures'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)

const EXPECTED_TIME_FORMAT = 'h:mm A'
const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const DELETE_INTERVAL = '  \n              Delete Interval'

const { log, day1Duration, day2Duration, completedDate } = generateActivity()
const allDuration = moment.duration(day1Duration + day2Duration).asMilliseconds()

describe('Log', () => {
  
  const store = new Vuex.Store({
    state: {
      timeFormat24: false
    }
  })
  
  describe('Activity Log', () => {
    
    const wrapper = shallowMount(Log, {
      propsData: { log: log.slice().reverse(), timeSpent: allDuration },
      localVue,
      store
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch(humanizeDuration(allDuration, {
        units: ['d', 'h', 'm'],
        round: true
      }))
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('.activityLog').text()).toEqual(
        'Started ' + moment(log[3].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[3].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 25 minutes' + DELETE_INTERVAL + '\n' +
        '                  Started ' + moment(log[2].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[2].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 15 minutes' + DELETE_INTERVAL + '\n' +
        '                  Started ' + moment(log[1].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[1].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 25 minutes' + DELETE_INTERVAL + '\n' +
        '                  Started ' + moment(log[0].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[0].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 22 minutes' + DELETE_INTERVAL
      )
      
    })
    
    it('does not render a stopped time when the interval is running', () => {
  
      const startedTime = moment.now()
      const startedWrapper = shallowMount(Log, {
        propsData: {
          log: [{ started: startedTime, stopped: null }], timeSpent: moment.duration(0).asMilliseconds()
        },
        localVue,
        store
      })
  
      expect(startedWrapper.find('.activityLog').text()).toEqual(
        'Started ' + moment(startedTime).format(EXPECTED_TIME_FORMAT) + '  ' +
        'Running ' + moment(startedTime).format(EXPECTED_TIME_FORMAT) + ' ' +
        DELETE_INTERVAL
      )
  
    })
    
  })
  
  describe('Day 1 Log', () => {
  
    const day = moment(completedDate).subtract(1, 'd')
  
    const wrapper = shallowMount(Log, {
      propsData: {
        day: day.format(EXPECTED_DAY_KEY_FORMAT),
        log: [log[0]],
        timeSpent: day1Duration
      },
      localVue,
      store
    })
  
    it('renders the day', () => {
    
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
    
    })
  
    it('renders the time spent on the task', () => {
    
      expect(wrapper.text()).toMatch('Time Spent: 22 minutes')
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('.activityLog').text()).toEqual(
        'Started ' + moment(log[0].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[0].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 22 minutes' + DELETE_INTERVAL
      )
      
    })
    
  })
  
  describe('Day 2 Log', () => {
  
    const day = moment(completedDate)
  
    const wrapper = shallowMount(Log, {
      propsData: {
        day: day.format(EXPECTED_DAY_KEY_FORMAT),
        log: [log[3], log[2]],
        timeSpent: day2Duration
      },
      localVue,
      store
    })
  
    it('renders the day', () => {
    
      expect(wrapper.text()).toMatch(day.format(EXPECTED_DAY_DISPLAY_FORMAT))
    
    })
  
    it('renders the time spent on the task', () => {
    
      expect(wrapper.text()).toMatch(humanizeDuration(day2Duration, {
        units: ['d', 'h', 'm'],
        round: true
      }))
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('.activityLog').text()).toEqual(
        'Started ' + moment(log[3].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[3].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 25 minutes' + DELETE_INTERVAL + '\n' +
        '                  Started ' + moment(log[2].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[2].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 15 minutes' + DELETE_INTERVAL
      )
      
    })
    
  })
  
  describe('Tag Log', () => {
    
    const taskName = 'new task 1'
    const tagLog = log.slice().reverse().map(interval => Object.assign({ task: taskName }, interval))
    const wrapper = shallowMount(Log, {
      propsData: { log: tagLog, timeSpent: allDuration },
      localVue,
      store
    })
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch(humanizeDuration(allDuration, {
        units: ['d', 'h', 'm'],
        round: true
      }))
      
    })
    
    it('renders the task log in reverse-chronological order', () => {
      
      expect(wrapper.find('.activityLog').text()).toEqual(
        taskName +
        ' Started ' + moment(log[3].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[3].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 25 minutes      ' +
        taskName +
        ' Started ' + moment(log[2].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[2].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 15 minutes      ' +
        taskName +
        ' Started ' + moment(log[1].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[1].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 25 minutes      ' +
        taskName +
        ' Started ' + moment(log[0].started).format(EXPECTED_TIME_FORMAT) +
        '  Stopped ' + moment(log[0].stopped).format(EXPECTED_TIME_FORMAT) +
        ' Time Spent: 22 minutes'
      )
      
    })
    
    it('does not render a stopped time when the interval is running', () => {
  
      const startedTime = moment.now()
      const startedWrapper = shallowMount(Log, {
        propsData: {
          log: [{ started: startedTime, stopped: null }], timeSpent: moment.duration(0).asMilliseconds()
        },
        localVue,
        store
      })
  
      expect(startedWrapper.find('.activityLog').text()).toEqual(
        'Started ' + moment(startedTime).format(EXPECTED_TIME_FORMAT) + '  ' +
        'Running ' + moment(startedTime).format(EXPECTED_TIME_FORMAT) + ' ' +
        DELETE_INTERVAL
      )
  
    })
    
  })
  
})
