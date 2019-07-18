import { shallowMount, createLocalVue } from '@vue/test-utils'
import Task from '@/components/Task.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
const task = { id: 1, name: taskName }
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
  
  it('selects the task when clicked', () => {
  
    wrapper.trigger('click')
    expect(mutations.selectTask).toHaveBeenCalledWith({}, task.id)
    
  })
  
})
