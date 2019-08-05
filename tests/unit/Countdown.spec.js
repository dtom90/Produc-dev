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

const delay = t => new Promise(resolve => setTimeout(resolve, t))

const expectedTaskId = 5

describe('Countdown', () => {
  
  let wrapper
  
  beforeEach(() => {
    wrapper = shallowMount(Countdown, {
      localVue,
      propsData: { taskId: expectedTaskId },
      store
    })
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
    expect(wrapper.find('#timer-save-button').exists()).toBe(false)
    
    wrapper.find('#timer-display').trigger('click')
    
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
    expect(wrapper.find('#timer-save-button').isVisible()).toBe(true)
    
  })
  
  it('should not allow clicking play-pause-btn when editing the timer', () => {
    
    wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
    
    expect(wrapper.find('#play-pause-btn').attributes('disabled')).toBe('disabled')
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.startTask).not.toHaveBeenCalled()
    
  })
  
  it('should call startTask when the play button is clicked, but pausing should not call stopTask', () => {
    
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.startTask).toHaveBeenCalledWith({}, { id: expectedTaskId })
    
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.stopTask).toHaveBeenCalledWith({}, { id: expectedTaskId, timeSpent: 0 })
    
  })
  
  it('should adjust the timer when input is adjusted', async () => {
    
    wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.1')
    
    wrapper.find('#timer-save-button').trigger('click')
    
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('0:06')
  
    wrapper.find('#play-pause-btn').trigger('click')
    
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(5)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(4)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(3)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    await delay(1000)
    expect(mutations.stopTask).toHaveBeenCalledWith({}, { id: expectedTaskId, timeSpent: 6000 })
    
  }, 30000)
  
})
