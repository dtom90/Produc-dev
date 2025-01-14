import { shallowMount, createLocalVue } from '@vue/test-utils'
import SelectedTask from '@/components/SelectedTask.vue'
import Checkbox from '@/components/Checkbox.vue'
import TagList from '@/components/TagList.vue'
import ActivityView from '@/components/ActivityView.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import { newTask, taskWithActivity } from '../fixtures'
import Vuex from 'vuex'
import { ButtonPlugin } from 'bootstrap-vue'
import { cloneDeep } from 'lodash'
import initialState from '../../src/store/initialState'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)
localVue.use(ButtonPlugin)

const state = cloneDeep(initialState)

const mutations = {
  deleteTask: jest.fn()
}

const store = new Vuex.Store({
  state,
  mutations
})

describe('SelectedTask', () => {
  
  describe('Incomplete Task', () => {
    
    const task = newTask()
    const wrapper = shallowMount(SelectedTask, {
      propsData: { task: task },
      localVue,
      store
    })
    
    it('renders an unchecked checkbox', () => {
      
      const checkbox = wrapper.findComponent(Checkbox)
      expect(checkbox.props()).toEqual({
        checked: false,
        disabled: false,
        taskId: task.id
      })
      
    })
    
    it('renders the task name when passed', () => {
      
      expect(wrapper.text()).toMatch(task.name)
      
    })
    
    it('renders the task log', () => {
      
      const renderedActivity = wrapper.findComponent(ActivityView)
      expect(renderedActivity.props()).toEqual({
        log: task.log,
        id: 'taskActivity',
        element: task.name,
        taskId: task.id
      })
      
    })
    
    it('does not render the task completed date', () => {
      
      expect(wrapper.text()).not.toMatch('Completed:')
      
    })
    
    it('renders the task name when passed', () => {
      
      expect(wrapper.text()).toMatch(task.name)
      
    })
    
    it('renders a delete button for removing the task', () => {
      
      const deleteButton = wrapper.find('[title="Delete task"]')
      deleteButton.trigger('click')
      expect(mutations.deleteTask).toHaveBeenCalledWith(state, { id: task.id })
      
    })
    
  })
  
  describe('Tagged Task', () => {
    
    const task = newTask(true)
    const wrapper = shallowMount(SelectedTask, {
      propsData: { task: task },
      localVue,
      store
    })
    
    it('renders a TagList', () => {
      
      const tagList = wrapper.findComponent(TagList)
      expect(tagList.props()).toEqual(
        expect.objectContaining({
          tagList: task.tags,
          selectText: 'View tag activity',
          isModal: true,
          removeText: 'Remove tag from task'
        })
      )
      
    })
    
  })
  
  describe('Completed Task', () => {
    
    const task = taskWithActivity()
    const wrapper = shallowMount(SelectedTask, {
      propsData: { task: task },
      localVue,
      store
    })
    
    it('renders a checked checkbox', () => {
      
      const checkbox = wrapper.findComponent(Checkbox)
      expect(checkbox.props()).toEqual({
        checked: true,
        disabled: false,
        taskId: task.id
      })
      
    })
    
    it('renders the task activity views', () => {
      
      const renderedActivity = wrapper.findComponent(ActivityView)
      expect(renderedActivity.props()).toEqual({
        log: task.log,
        id: 'taskActivity',
        element: task.name,
        taskId: task.id
      })
      
    })
    
  })
  
})
