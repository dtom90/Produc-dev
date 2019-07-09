import { shallowMount, createLocalVue } from '@vue/test-utils'
// import Vuex from 'vuex'
import ActiveTask from '@/components/ActiveTask.vue'
import ActivityLog from '@/components/ActivityLog.vue'
import { eventTypes } from '@/constants'
import { FontAwesomeIcon } from '@/font-awesome-icons'

import moment from 'moment'

const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'

const localVue = createLocalVue()
// localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('ActiveTask', () => {
  
  describe('Incomplete Task', () => {
    
    const task = {
      id: 1,
      name: 'new task 1',
      activity: [{
        type: eventTypes.Created,
        time: Date.now()
      }],
      completed: false
    }
    
    // const getters = {
    //   availableTags: state => jest.fn()
    // }
    //
    // const mutations = {
    //   addTaskTag: jest.fn()
    // }
    //
    // const store = new Vuex.Store({
    //   mutations
    // })
    
    const wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      localVue
      // store
    })
    
    it('renders the task name when passed', () => {
    
      expect(wrapper.text()).toMatch(task.name)
    
    })
    
    it('renders the task activity log', () => {
      
      const renderedActivityLog = wrapper.find(ActivityLog)
      expect(renderedActivityLog.props()).toEqual({ activity: task.activity, day: null })
      
    })
    
    it('does not render the task completed date', () => {
  
      expect(wrapper.text()).not.toMatch('Completed:')
      
    })
    
    it('renders the task name when passed', () => {
    
      expect(wrapper.text()).toMatch(task.name)
    
    })
    
    it('renders an edit button for changing the task name', () => {
    
      expect(wrapper.find('button.btn-warning').find(FontAwesomeIcon).attributes('icon')).toBe('pencil-alt')
    
    })
    
    it('renders an renders an input field for adding tags to the task', () => {
    
      expect(wrapper.text()).toMatch('Tags:')
      expect(wrapper.find('input[type="text"]#add-tag').attributes('placeholder')).toBe('add new tag')
      expect(wrapper.findAll('.tag').length).toBe(0)
      
    })

    // it('allows the user to add new tags to the task', () => {
    //
    //   expect(wrapper.findAll('.tag').length).toBe(0)
    //
    //   const textInput = wrapper.find('#add-tag')
    //
    //   textInput.setValue('some tag')
    //   expect(textInput.element.value).toBe('some tag')
    //   expect(wrapper.vm.newTag).toBe('some tag')
    //
    //   // textInput.trigger('keydown.enter')
    //   // textInput.trigger('keydown', { key: 'Enter' })
    //   // expect(mutations.addTaskTag).toHaveBeenCalled()
    //   // expect(textInput.element.value).toBe('')
    //
    // })
    
    it('renders a delete button for removing the task', () => {
    
      expect(wrapper.find('button.btn-danger').find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
    
    })
    
    it('renders "All Activity" and "Daily Activity" display options', () => {
    
      const allViewBtn = wrapper.find('#all-view')
      expect(allViewBtn.text()).toBe('All Activity')
      expect(allViewBtn.find('a').classes()).toContain('active')
    
      const dailyViewBtn = wrapper.find('#daily-view')
      expect(dailyViewBtn.text()).toBe('Daily Activity')
      expect(dailyViewBtn.find('a').classes()).not.toContain('active')
    
    })
    
  })
  
  describe('Completed Task', () => {
    
    const completedDate = new Date()
    completedDate.setHours(12)
    const task = {
      id: 1,
      name: 'new task 1',
      activity: [
        {
          type: eventTypes.Created,
          time: moment(completedDate).subtract(1, 'd')
        },
        {
          type: eventTypes.Started,
          time: moment(completedDate).subtract(1, 'd').add(3, 'm').valueOf()
        },
        {
          type: eventTypes.Stopped,
          time: moment(completedDate).subtract(1, 'd').add(28, 'm').valueOf()
        },
        {
          type: eventTypes.Started,
          time: moment(completedDate).subtract(30, 'm').valueOf()
        },
        {
          type: eventTypes.Stopped,
          time: moment(completedDate).subtract(10, 'm').valueOf()
        },
        {
          type: eventTypes.Completed,
          time: completedDate
        }
      ],
      completed: true
    }
    
    const wrapper = shallowMount(ActiveTask, {
      propsData: { task: task },
      localVue
    })
  
    it('renders the task activity log', () => {
    
      const renderedActivityLog = wrapper.find(ActivityLog)
      expect(renderedActivityLog.props()).toEqual({ activity: task.activity, day: null })
    
    })
    
    it('renders the daily task activity logs', async () => {

      expect(wrapper.vm.view).toBe('all')

      const dailyViewBtn = wrapper.find('#daily-view > a')
      dailyViewBtn.trigger('click')

      expect(wrapper.vm.view).toBe('daily')

      const activityLogs = wrapper.findAll(ActivityLog)
      expect(activityLogs.at(0).props()).toEqual({ activity: task.activity.slice(0, 3), day: moment(completedDate).subtract(1, 'd').format(EXPECTED_DAY_KEY_FORMAT) })
      expect(activityLogs.at(1).props()).toEqual({ activity: task.activity.slice(3, 6), day: moment(completedDate).format(EXPECTED_DAY_KEY_FORMAT) })
      
    })
    
  })
  
})
