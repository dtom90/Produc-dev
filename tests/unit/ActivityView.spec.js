import { shallowMount } from '@vue/test-utils'
import ActivityView from '@/components/ActivityView'
import ActivityChart from '@/components/ActivityChart'
import Log from '@/components/Log.vue'
import { generateActivity } from './fixtures'
import moment from 'moment'

const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const { log, day1Duration, day2Duration, completedDate } = generateActivity()
const allDuration = moment.duration(day1Duration + day2Duration)
const day1 = moment(completedDate).subtract(1, 'd')
const day2 = completedDate

const shouldBehaveLikeActivityView = function (wrapper, element) {
  
  it('renders a title with the element name', () => {
    
    expect(wrapper.text()).toMatch('Activity for ' + element)
    
  })
  
  it('renders a chart of the activity', () => {
    
    const activityChart = wrapper.find(ActivityChart)
    expect(activityChart.props('chartData')).toEqual({
      labels: [day1, day2].map(day => day.format(EXPECTED_DAY_DISPLAY_FORMAT)),
      datasets: [{
        label: 'Activity for ' + wrapper.props('element'),
        backgroundColor: '#2020FF',
        data: [day1Duration, day2Duration].map(dur => dur.asMinutes())
      }]
    })
    
  })
  
  it('renders the task log', () => {
    
    const renderedActivity = wrapper.find(Log)
    expect(renderedActivity.props()).toEqual({ log: log, day: null, timeSpent: allDuration })
    
  })
  
  it('renders "All Activity" and "Daily Activity" display options', () => {
    
    const allViewBtn = wrapper.find('#allView')
    expect(allViewBtn.text()).toBe('All Activity')
    expect(allViewBtn.find('a').classes()).toContain('active')
    
    const dailyViewBtn = wrapper.find('#dailyView')
    expect(dailyViewBtn.text()).toBe('Daily Activity')
    expect(dailyViewBtn.find('a').classes()).not.toContain('active')
    
  })
  
  it('renders the daily task logs', async () => {
    
    expect(wrapper.vm.view).toBe('all')
    
    const dailyViewBtn = wrapper.find('#dailyView > a')
    dailyViewBtn.trigger('click')
    
    expect(wrapper.vm.view).toBe('daily')
    
    const activityLogs = wrapper.findAll(Log)
    expect(activityLogs.at(0).props()).toEqual({
      log: log.slice(0, 3),
      day: day1.format(EXPECTED_DAY_KEY_FORMAT),
      timeSpent: day1Duration
    })
    expect(activityLogs.at(1).props()).toEqual({
      log: log.slice(3, 6),
      day: day2.format(EXPECTED_DAY_KEY_FORMAT),
      timeSpent: day2Duration
    })
    
  })
  
}

describe('ActivityView', () => {
  
  describe('for default (task)', () => {
    
    const wrapper = shallowMount(ActivityView, { propsData: { log: log } })
  
    shouldBehaveLikeActivityView(wrapper, '')
    
  })
  
  describe('for tag', () => {
    
    const wrapper = shallowMount(ActivityView, { propsData: { log: log, element: 'myTag' } })
    
    shouldBehaveLikeActivityView(wrapper, 'myTag')
    
  })
  
})
