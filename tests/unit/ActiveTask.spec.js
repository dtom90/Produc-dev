import { shallowMount, createLocalVue } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue();
localVue.component('font-awesome-icon', FontAwesomeIcon)

import ActiveTask from '@/components/ActiveTask.vue'

import moment from 'moment'

describe('ActiveTask.vue', () => {
  
  it('renders props.name when passed', () => {
    const task = {
      id: 1, 
      name: 'new task 1', 
      createdDate: new Date()
    }
    const wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      localVue
    })
    expect(wrapper.text()).toMatch(task.name)
    expect(wrapper.text()).toMatch('Created:')
    expect(wrapper.text()).toMatch(moment(task.createdDate).format('ddd MMM DD YYYY, h:mm a'))
  })
  
})
