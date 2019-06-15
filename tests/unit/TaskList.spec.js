import { mount, createLocalVue } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCog, faEllipsisH, faPencilAlt, faPlay, faSave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faTrashAlt, faPlay, faSave, faCog, faEllipsisH, faPencilAlt)

const localVue = createLocalVue();
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('TaskList.vue', () => {
  
  const tasks = [
    {id: 1, name: 'new task 1'},
    {id: 2, name: 'new task 2'},
    {id: 3, name: 'new task 3'}
  ]
  let wrapper;
  
  beforeEach(() => {
  
    wrapper = mount(TaskList, {
      propsData: { tasks: tasks },
      localVue
    })
    
  })
  
  it('should have tasks loade into props', () => {
    
    expect(wrapper.props().tasks).toBe(tasks)
  
  })
  
  it('renders tasks in oldest-first order', () => {
  
    wrapper.setData({
      sortOrder: 'Oldest'
    })
  
    expect(wrapper.vm.sortOrder).toBe('Oldest')
    
    const renderedTasks = wrapper.findAll('li')
    renderedTasks.wrappers.forEach((elem, i) => {
      expect(elem.text()).toMatch(tasks[i].name)//'fasdsa'
    })
    
  })
  
  it('renders tasks in newest-first order', () => {
  
    wrapper.setData({
      sortOrder: 'Newest'
    })
    
    const renderedTasks = wrapper.findAll('li')
    renderedTasks.wrappers.forEach((elem, i) => {
      expect(elem.text()).toMatch(tasks[tasks.length-1-i].name)
    })
    
  })
  
})
