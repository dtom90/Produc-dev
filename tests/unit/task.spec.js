import { shallowMount, createLocalVue } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue();
localVue.component('font-awesome-icon', FontAwesomeIcon)

import Task from '@/components/Task.vue'

describe('Task.vue', () => {
  it('renders props.name when passed', () => {
    const taskName = 'new task 1'
    const task = {id: 1, name: taskName}
    const wrapper = shallowMount(Task, {
      propsData: { task: task },
      localVue
    })
    expect(wrapper.text()).toMatch(taskName)
  })
})
