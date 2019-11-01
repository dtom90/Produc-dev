import { shallowMount, createLocalVue } from '@vue/test-utils'
import SelectedTask from '@/components/SelectedTask.vue'
import Checkbox from '@/components/Checkbox.vue'
import TagList from '@/components/TagList.vue'
import ActivityView from '@/components/ActivityView.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import { newTask, taskWithActivity } from '../fixtures'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const state = { tags: {} }

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
      store,
      attachToDocument: true
    })
    
    it('renders an unchecked checkbox', () => {
      
      const checkbox = wrapper.find(Checkbox)
      expect(checkbox.props()).toEqual({
        checked: false,
        taskId: task.id
      })
      
    })
    
    it('renders the task name when passed', () => {
    
      expect(wrapper.text()).toMatch(task.name)
    
    })
    
    it('renders the task log', () => {
      
      const renderedActivity = wrapper.find(ActivityView)
      expect(renderedActivity.props()).toEqual({ log: task.log, id: 'taskActivity', element: task.name, manualInput: true, taskId: task.id })
      
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
    
    it('renders a delete button for removing the task', () => {
      
      const deleteButton = wrapper.find('button.btn-danger')
      expect(deleteButton.find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
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
      
      const tagList = wrapper.find(TagList)
      expect(tagList.props()).toEqual(
        expect.objectContaining({
          tagList: task.tags,
          selectText: 'View tag activity',
          modal: true,
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
      
      const checkbox = wrapper.find(Checkbox)
      expect(checkbox.props()).toEqual({
        checked: true,
        taskId: task.id
      })
      
    })
    
    it('renders the task activity views', () => {
    
      const renderedActivity = wrapper.find(ActivityView)
      expect(renderedActivity.props()).toEqual({ log: task.log, id: 'taskActivity', element: task.name, manualInput: false, taskId: task.id })
    
    })
    
  })
  
})
