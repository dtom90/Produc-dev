import { createLocalVue, shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Countdown.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('Countdown', () => {
  
  const wrapper = shallowMount(Countdown, { localVue })
  
  it('renders a play button for the timer', () => {
    
    expect(wrapper.find('#play-pause-btn').find(FontAwesomeIcon).isVisible()).toBe(true)
    expect(wrapper.find('#play-pause-btn').find(FontAwesomeIcon).attributes('icon')).toBe('play')
    
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
  })
  
})
