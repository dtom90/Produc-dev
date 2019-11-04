import { createLocalVue, shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const state = {
  continueOnComplete: false
}

const mutations = {
  startTask: jest.fn(),
  stopTask: jest.fn(),
  setTaskInactive: jest.fn()
}

const store = new Vuex.Store({
  state,
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
    
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    
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
    expect(mutations.startTask).toHaveBeenCalledWith(state, { id: expectedTaskId })
    
    wrapper.find('#play-pause-btn').trigger('click')
    expect(mutations.stopTask).toHaveBeenCalledWith(state, { id: expectedTaskId })
    
  })
  
  it('should adjust the timer when input is adjusted', async () => {
    
    wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.05')
    
    wrapper.find('#timer-save-button').trigger('click')
    
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('0:03')
    expect(wrapper.vm.activeMinutes).toBe(0.05)
    expect(wrapper.vm.restMinutes).toBe(5)
    
    expect(wrapper.vm.secondsRemaining).toBe(3)
    expect(wrapper.vm.active).toBe(true)
    expect(wrapper.vm.activeIntervalStarted).toBe(false)
    expect(wrapper.vm.countingDown).toBe(false)
    expect(wrapper.vm.countingUp).toBe(false)
    expect(wrapper.vm.continueOnComplete).toBe(false)
    
    wrapper.find('#play-pause-btn').trigger('click')
    
    expect(wrapper.vm.secondsRemaining).toBe(3)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    await delay(1000)
    
    expect(wrapper.vm.active).toBe(false)
    
    expect(mutations.stopTask).toHaveBeenCalledWith(state, { id: expectedTaskId })
    expect(mutations.setTaskInactive).toHaveBeenCalledWith(state, undefined)
    
  }, 30000)
  
})
