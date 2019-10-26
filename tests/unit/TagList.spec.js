import { shallowMount, createLocalVue } from '@vue/test-utils'
import TagList from '@/components/TagList.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'
import Vuex from 'vuex'
import colorManager from 'color-manager'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const tagValues = ['one tag', 'another tag']
const state = {
  tags: {
    'one tag': colorManager.getRandomColor(),
    'another tag': colorManager.getRandomColor()
  }
}

const getters = {
  availableTags: () => jest.fn()
}

const mutations = {
  addTaskTag: jest.fn(),
  removeTaskTag: jest.fn()
}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

const taskId = 0

describe('TagList', () => {
  
  const wrapper = shallowMount(TagList, {
    propsData: {
      tags: tagValues,
      taskId,
      removeTag: () => null
    },
    localVue,
    store
  })
  
  it('allows the user to remove tags from the task', () => {
    
    const tags = wrapper.findAll('.tag')
    
    expect(tags.length).toBe(2)
    expect(tags.at(0).text()).toMatch(tagValues[0])
    expect(tags.at(1).text()).toMatch(tagValues[1])
    
    const removeTagBtn = tags.at(0).findAll('button').at(1)
    expect(removeTagBtn.text()).toEqual('×')
    
    // removeTagBtn.trigger('click')
    // expect(mutations.removeTaskTag).toHaveBeenCalledWith({}, { id: task.id, tag: task.tags[0] })
    
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
    
    expect(wrapper.findAll('.tag').length).toBe(2)
    
    const addTagInput = wrapper.find('#addTagInput')
    
    addTagInput.setValue('some tag')
    expect(addTagInput.element.value).toBe('some tag')
    expect(wrapper.vm.newTag).toBe('some tag')
    
    addTagInput.trigger('keyup.enter')
    expect(mutations.addTaskTag).toHaveBeenCalledWith(state, { id: taskId, tag: 'some tag' })
    expect(addTagInput.element.value).toBe('')
    
  })
  
})
