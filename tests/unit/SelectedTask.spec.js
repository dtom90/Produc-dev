import { shallowMount, createLocalVue } from '@vue/test-utils'
import SelectedTask from '@/components/SelectedTask.vue'
import Checkbox from '@/components/Checkbox.vue'
import ActivityView from '@/components/ActivityView.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'
import { newTask, taskWithActivity } from './fixtures'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const getters = {
  availableTags: () => jest.fn()
}

const mutations = {
  addTaskTag: jest.fn(),
  removeTaskTag: jest.fn(),
  completeTask: jest.fn(),
  deleteTask: jest.fn()
}

const store = new Vuex.Store({
  getters,
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
      expect(renderedActivity.props()).toEqual({ log: task.log, id: 'taskActivity', element: task.name })
      
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
      
      let addTagInput = wrapper.find('#addTagInput')
      const addTagButton = wrapper.find('#addTagButton')
      
      expect(wrapper.text()).toMatch('Tags:')
      expect(addTagButton.find(FontAwesomeIcon).attributes('icon')).toBe('plus')
      expect(addTagInput.exists()).toBe(false)
      
      addTagButton.trigger('click')
      addTagInput = wrapper.find('#addTagInput')
      expect(addTagInput.isVisible()).toBe(true)
      expect(addTagInput.attributes('placeholder')).toBe('add new tag')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('#addTagInput').element).toBe(document.activeElement)
      })
      
    })
    
    it('allows the user to add new tags to the task', () => {
      
      expect(wrapper.findAll('.tag').length).toBe(0)
      
      const addTagInput = wrapper.find('#addTagInput')
      
      addTagInput.setValue('some tag')
      expect(addTagInput.element.value).toBe('some tag')
      expect(wrapper.vm.newTag).toBe('some tag')
      
      addTagInput.trigger('keyup.enter')
      expect(mutations.addTaskTag).toHaveBeenCalledWith({}, { id: task.id, tag: 'some tag' })
      expect(addTagInput.element.value).toBe('')
      
    })
    
    it('renders a delete button for removing the task', () => {
      
      const deleteButton = wrapper.find('button.btn-danger')
      expect(deleteButton.find(FontAwesomeIcon).attributes('icon')).toBe('trash-alt')
      deleteButton.trigger('click')
      expect(mutations.deleteTask).toHaveBeenCalledWith({}, { id: task.id })
      
    })
    
  })
  
  describe('Tagged Task', () => {
  
    const task = newTask(true)
    const wrapper = shallowMount(SelectedTask, {
      propsData: { task: task },
      localVue,
      store
    })
  
    it('allows the user to remove tags from the task', () => {
      
      const tags = wrapper.findAll('.tag')
      
      expect(tags.length).toBe(2)
      expect(tags.at(0).text()).toMatch(task.tags[0])
      expect(tags.at(1).text()).toMatch(task.tags[1])
  
      const removeTagBtn = tags.at(0).findAll('button').at(1)
      expect(removeTagBtn.text()).toEqual('×')
      
      removeTagBtn.trigger('click')
      expect(mutations.removeTaskTag).toHaveBeenCalledWith({}, { id: task.id, tag: task.tags[0] })
      
    })
    
  })
  
  describe('Completed Task', () => {
    
    const task = taskWithActivity()
    const wrapper = shallowMount(SelectedTask, {
      propsData: { task: task },
      localVue
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
      expect(renderedActivity.props()).toEqual({ log: task.log, id: 'taskActivity', element: task.name })
    
    })
    
  })
  
})
