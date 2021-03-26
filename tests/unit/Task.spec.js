import { shallowMount, createLocalVue } from '@vue/test-utils'
import Task from '@/components/Task.vue'
import Checkbox from '@/components/Checkbox.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { newTask, taskWithActivity } from '../fixtures'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const mutations = {
  selectTask: jest.fn()
}

const store = new Vuex.Store({
  mutations
})

const taskName = 'new task 1'
const task = newTask()
const completedTask = taskWithActivity()
let wrapper

describe('Task', () => {
  
  beforeEach(() => {
    wrapper = shallowMount(Task, {
      propsData: { task: task },
      localVue,
      store
    })
  })
  
  it('renders renders the task name', () => {
    
    const li = wrapper.find('li')
    expect(li.text()).toMatch(taskName)
    
  })
  
  it('renders an unchecked checkbox for the task', () => {
    
    const checkbox = wrapper.findComponent(Checkbox)
    expect(checkbox.props()).toEqual({
      checked: false,
      disabled: false,
      taskId: task.id
    })
    
  })
  
  it('renders a checked checkbox for the completed task', () => {
    
    const completedWrapper = shallowMount(Task, {
      propsData: { task: completedTask },
      localVue,
      store
    })
    
    const checkbox = completedWrapper.findComponent(Checkbox)
    expect(checkbox.props()).toEqual({
      checked: true,
      disabled: false,
      taskId: task.id
    })
    
  })
  
  it('selects the task when clicked', () => {
    
    wrapper.trigger('click')
    expect(mutations.selectTask).toHaveBeenCalledWith({}, task.id)
    
  })
  
})
