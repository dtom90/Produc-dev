import { createLocalVue, shallowMount } from '@vue/test-utils'
import notifications from '@/lib/notifications'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

jest.spyOn(notifications, 'notify').mockImplementation(() => {})

const delay = t => new Promise(resolve => setTimeout(resolve, t))

const expectedTaskId = 5

describe('Countdown', () => {
  
  let state, mutations, store, wrapper
  
  beforeEach(() => {
    state = {
      continueOnComplete: false
    }
    mutations = {
      startTask: jest.fn(),
      stopTask: jest.fn(),
      setTaskInactive: jest.fn(),
      resetRunning: jest.fn()
    }
    store = new Vuex.Store({
      state,
      mutations
    })
    wrapper = shallowMount(Countdown, {
      localVue,
      propsData: { taskId: expectedTaskId },
      store
    })
    expect(mutations.resetRunning).toHaveBeenCalled()
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
    
    // Check initial state
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    expect(wrapper.vm.activeMinutes).toBe(25)
    expect(wrapper.vm.restMinutes).toBe(5)
    expect(wrapper.vm.secondsRemaining).toBe(1500)
    expect(wrapper.vm.active).toBe(true)
    expect(wrapper.vm.activeIntervalStarted).toBe(false)
    expect(wrapper.vm.countingDown).toBe(false)
    expect(wrapper.vm.overtime).toBe(false)
    expect(wrapper.vm.continueOnComplete).toBe(false)
    
    // Change timer 3 seconds
    wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.05')
    wrapper.find('#timer-save-button').trigger('click')
    
    // Check new state
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('0:03')
    expect(wrapper.vm.activeMinutes).toBe(0.05)
    expect(wrapper.vm.restMinutes).toBe(5)
    expect(wrapper.vm.secondsRemaining).toBe(3)
    expect(wrapper.vm.active).toBe(true)
    expect(wrapper.vm.activeIntervalStarted).toBe(false)
    expect(wrapper.vm.countingDown).toBe(false)
    expect(wrapper.vm.overtime).toBe(false)
    expect(wrapper.vm.continueOnComplete).toBe(false)
    
    expect(notifications.notify).not.toHaveBeenCalled()
    
    // Start the countdown
    wrapper.find('#play-pause-btn').trigger('click')
    
    // Expect the countdown to decrement
    expect(wrapper.vm.secondsRemaining).toBe(3)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    expect(mutations.stopTask).toHaveBeenCalledWith(state, { id: expectedTaskId, running: true })
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    expect(mutations.stopTask).toHaveBeenCalledWith(state, { id: expectedTaskId, running: true })
    await delay(1000)
    
    expect(wrapper.vm.active).toBe(false)
    
    expect(mutations.stopTask).toHaveBeenCalledWith(state, { id: expectedTaskId })
    expect(mutations.setTaskInactive).toHaveBeenCalledWith(state, undefined)
    
    expect(notifications.notify).toBeCalledWith('Finished Working, Take a Break!')
    
  }, 30000)
  
  it('should notifiy to start working after a break', async () => {
    
    // Skip the active interval
    wrapper.find('#skip-btn').trigger('click')
    expect(wrapper.vm.active).toBe(false)
    
    // Change timer 3 seconds
    wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.05')
    wrapper.find('#timer-save-button').trigger('click')
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('0:03')
    expect(wrapper.vm.secondsRemaining).toBe(3)
    expect(mutations.stopTask).not.toHaveBeenCalledWith(state, { id: expectedTaskId, running: true })
    
    // Start the break countdown
    wrapper.find('#play-pause-btn').trigger('click')
    
    // Expect the countdown to decrement
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    expect(mutations.stopTask).not.toHaveBeenCalledWith(state, { id: expectedTaskId, running: true })
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    expect(mutations.stopTask).not.toHaveBeenCalledWith(state, { id: expectedTaskId, running: true })
    await delay(1000)
    
    expect(notifications.notify).toBeCalledWith('Finished Break, Time to Work!')
    
  }, 30000)
  
})
