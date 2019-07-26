import { expect } from 'chai'
import { state, mutations } from '@/store'

const { addTask, addTaskTag, startTask, stopTask, completeTask } = mutations

describe('mutations', () => {
  
  let myState
  let createdTime
  let origState
  
  beforeEach(() => {
    
    myState = JSON.parse(JSON.stringify(state))
    addTask(myState, { name: 'my first task' })
    createdTime = Date.now()
    origState = JSON.parse(JSON.stringify(myState))
    
  })
  
  describe('addTask', () => {
    
    it('should add a task to the state', () => {
      
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          created: createdTime,
          log: [],
          completed: null
        }
      ])
      expect(myState.selectedTaskID).to.equal(0)
      
    })
    
    it('should not add a blank task to the state', () => {
  
      addTask(myState, { name: '' })
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          created: createdTime,
          log: [],
          completed: null
        }
      ])
      
    })
    
  })
  
  describe('startTask', () => {
    
    it('should start and stop the task', () => {
      
      startTask(myState, { id: 0 })
      const firstInterval = { started: Date.now(), stopped: null }
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
  
      stopTask(myState, { id: 0 })
      firstInterval.stopped = Date.now()
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
      
    })
    
    it('should overwrite the latest start time if called twice', () => {
      
      myState.tasks[0].log.push({
        started: Date.now() - 10000,
        stopped: null
      })
  
      startTask(myState, { id: 0 })
      const firstInterval = { started: Date.now(), stopped: null }
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
      
    })
    
    it('should not add to invalid tasks', () => {
  
      startTask(myState, { id: -1 })
      expect(myState).to.deep.equal(origState)
      
    })
    
  })
  
  describe('stopTask', () => {
  
    it('should stop the task', () => {
      
      const firstInterval = { started: Date.now() - 10000, stopped: null }
      myState.tasks[0].log.push(firstInterval)
      
      stopTask(myState, { id: 0 })
      
      firstInterval.stopped = Date.now()
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
      
    })
    
    it('should ignore the second stop time if called twice', () => {
      
      const latestInterval = {
        started: Date.now() - 30000,
        stopped: Date.now() - 10000
      }
      myState.tasks[0].log.push(latestInterval)
      
      stopTask(myState, { id: 0 })
      
      expect(myState.tasks[0].log).to.deep.equal([latestInterval])
      
    })
    
    it('should not add to invalid tasks', () => {
      
      stopTask(myState, { id: -1 })
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
  
  describe('completeTask', () => {
    
    it('should mark the task as complete', () => {
      
      completeTask(myState, { id: 0 })
      const completedTime = Date.now()
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          created: createdTime,
          log: [],
          completed: completedTime
        }
      ])
      
    })
    
  })
  
})
