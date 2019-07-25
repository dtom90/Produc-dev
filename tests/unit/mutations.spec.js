import { expect } from 'chai'
import { mutations } from '@/store'
import { eventTypes } from '@/store/constants'

const { addTaskEvent, addTaskTag } = mutations

describe('mutations', () => {
  
  let state
  let origState
  
  beforeEach(() => {
    
    state = {
      tasks: [
        { id: 0, tags: [], log: [] },
        { id: 1, tags: [], log: [] },
        { id: 2, tags: [], log: [] }
      ],
      tags: {},
      selectedTask: null
    }
    origState = JSON.parse(JSON.stringify(state))
    
  })
  
  describe('addTaskEvent', () => {
    
    it('should add valid task events to the task', () => {
      
      addTaskEvent(state, {
        id: 0,
        type: eventTypes.Created
      })
      const createdEvent = { type: eventTypes.Created, time: Date.now() }
      expect(state.tasks[0].log).to.deep.equal([createdEvent])
  
      addTaskEvent(state, {
        id: 0,
        type: eventTypes.Started
      })
      const startedEvent = { type: eventTypes.Started, time: Date.now() }
      expect(state.tasks[0].log).to.deep.equal([createdEvent, startedEvent])
  
      addTaskEvent(state, {
        id: 0,
        type: eventTypes.Stopped
      })
      const stoppedEvent = { type: eventTypes.Stopped, time: Date.now() }
      expect(state.tasks[0].log).to.deep.equal([createdEvent, startedEvent, stoppedEvent])
  
      addTaskEvent(state, {
        id: 0,
        type: eventTypes.Completed
      })
      const completedEvent = { type: eventTypes.Completed, time: Date.now() }
      expect(state.tasks[0].log).to.deep.equal([createdEvent, startedEvent, stoppedEvent, completedEvent])
      
    })
  
    it('should not add invalid task events', () => {
  
      addTaskEvent(state, {
        id: 0,
        type: -1
      })
      expect(state).to.deep.equal(origState)
      
      addTaskEvent(state, {
        id: -1,
        type: 0
      })
      expect(state).to.deep.equal(origState)
      
    })
    
  })
  
  describe('addTaskTag', () => {
    
    it('should add tags to multiple tasks correctly', () => {
      
      addTaskTag(state, { id: 0, tag: 'new tag a' })
      expect(state.tags).to.deep.equal({ 'new tag a': [0] })
      expect(state.tasks[0].tags).to.deep.equal(['new tag a'])
      
      addTaskTag(state, { id: 0, tag: 'new tag b' })
      expect(state.tags).to.deep.equal({ 'new tag a': [0], 'new tag b': [0] })
      expect(state.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      
      addTaskTag(state, { id: 1, tag: 'new tag b' })
      expect(state.tags).to.deep.equal({ 'new tag a': [0], 'new tag b': [0, 1] })
      expect(state.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(state.tasks[1].tags).to.deep.equal(['new tag b'])
      
      addTaskTag(state, { id: 2, tag: 'new tag a' })
      expect(state.tags).to.deep.equal({ 'new tag a': [0, 2], 'new tag b': [0, 1] })
      expect(state.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(state.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(state.tasks[2].tags).to.deep.equal(['new tag a'])
      
      // expect duplicate key to fail
      addTaskTag(state, { id: 2, tag: 'new tag a' })
      expect(state.tags).to.deep.equal({ 'new tag a': [0, 2], 'new tag b': [0, 1] })
      expect(state.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(state.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(state.tasks[2].tags).to.deep.equal(['new tag a'])
      
    })
    
    it('should skip blank tags and trim ending and leading whitespace', () => {
      
      addTaskTag(state, { id: 0, tag: '' })
      expect(state.tags).to.deep.equal({})
      expect(state.tasks[0].tags).to.deep.equal([])
      
      addTaskTag(state, { id: 0, tag: ' ' })
      expect(state.tags).to.deep.equal({})
      expect(state.tasks[0].tags).to.deep.equal([])
  
      addTaskTag(state, { id: 0, tag: ' a tag ' })
      expect(state.tags).to.deep.equal({ 'a tag': [0] })
      expect(state.tasks[0].tags).to.deep.equal(['a tag'])
      
    })
    
  })
  
})
