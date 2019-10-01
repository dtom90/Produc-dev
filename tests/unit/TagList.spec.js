import { shallowMount, createLocalVue } from '@vue/test-utils'
import TagList from '@/components/TagList.vue'
import { FontAwesomeIcon } from '@/font-awesome-icons'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const tagValues = ['one tag', 'another tag']

describe('TagList', () => {
  
  const wrapper = shallowMount(TagList, {
    propsData: {
      tags: tagValues,
      removeTag: () => null
    }
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
  
})
