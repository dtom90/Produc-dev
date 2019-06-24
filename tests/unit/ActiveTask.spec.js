import { shallowMount, createLocalVue } from '@vue/test-utils'
import ActiveTask from '@/components/ActiveTask.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faEllipsisH, faPencilAlt, faPlay, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import moment from 'moment'

library.add(faTrashAlt, faPlay, faSave, faCog, faEllipsisH, faPencilAlt)
const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

const EXPECTED_DATETIME_FORMAT = 'ddd MMM DD, h:mm a'

describe('ActiveTask', () => {
  
  describe('Incomplete Task', () => {
  
    const task = {
      id: 1,
      name: 'new task 1',
      createdDate: new Date(),
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
    
    const task = {
      id: 1,
      name: 'new task 1',
      createdDate: new Date(),
      completedDate: moment(new Date()).add(30, 'm').toDate(),
      completed: true
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
    
    it('renders the task completed date', () => {
      
      expect(wrapper.text()).toMatch('Completed:')
      expect(wrapper.text()).toMatch(moment(task.completedDate).format(EXPECTED_DATETIME_FORMAT))
      
    })
    
  })
  
})
