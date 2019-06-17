<template>
  <div
    id="app"
    class="container-fluid d-flex"
  >
    <div class="section task-list">
      <TaskList
        title="To Do List"
        :tasks="$root.incompleteTasks()"
      />
    </div>

    <div class="section active-task">
      <ActiveTask :task="$root.selectedTask" />
    </div>
    
    <div class="section task-list">
      <TaskList
        title="Completed Tasks"
        :tasks="$root.completedTasks()"
      />
    </div>
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'
import ActiveTask from './components/ActiveTask.vue'

export default {
  name: 'App',
  components: {
    TaskList,
    ActiveTask
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
