import { shallowMount, createLocalVue } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const actions = {
  completeTask: jest.fn()
}

const store = new Vuex.Store({
  actions
})

const taskId = 0

function checkboxWrapper (checked = false) {
  
  return shallowMount(Checkbox, {
    propsData: {
      checked,
      taskId
    },
    localVue,
    store
  })
  
}

describe('Checkbox', () => {
  
  it('renders an empty checkbox', () => {
    
    const wrapper = checkboxWrapper()
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.find('span.check-custom').element).toBeVisible()
    expect(checkboxContainer.find('input[type="checkbox"]').element.checked).toBe(false)
    
  })
  
  it('calls completeTask when the checkbox is clicked', () => {
    
    const wrapper = checkboxWrapper()
    wrapper.find('input[type="checkbox"]').trigger('click')
    expect(actions.completeTask).toHaveBeenCalledWith(expect.anything(), { taskId: taskId })
    
  })
  
  it('renders a checked checkbox', () => {
    
    const wrapper = checkboxWrapper(true)
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.find('span.check-custom').element).toBeVisible()
    expect(checkboxContainer.find('input[type="checkbox"]').element.checked).toBe(true)
    
  })
  
})
