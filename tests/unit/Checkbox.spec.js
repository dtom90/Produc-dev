import { shallowMount, createLocalVue } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

const mutations = {
  completeTask: jest.fn()
}

const store = new Vuex.Store({
  mutations
})

const taskId = 0

function checkboxWrapper (checked = false) {
  
  return shallowMount(Checkbox, {
    propsData: { checked, taskId },
    localVue,
    store
  })
  
}

describe('Checkbox', () => {
  
  it('renders an empty checkbox', () => {
  
    const wrapper = checkboxWrapper()
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.find('span.check-custom').isVisible()).toBe(true)
    expect(checkboxContainer.find('input[type="checkbox"]').element.checked).toBe(false)
    
  })
  
  it('calls completeTask when the checkbox is clicked', () => {
  
    const wrapper = checkboxWrapper()
    wrapper.find('input[type="checkbox"]').trigger('click')
    expect(mutations.completeTask).toHaveBeenCalledWith({}, taskId)
    
  })
  
  it('renders a checked checkbox', () => {
  
    const wrapper = checkboxWrapper(true)
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.find('span.check-custom').isVisible()).toBe(true)
    expect(checkboxContainer.find('input[type="checkbox"]').element.checked).toBe(true)
    
  })
  
})
