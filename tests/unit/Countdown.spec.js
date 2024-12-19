import { createLocalVue, shallowMount } from '@vue/test-utils'
import notifications from '@/lib/notifications'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'
// import storeConfig from '@/store/config'
import { cloneDeep } from 'lodash'
import initialState from '../../src/store/initialState'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

jest.spyOn(notifications, 'notify').mockImplementation(() => {
})

const state = cloneDeep(initialState)

const getters = {
  notificationsEnabled: () => true
}

const actions = {
  startTask: jest.fn(),
  stopTask: jest.fn()
}

const mutations = {
  resetRunning: jest.fn(),
  setTaskInactive: jest.fn()
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

// const delay = t => new Promise(resolve => setTimeout(resolve, t))

const expectedTaskId = '5'

describe('Countdown', () => {
  
  let wrapper
  
  beforeEach(() => {
    
    // store = new Vuex.Store(cloneDeep(storeConfig))
    
    wrapper = shallowMount(Countdown, {
      propsData: { taskId: expectedTaskId },
      localVue,
      store
    })
    expect(mutations.resetRunning).toHaveBeenCalled()
  })
  
  it('renders a play button for the timer', () => {
    
    const playPauseButton = wrapper.find('#play-pause-btn')
    expect(playPauseButton.element).toBeVisible()
    
  })
  
  it('renders the default countdown time of 25 minutes', () => {
    
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    
  })
  
  it('renders a field for adjusting the pomodoro timer when the time is clicked', async () => {
    
    expect(wrapper.find('#timer-display').element).toBeVisible()
    expect(wrapper.find('#timer-display').text()).toBe('25:00')
    expect(wrapper.find('#edit-wrapper > input[type="number"]').exists()).toBe(false)
    expect(wrapper.find('#timer-save-button').exists()).toBe(false)
  
    await wrapper.find('#timer-display').trigger('click')
    
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('#edit-wrapper > input[type="number"]').element).toBeVisible()
    expect(wrapper.find('#edit-wrapper > input[type="number"]').element.value).toBe('25')
    expect(wrapper.find('#timer-save-button').element).toBeVisible()
    
  })
  
  it('should not allow clicking play-pause-btn when editing the timer', async () => {
  
    await wrapper.find('#timer-display').trigger('click')
    expect(wrapper.find('#timer-display').exists()).toBe(false)
    expect(wrapper.find('#edit-wrapper > input[type="number"]').element).toBeVisible()
    expect(wrapper.find('#edit-wrapper > input[type="number"]').element.value).toBe('25')
    
    expect(wrapper.find('#play-pause-btn').attributes('disabled')).toBe('disabled')
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(actions.startTask).not.toHaveBeenCalled()
    
  })
  
  it('should call startTask when the play button is clicked', async () => {
  
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(actions.startTask).toHaveBeenCalledWith(expect.anything(), { taskId: expectedTaskId })
  
  })
  
  it('should call stopTask when running', async () => {
  
    state.active = true
    state.running = true
    await wrapper.find('#play-pause-btn').trigger('click')
    expect(actions.stopTask).toHaveBeenCalled()
    
  })
  
  // it('should adjust the timer when input is adjusted', async () => {
  //
  //   // Check initial state
  //   expect(wrapper.find('#timer-display').element).toBeVisible()
  //   expect(wrapper.find('#timer-display').text()).toBe('25:00')
  //   expect(wrapper.vm.activeMinutes).toBe(25)
  //   expect(wrapper.vm.restMinutes).toBe(5)
  //   expect(wrapper.vm.secondsRemaining).toBe(1500)
  //   expect(wrapper.vm.active).toBe(true)
  //   expect(wrapper.vm.activeIntervalStarted).toBe(false)
  //   expect(wrapper.vm.overtime).toBe(false)
  //   expect(wrapper.vm.continueOnComplete).toBe(false)
  //
  //   // Change timer 3 seconds
  //   await wrapper.find('#timer-display').trigger('click')
  //   // expect(wrapper.find('#edit-wrapper > input[type="number"]').element).toBeVisible()
  //   const timerInput = wrapper.find('#edit-wrapper > input[type="number"]')
  //   timerInput.setValue('0.05')
  //   await wrapper.find('#timer-save-button').trigger('click')
  //   const expectedState = cloneDeep(state)
  //   expectedState.activeMinutes = 0.05
  //   expect(mutations.updateSetting).toHaveBeenCalledWith(expectedState, { activeMinutes: 0.05 })
  //
  //   // Check new state
  //   expect(wrapper.find('#timer-display').element).toBeVisible()
  //   expect(wrapper.find('#timer-display').text()).toBe('0:03')
  //   expect(wrapper.vm.activeMinutes).toBe(0.05)
  //   expect(wrapper.vm.restMinutes).toBe(5)
  //   expect(wrapper.vm.secondsRemaining).toBe(3)
  //   expect(wrapper.vm.active).toBe(true)
  //   expect(wrapper.vm.activeIntervalStarted).toBe(false)
  //   expect(wrapper.vm.overtime).toBe(false)
  //   expect(wrapper.vm.continueOnComplete).toBe(false)
  //
  //   expect(notifications.notify).not.toHaveBeenCalled()
  //
  //   // Start the countdown
  //   await wrapper.find('#play-pause-btn').trigger('click')
  //
  //   // Expect the countdown to decrement
  //   expect(wrapper.vm.secondsRemaining).toBe(3)
  //   await delay(1000)
  //   expect(wrapper.vm.secondsRemaining).toBe(2)
  //   expect(actions.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId, running: true })
  //   await delay(1000)
  //   expect(wrapper.vm.secondsRemaining).toBe(1)
  //   expect(actions.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId, running: true })
  //   await delay(1000)
  //
  //   expect(wrapper.vm.active).toBe(false)
  //
  //   expect(actions.stopTask).toHaveBeenCalledWith(expectedState, { id: expectedTaskId })
  //   expect(mutations.setTaskInactive).toHaveBeenCalledWith(expectedState, undefined)
  //
  //   expect(notifications.notify).toBeCalledWith('Finished Working, Take a Break!')
  //
  // }, 30000)
  //
  // it('should notifiy to start working after a break', async () => {
  //
  //   // Skip the active interval
  //   await wrapper.find('#skip-btn').trigger('click')
  //   expect(wrapper.vm.active).toBe(false)
  //
  //   // Change timer 3 seconds
  //   await wrapper.find('#timer-display').trigger('click')
  //   // expect(wrapper.find('#edit-wrapper > input[type="number"]').element).toBeVisible()
  //   const timerInput = wrapper.find('#edit-wrapper > input[type="number"]')
  //   timerInput.setValue('0.05')
  //   await wrapper.find('#timer-save-button').trigger('click')
  //   const expectedState = cloneDeep(state)
  //   expectedState.restMinutes = 0.05
  //   expect(mutations.updateSetting).toHaveBeenCalledWith(expectedState, { restMinutes: 0.05 })
  //   expect(wrapper.find('#timer-display').element).toBeVisible()
  //   expect(wrapper.find('#timer-display').text()).toBe('0:03')
  //   expect(wrapper.vm.secondsRemaining).toBe(3)
  //   expect(actions.stopTask).not.toHaveBeenCalledWith(expectedState, {
  //     id: expectedTaskId,
  //     running: true
  //   })
  //
  //   // Start the break countdown
  //   await wrapper.find('#play-pause-btn').trigger('click')
  //
  //   // Expect the countdown to decrement
  //   await delay(1000)
  //   expect(wrapper.vm.secondsRemaining).toBe(2)
  //   expect(actions.stopTask).not.toHaveBeenCalledWith(expectedState, {
  //     id: expectedTaskId,
  //     running: true
  //   })
  //   await delay(1000)
  //   expect(wrapper.vm.secondsRemaining).toBe(1)
  //   expect(actions.stopTask).not.toHaveBeenCalledWith(expectedState, {
  //     id: expectedTaskId,
  //     running: true
  //   })
  //   await delay(1000)
  //
  //   expect(notifications.notify).toBeCalledWith('Finished Break, Time to Work!')
  //
  // }, 30000)
  
})
