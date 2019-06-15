import {shallowMount, createLocalVue} from '@vue/test-utils'
import ActiveTask from '@/components/ActiveTask.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCog, faEllipsisH, faPencilAlt, faPlay, faSave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

library.add(faTrashAlt, faPlay, faSave, faCog, faEllipsisH, faPencilAlt)
const localVue = createLocalVue();
localVue.component('font-awesome-icon', FontAwesomeIcon)

import moment from 'moment'

describe('ActiveTask.vue', () => {
  
  const task = {
    id: 1,
    name: 'new task 1',
    createdDate: new Date(),
    completedDate: null,
    completed: false
  }
  let wrapper;
  
  beforeEach(() => {
    
    wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      localVue
    })
    
  })
  
  it('renders the task name when passed', () => {
    
    expect(wrapper.text()).toMatch(task.name)
    
  })
  
  it('renders the task created date', () => {
    
    expect(wrapper.text()).toMatch('Created:')
    expect(wrapper.text()).toMatch(moment(task.createdDate).format('ddd MMM DD YYYY, h:mm a'))
    expect(wrapper.text()).not.toMatch('Completed:')
    
  })
  
})
