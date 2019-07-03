import { shallowMount, createLocalVue } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'
import Task from '@/components/Task.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faSave, faSort, faBars, faCog, faEllipsisH, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt, faSave, faSort, faBars, faCog, faEllipsisH, faPencilAlt)

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)

const tasks = [
  { id: 1, name: 'new task 1' },
  { id: 2, name: 'new task 2' },
  { id: 3, name: 'new task 3' }
]

const titles = [
  ['To Do', ['Newest', 'Oldest']],
  ['Done', ['Recent', 'Oldest']]
]

describe('TaskList', () => {
  
  describe.each(titles)('%s', (title, expectedSortingOptions) => {
    
    // Expect title to default to 'To Do List'
    const titleProps = title === 'To Do List' ? {} : { title }
    
    const wrapper = shallowMount(TaskList, {
      propsData: Object.assign(titleProps, { tasks: tasks }),
      localVue
    })
    
    it(`should have the title "${title}"`, () => {
      
      expect(wrapper.props().title).toBe(title)
      expect(wrapper.find('h3').text()).toBe(title)
      
    })
    
    it('should have tasks loaded into props', () => {
      
      expect(wrapper.props().tasks).toBe(tasks)
      
    })
    
    it('should have the correct soring options', () => {
      
      const sortingOptions = wrapper.findAll('option')
      expect(sortingOptions.length).toBe(expectedSortingOptions.length)
      sortingOptions.wrappers.forEach((sortingOption, i) => {
        expect(sortingOption.text()).toBe(expectedSortingOptions[i])
      })
      
    })
    
    it(`should default sorting to ${expectedSortingOptions[0]}-first order`, () => {
      
      const sortOrder = expectedSortingOptions[0]
      
      expect(wrapper.vm.sortOrder).toBe(sortOrder)
      
      const renderedTasks = wrapper.findAll(Task)
      expect(renderedTasks.length).toBe(tasks.length)
      renderedTasks.wrappers.forEach((renderedTask, i) => {
        const index = sortOrder === 'Oldest' ? i : tasks.length - 1 - i
        expect(renderedTask.props().task.name).toMatch(tasks[index].name)
      })
      
    })
    
    it(`should sort in ${expectedSortingOptions[1]}-first order`, () => {
      
      const sortOrder = expectedSortingOptions[1]
      
      wrapper.setData({
        sortOrder: sortOrder
      })
      expect(wrapper.vm.sortOrder).toBe(sortOrder)
      
      const renderedTasks = wrapper.findAll(Task)
      expect(renderedTasks.length).toBe(tasks.length)
      renderedTasks.wrappers.forEach((renderedTask, i) => {
        const index = sortOrder === 'Oldest' ? i : tasks.length - 1 - i
        expect(renderedTask.props().task.name).toMatch(tasks[index].name)
      })
      
    })
    
  })
  
})
