import { shallowMount, createLocalVue } from '@vue/test-utils'
import ActiveTask from '@/components/ActiveTask.vue'
import store from '@/store'
import { eventTypes } from '@/constants'
import { FontAwesomeIcon } from '@/font-awesome-icons'

import moment from 'moment'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'

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
  
    it('renders the task created date', () => {
    
      expect(wrapper.text()).toMatch('Created:')
      expect(wrapper.text()).toMatch(moment(task.createdDate).format(EXPECTED_DATETIME_FORMAT))
    
    })
  
    it('does not render the task completed date', () => {
  
      expect(wrapper.text()).not.toMatch('Completed:')
      
    })
    
  })
  
  describe('Completed Task', () => {
    
    const createdDate = Date.now()
    const task = {
      id: 1,
      name: 'new task 1',
      activity: [
        {
          type: eventTypes.Created,
          time: createdDate
        },
        {
          type: eventTypes.Started,
          time: moment(createdDate).add(3, 'm').valueOf()
        },
        {
          type: eventTypes.Stopped,
          time: moment(createdDate).add(28, 'm').valueOf()
        },
        {
          type: eventTypes.Started,
          time: moment(createdDate).add(1, 'd').valueOf()
        },
        {
          type: eventTypes.Stopped,
          time: moment(createdDate).add(1, 'd').add(32, 'm').valueOf()
        },
        {
          type: eventTypes.Completed,
          time: moment(createdDate).add(1, 'd').add(40, 'm').valueOf()
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
    
    it('renders the time spent on the task', () => {
      
      expect(wrapper.text()).toMatch('Time Spent: an hour')
      
    })
    
    it('renders "All Activity" and "Daily Activity" display options', () => {
  
      const allViewBtn = wrapper.find('#all-view')
      expect(allViewBtn.text()).toBe('All Activity')
      expect(allViewBtn.find('a').classes()).toContain('active')
  
      const dailyViewBtn = wrapper.find('#daily-view')
      expect(dailyViewBtn.text()).toBe('Daily Activity')
      expect(dailyViewBtn.find('a').classes()).not.toContain('active')
      
    })
    
    it('renders the task activity sequence in reverse-chronological order', () => {
      
      expect(wrapper.text()).toMatch(
        'Completed:  ' + moment(task.activity[5].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(task.activity[4].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(task.activity[3].time).format(EXPECTED_DATETIME_FORMAT) +
        'Stopped:  ' + moment(task.activity[2].time).format(EXPECTED_DATETIME_FORMAT) +
        'Started:  ' + moment(task.activity[1].time).format(EXPECTED_DATETIME_FORMAT) +
        'Created:  ' + moment(task.activity[0].time).format(EXPECTED_DATETIME_FORMAT)
      )
      
    })
    
    it('renders an edit button for changing the task name', () => {
    
      expect(wrapper.find('button.btn-warning').find(FontAwesomeIcon).attributes('icon')).toBe('pencil-alt')
    
    })
  
    it('renders a delete button for removing the task', () => {
    
      expect(wrapper.find('button.btn-danger').find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
    
    })
    
  })
  
})
