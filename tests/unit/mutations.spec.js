import { expect } from 'chai'
import { mutations } from '@/store'

const { addTaskTag } = mutations

describe('mutations', () => {
  
  it('addTaskTag', () => {
    
    const state = {
      tasks: [
        { id: 0, tags: new Set([]) },
        { id: 1, tags: new Set([]) },
        { id: 2, tags: new Set([]) }
      ],
      tags: {},
      selectedTask: null
    }
    
    addTaskTag(state, { id: 0, tag: 'new tag a' })
    expect(state.tags).to.deep.equal({ 'new tag a': new Set([0]) })
    expect(state.tasks[0].tags).to.deep.equal(new Set(['new tag a']))
    
    addTaskTag(state, { id: 0, tag: 'new tag b' })
    expect(state.tags).to.deep.equal({ 'new tag a': new Set([0]), 'new tag b': new Set([0]) })
    expect(state.tasks[0].tags).to.deep.equal(new Set(['new tag a', 'new tag b']))
    
    addTaskTag(state, { id: 1, tag: 'new tag b' })
    expect(state.tags).to.deep.equal({ 'new tag a': new Set([0]), 'new tag b': new Set([0, 1]) })
    expect(state.tasks[0].tags).to.deep.equal(new Set(['new tag a', 'new tag b']))
    expect(state.tasks[1].tags).to.deep.equal(new Set(['new tag b']))
    
    addTaskTag(state, { id: 2, tag: 'new tag a' })
    expect(state.tags).to.deep.equal({ 'new tag a': new Set([0, 2]), 'new tag b': new Set([0, 1]) })
    expect(state.tasks[0].tags).to.deep.equal(new Set(['new tag a', 'new tag b']))
    expect(state.tasks[1].tags).to.deep.equal(new Set(['new tag b']))
    expect(state.tasks[2].tags).to.deep.equal(new Set(['new tag a']))
    
    // expect duplicate key to fail
    addTaskTag(state, { id: 2, tag: 'new tag a' })
    expect(state.tags).to.deep.equal({ 'new tag a': new Set([0, 2]), 'new tag b': new Set([0, 1]) })
    expect(state.tasks[0].tags).to.deep.equal(new Set(['new tag a', 'new tag b']))
    expect(state.tasks[1].tags).to.deep.equal(new Set(['new tag b']))
    expect(state.tasks[2].tags).to.deep.equal(new Set(['new tag a']))
  })
  
})
