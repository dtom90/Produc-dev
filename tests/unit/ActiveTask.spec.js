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
      completedDate: null,
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
        }
      ],
      completedDate: moment(createdDate).add(30, 'm').valueOf(),
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
    
    it('renders the task created date', () => {
      
      expect(wrapper.text()).toMatch('Created:  ' + moment(task.activity[0].time).format(EXPECTED_DATETIME_FORMAT))
      
    })
    
    it('renders the task started date-time', () => {

      expect(wrapper.text()).toMatch('Started:  ' + moment(task.activity[1].time).format(EXPECTED_DATETIME_FORMAT))

    })

    it('renders the task stopped date-time', () => {

      expect(wrapper.text()).toMatch('Stopped:  ' + moment(task.activity[2].time).format(EXPECTED_DATETIME_FORMAT))

    })
    
    it('renders the task completed date', () => {
      
      expect(wrapper.text()).toMatch('Completed:  ' + moment(task.completedDate).format(EXPECTED_DATETIME_FORMAT))
      
    })
  
    it('renders an edit button for changing the task name', () => {
    
      expect(wrapper.find('button.btn-warning').find(FontAwesomeIcon).attributes('icon')).toBe('pencil-alt')
    
    })
  
    it('renders a delete button for removing the task', () => {
    
      expect(wrapper.find('button.btn-danger').find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
    
    })
    
  })
  
})
