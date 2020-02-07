import { createLocalVue, shallowMount } from '@vue/test-utils'
import AllActivityModal from '@/components/AllActivityModal'
import ActivityView from '@/components/ActivityView'
import { generateActivity } from '../fixtures'
import Vuex from 'vuex'

const { log } = generateActivity()

const localVue = createLocalVue()
localVue.use(Vuex)

let wrapper, store

describe('AllActivityModal', () => {
  
  // add this before each
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        allActivity: () => log
      }
    })
    
    wrapper = shallowMount(AllActivityModal, {
      localVue,
      store
    })
  })
  
  it('should render the modal title with "All Activity"', () => {
    
    expect(wrapper.find('.modal-title').text()).toBe('All Activity')
    
  })
  
  it('should display an ActivityView in the modal body with the correct element and log', () => {
    
    expect(wrapper.find('.modal-body').find(ActivityView).props()).toEqual({
      element: 'All Activity',
      log,
      id: 'allActivity',
      taskId: null,
      manualInput: false
    })
    
  })
  
})
