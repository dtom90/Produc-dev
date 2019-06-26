<template>
  <div
    id="app"
    class="container-fluid d-flex"
  >
    <div class="section task-list">
      <TaskList
        title="To Do List"
        :tasks="incompleteTasks"
      />
    </div>

    <div class="section active-task">
      <ActiveTask :task="selectedTask" />
    </div>
    
    <div class="section task-list">
      <TaskList
        title="Completed Tasks"
        :tasks="completedTasks"
      />
    </div>
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'
import ActiveTask from './components/ActiveTask.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  
  name: 'App',
  
  components: {
    TaskList,
    ActiveTask
  },

  computed: {
    
    ...mapState([
      'selectedTask'
    ]),
    
    ...mapGetters([
      'incompleteTasks',
      'completedTasks'
    ])
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 20px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .section {
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .task-list {
    flex: 2;
  }
  
  .active-task {
    flex: 3;
  }
  
</style>
