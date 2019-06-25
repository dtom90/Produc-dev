import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
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
      createdDate: Date.now(),
      activity: [],
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
      createdDate: Date.now(),
      activity: [
        // {
        //   type: eventTypes.Started,
        //   time: moment(Date.now()).add(3, 'm').toDate()
        // },
        // {
        //   type: eventTypes.Stopped,
        //   time: moment(Date.now()).add(28, 'm').toDate()
        // }
      ],
      completedDate: moment(Date.now()).add(30, 'm').toDate(),
      completed: true
    }
    const wrapper = mount(ActiveTask, {
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
    
    // it('renders the task started date-time', () => {
    //
    //   expect(wrapper.text()).toMatch('Started:')
    //   expect(wrapper.text()).toMatch(moment(task.activity[0].time).format(EXPECTED_DATETIME_FORMAT))
    //
    // })
    //
    // it('renders the task stopped date-time', () => {
    //
    //   expect(wrapper.text()).toMatch('Stopped:')
    //   expect(wrapper.text()).toMatch(moment(task.activity[1].time).format(EXPECTED_DATETIME_FORMAT))
    //
    // })
    
    it('renders the task completed date', () => {
      
      expect(wrapper.text()).toMatch('Completed:')
      expect(wrapper.text()).toMatch(moment(task.completedDate).format(EXPECTED_DATETIME_FORMAT))
      
    })
    
  })
  
})
