import { shallowMount, createLocalVue } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Task from '@/components/Task.vue'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('Task.vue', () => {
  
  it('renders renders the task name', () => {
    
    const taskName = 'new task 1'
    const task = { id: 1, name: taskName }
    
    const wrapper = shallowMount(Task, {
      propsData: { task: task },
      localVue
    })
  
    const li = wrapper.find('li')
    expect(li.text()).toMatch(taskName)
  })
  
})
