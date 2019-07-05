import { shallowMount, createLocalVue } from '@vue/test-utils'
import ActiveTask from '@/components/ActiveTask.vue'
import ActivityLog from '@/components/ActivityLog.vue'
import store from '@/store'
import { eventTypes } from '@/constants'
import { FontAwesomeIcon } from '@/font-awesome-icons'

import moment from 'moment'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('ActiveTask', () => {
  
  describe('Incomplete Task', () => {
  
    const task = {
      id: 1,
      name: 'new task 1',
      activity: [{
        type: eventTypes.Created,
        time: Date.now()
      }],
      completed: false
    }
    const wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      localVue
    })
    
    it('renders the task name when passed', () => {
    
      expect(wrapper.text()).toMatch(task.name)
    
    })
    
    it('renders the task activity log', () => {
      
      const renderedActivityLog = wrapper.find(ActivityLog)
      expect(renderedActivityLog.props()).toEqual({ activity: task.activity })
      
    })
    
    it('does not render the task completed date', () => {
  
      expect(wrapper.text()).not.toMatch('Completed:')
      
    })
    
  })
  
  describe('Completed Task', () => {
    
    const completedDate = Date.now()
    const task = {
      id: 1,
      name: 'new task 1',
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
      completed: true
    }
    
    const wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      store,
      localVue
    })
      
    it('renders the task name when passed', () => {
      
      expect(wrapper.text()).toMatch(task.name)
      
    })
    
    it('renders an edit button for changing the task name', () => {
      
      expect(wrapper.find('button.btn-warning').find(FontAwesomeIcon).attributes('icon')).toBe('pencil-alt')
      
    })
    
    it('renders a delete button for removing the task', () => {
      
      expect(wrapper.find('button.btn-danger').find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
      
    })
    
    it('renders "All Activity" and "Daily Activity" display options', () => {
    
      const allViewBtn = wrapper.find('#all-view')
      expect(allViewBtn.text()).toBe('All Activity')
      expect(allViewBtn.find('a').classes()).toContain('active')
    
      const dailyViewBtn = wrapper.find('#daily-view')
      expect(dailyViewBtn.text()).toBe('Daily Activity')
      expect(dailyViewBtn.find('a').classes()).not.toContain('active')
    
    })
  
    it('renders the task activity log', () => {
    
      const renderedActivityLog = wrapper.find(ActivityLog)
      expect(renderedActivityLog.props()).toEqual({ activity: task.activity })
    
    })
    
    // it('renders the daily task activity sequence in reverse-chronological order', async () => {
    //
    //   expect(wrapper.vm.view).toBe('all')
    //   expect(wrapper.find('#viewtype').text()).toBe('all')
    //
    //   const dailyViewBtn = wrapper.find('#daily-view > a')
    //   dailyViewBtn.trigger('click')
    //
    //   expect(wrapper.vm.view).toBe('daily')
    //   expect(wrapper.find('#viewtype').text()).toBe('daily')
    //
    //   const dayLogs = wrapper.findAll('table.day-log')
    //
    //   // expect(dayLogs.at(0).text()).toMatch(
    //   //   'Stopped:  ' + moment(task.activity[2].time).format(EXPECTED_DATETIME_FORMAT) +
    //   //   'Started:  ' + moment(task.activity[1].time).format(EXPECTED_DATETIME_FORMAT) +
    //   //   'Created:  ' + moment(task.activity[0].time).format(EXPECTED_DATETIME_FORMAT)
    //   // )
    //
    //   expect(dayLogs.at(0).text()).toMatch(
    //     'Completed:  ' + moment(task.activity[5].time).format(EXPECTED_DATETIME_FORMAT) +
    //     'Stopped:  ' + moment(task.activity[4].time).format(EXPECTED_DATETIME_FORMAT) +
    //     'Started:  ' + moment(task.activity[3].time).format(EXPECTED_DATETIME_FORMAT)
    //   )
    //
    // })
    
  })
  
})
