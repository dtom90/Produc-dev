import { createLocalVue, shallowMount } from '@vue/test-utils'
import notifications from '@/lib/notifications'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'
import storeConfig from '@/store/config'
import { cloneDeep } from 'lodash'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

jest.spyOn(storeConfig.mutations, 'resetRunning')
jest.spyOn(storeConfig.mutations, 'startTask')
jest.spyOn(storeConfig.mutations, 'stopTask')
jest.spyOn(storeConfig.mutations, 'updateActiveMinutes')
jest.spyOn(storeConfig.mutations, 'updateRestMinutes')
jest.spyOn(storeConfig.mutations, 'setTaskInactive')
jest.spyOn(notifications, 'notify').mockImplementation(() => {
})

const delay = t => new Promise(resolve => setTimeout(resolve, t))

const expectedTaskId = 5

describe('Countdown', () => {
  
  let store, wrapper
  
  beforeEach(() => {
    
    store = new Vuex.Store(cloneDeep(storeConfig))
    
    wrapper = shallowMount(Countdown, {
      localVue,
      propsData: { taskId: expectedTaskId },
      store
    })
    expect(storeConfig.mutations.resetRunning).toHaveBeenCalled()
  })
  
  it('renders a play button for the timer', () => {
    
    const playPauseButton = wrapper.find('#play-pause-btn')
    expect(playPauseButton.isVisible()).toBe(true)
    
  })
  
  it('renders the default countdown time of 25 minutes', () => {
    
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    
  })
  
  it('renders a field for adjusting the pomodoro timer when the time is clicked', async () => {
    
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
    expect(wrapper.find('#timer-save-button').exists()).toBe(false)
  
    await wrapper.find('#timer-display').trigger('click')
    
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
    expect(wrapper.find('#timer-save-button').isVisible()).toBe(true)
    
  })
  
  it('should not allow clicking play-pause-btn when editing the timer', async () => {
  
    await wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
    
    expect(wrapper.find('#play-pause-btn').attributes('disabled')).toBe('disabled')
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(storeConfig.mutations.startTask).not.toHaveBeenCalled()
    
  })
  
  it('should call startTask when the play button is clicked, but pausing should not call stopTask', async () => {
  
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(storeConfig.mutations.startTask).toHaveBeenCalledWith(storeConfig.state, { id: expectedTaskId })
  
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(storeConfig.mutations.stopTask).toHaveBeenCalledWith(storeConfig.state, { id: expectedTaskId })
    
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
    await wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.05')
    await wrapper.find('#timer-save-button').trigger('click')
    const expectedState = cloneDeep(storeConfig.state)
    expectedState.activeMinutes = 0.05
    expect(storeConfig.mutations.updateActiveMinutes).toHaveBeenCalledWith(expectedState, { activeMinutes: 0.05 })
    
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
    await wrapper.find('#play-pause-btn').trigger('click')
    
    // Expect the countdown to decrement
    expect(wrapper.vm.secondsRemaining).toBe(3)
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    expect(storeConfig.mutations.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId, running: true })
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    expect(storeConfig.mutations.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId, running: true })
    await delay(1000)
    
    expect(wrapper.vm.active).toBe(false)
    
    expect(storeConfig.mutations.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId })
    expect(storeConfig.mutations.setTaskInactive).toHaveBeenCalledWith(expectedState, undefined)
    
    expect(notifications.notify).toBeCalledWith('Finished Working, Take a Break!')
    
  }, 30000)
  
  it('should notifiy to start working after a break', async () => {
    
    // Skip the active interval
    await wrapper.find('#skip-btn').trigger('click')
    expect(wrapper.vm.active).toBe(false)
    
    // Change timer 3 seconds
    await wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    const timerInput = wrapper.find('input[type="number"]')
    timerInput.setValue('0.05')
    await wrapper.find('#timer-save-button').trigger('click')
    const expectedState = cloneDeep(storeConfig.state)
    expectedState.restMinutes = 0.05
    expect(storeConfig.mutations.updateRestMinutes).toHaveBeenCalledWith(expectedState, { restMinutes: 0.05 })
    expect(wrapper.find('#timer-display').isVisible()).toBe(true)
    expect(wrapper.find('#timer-display').text()).toBe('0:03')
    expect(wrapper.vm.secondsRemaining).toBe(3)
    expect(storeConfig.mutations.stopTask).not.toHaveBeenCalledWith(expectedState, {
      id: expectedTaskId,
      running: true
    })
    
    // Start the break countdown
    await wrapper.find('#play-pause-btn').trigger('click')
    
    // Expect the countdown to decrement
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(2)
    expect(storeConfig.mutations.stopTask).not.toHaveBeenCalledWith(expectedState, {
      id: expectedTaskId,
      running: true
    })
    await delay(1000)
    expect(wrapper.vm.secondsRemaining).toBe(1)
    expect(storeConfig.mutations.stopTask).not.toHaveBeenCalledWith(expectedState, {
      id: expectedTaskId,
      running: true
    })
    await delay(1000)
    
    expect(notifications.notify).toBeCalledWith('Finished Break, Time to Work!')
    
  }, 30000)
  
})
