import { shallowMount } from '@vue/test-utils'
import ActivityView from '@/components/ActivityView.vue'
import Activity from '@/components/Activity.vue'
import { generateActivity } from './fixtures'
import moment from 'moment'

const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'

const { activity, completedDate } = generateActivity()

const shouldBehaveLikeActivityView = function (wrapper) {
  
  it('renders the task activity log', () => {
    
    const renderedActivity = wrapper.find(Activity)
    expect(renderedActivity.props()).toEqual({ activity, day: null })
    
  })
  
  it('renders "All Activity" and "Daily Activity" display options', () => {
    
    const allViewBtn = wrapper.find('#allView')
    expect(allViewBtn.text()).toBe('All Activity')
    expect(allViewBtn.find('a').classes()).toContain('active')
    
    const dailyViewBtn = wrapper.find('#dailyView')
    expect(dailyViewBtn.text()).toBe('Daily Activity')
    expect(dailyViewBtn.find('a').classes()).not.toContain('active')
    
  })
  
  it('renders the daily task activity logs', async () => {
    
    expect(wrapper.vm.view).toBe('all')
    
    const dailyViewBtn = wrapper.find('#dailyView > a')
    dailyViewBtn.trigger('click')
    
    expect(wrapper.vm.view).toBe('daily')
    
    const activityLogs = wrapper.findAll(Activity)
    expect(activityLogs.at(0).props()).toEqual({ activity: activity.slice(0, 3), day: moment(completedDate).subtract(1, 'd').format(EXPECTED_DAY_KEY_FORMAT) })
    expect(activityLogs.at(1).props()).toEqual({ activity: activity.slice(3, 6), day: moment(completedDate).format(EXPECTED_DAY_KEY_FORMAT) })
    
  })
  
}

describe('ActivityView', () => {
  
  describe('for task', () => {
    
    const wrapper = shallowMount(ActivityView, { propsData: { activity } })
  
    it('does not render a title with the tag name', () => {
    
      expect(wrapper.text()).not.toMatch('Activity for:')
    
    })
  
    shouldBehaveLikeActivityView(wrapper)
    
  })
  
  describe('for tag', () => {
    
    const wrapper = shallowMount(ActivityView, { propsData: { activity, tag: 'myTag' } })
    
    it('renders a title with the tag name', () => {
      
      expect(wrapper.text()).toMatch('Activity for: myTag')
      
    })
  
    shouldBehaveLikeActivityView(wrapper)
    
  })
  
})
