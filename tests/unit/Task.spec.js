import { shallowMount, createLocalVue } from '@vue/test-utils'
import Task from '@/components/Task.vue'
import store from '@/store'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('Task.vue', () => {
  
  it('renders renders the task name', () => {
    
    const taskName = 'new task 1'
    const task = { id: 1, name: taskName }
    
    const wrapper = shallowMount(Task, {
      propsData: { task: task },
      store,
      localVue
    })
    
    const li = wrapper.find('li')
    expect(li.text()).toMatch(taskName)
  })
  
})
