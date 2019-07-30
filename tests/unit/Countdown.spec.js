import { createLocalVue, shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const mutations = {
  startTask: jest.fn(),
  stopTask: jest.fn()
}

const store = new Vuex.Store({
  mutations
})

const expectedTaskId = 5

describe('Countdown', () => {
  
  const wrapper = shallowMount(Countdown, {
    localVue,
    propsData: { taskId: expectedTaskId },
    store
  })
  
  it('renders a play button for the timer', () => {
    
    const playPauseButton = wrapper.find('#play-pause-btn')
    expect(playPauseButton.find(FontAwesomeIcon).isVisible()).toBe(true)
    expect(playPauseButton.find(FontAwesomeIcon).attributes('icon')).toBe('play')
    
  })
  
  it('renders the default countdown time of 25 minutes', () => {
    
    expect(wrapper.text()).toBe('25:00')
    
  })
  
  it('renders a field for adjusting the pomodoro timer when the time is clicked', () => {
    
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
    
    wrapper.find('#timer-display').trigger('click')
    
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
    
    wrapper.find('#timer-save-button').trigger('click')
    
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
  })
  
  it('should call startTask when the play button is clicked, then stopTask when clicked again', () => {
    
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.startTask).toHaveBeenCalledWith({}, { id: expectedTaskId })
    
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.stopTask).toHaveBeenCalledWith({}, { id: expectedTaskId })
    
  })
  
})
