import { expect } from 'chai'
import { state, mutations } from '@/store'
import { eventTypes } from '@/store/constants'

const { addTask, addTaskEvent, addTaskTag } = mutations

describe('mutations', () => {
  
  let myState
  let createdEvent
  let origState
  
  beforeEach(() => {
    
    myState = JSON.parse(JSON.stringify(state))
    addTask(myState, { name: 'my first task' })
    createdEvent = { type: eventTypes.Created, time: Date.now() }
    origState = JSON.parse(JSON.stringify(myState))
    
  })
  
  describe('addTask', () => {
  
    it('should add a task to the state', () => {
      
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          completed: false,
          log: [createdEvent]
        }
      ])
      expect(myState.selectedTaskID).to.equal(0)
      
    })
    
  })
  
  describe('addTaskEvent', () => {
    
    it('should add valid task events to the task', () => {
      
      const createdEvent = myState.tasks[0].log[0]
      
      addTaskEvent(myState, {
        id: 0,
        type: eventTypes.Started
      })
      const startedEvent = { type: eventTypes.Started, time: Date.now() }
      expect(myState.tasks[0].log).to.deep.equal([createdEvent, startedEvent])
      
      addTaskEvent(myState, {
        id: 0,
        type: eventTypes.Stopped
      })
      const stoppedEvent = { type: eventTypes.Stopped, time: Date.now() }
      expect(myState.tasks[0].log).to.deep.equal([createdEvent, startedEvent, stoppedEvent])
      
      addTaskEvent(myState, {
        id: 0,
        type: eventTypes.Completed
      })
      const completedEvent = { type: eventTypes.Completed, time: Date.now() }
      expect(myState.tasks[0].log).to.deep.equal([createdEvent, startedEvent, stoppedEvent, completedEvent])
      
    })
  
    it('should not add invalid task events', () => {
  
      addTaskEvent(myState, {
        id: 0,
        type: -1
      })
      expect(myState).to.deep.equal(origState)
      
      addTaskEvent(myState, {
        id: -1,
        type: 0
      })
      expect(myState).to.deep.equal(origState)
      
    })
    
  })
  
  describe('addTaskTag', () => {
    
    it('should add tags to multiple tasks correctly', () => {
      
      addTask(myState, { name: 'my second task' })
      addTask(myState, { name: 'my third task' })
      
      addTaskTag(myState, { id: 0, tag: 'new tag a' })
      expect(myState.tags).to.deep.equal({ 'new tag a': [0] })
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a'])
      
      addTaskTag(myState, { id: 0, tag: 'new tag b' })
      expect(myState.tags).to.deep.equal({ 'new tag a': [0], 'new tag b': [0] })
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      
      addTaskTag(myState, { id: 1, tag: 'new tag b' })
      expect(myState.tags).to.deep.equal({ 'new tag a': [0], 'new tag b': [0, 1] })
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      
      addTaskTag(myState, { id: 2, tag: 'new tag a' })
      expect(myState.tags).to.deep.equal({ 'new tag a': [0, 2], 'new tag b': [0, 1] })
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
      
      // expect duplicate key to fail
      addTaskTag(myState, { id: 2, tag: 'new tag a' })
      expect(myState.tags).to.deep.equal({ 'new tag a': [0, 2], 'new tag b': [0, 1] })
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
      
    })
    
    it('should not add tags to nonexistent tasks', () => {
  
      addTaskTag(myState, { id: -1, tag: 'new tag' })
      expect(myState).to.deep.equal(origState)
      
    })
    
    it('should skip blank tags and trim ending and leading whitespace', () => {
      
      addTaskTag(myState, { id: 0, tag: '' })
      expect(myState).to.deep.equal(origState)
      
      addTaskTag(myState, { id: 0, tag: ' ' })
      expect(myState).to.deep.equal(origState)
  
      addTaskTag(myState, { id: 0, tag: ' a new tag ' })
      expect(myState.tags).to.deep.equal({ 'a new tag': [0] })
      expect(myState.tasks[0].tags).to.deep.equal(['a new tag'])
      
    })
    
  })
  
})
