import { shallowMount } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'

describe('TaskList.vue', () => {
  it('renders props.name when passed', () => {
    const name = 'new task'
    const wrapper = shallowMount(TaskList, {
      propsData: { name: name }
    })
    expect(wrapper.text()).toMatch(name)
  })
})
