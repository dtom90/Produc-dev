<template>
  <div id="app" class="container">

    <TaskList title="To Do List"
              :tasks="$root.incompleteTasks()"/>
    
    <ActiveTask />
    
    <TaskList title="Completed Tasks"
              :tasks="$root.completedTasks()"/>
  </div>
</template>

<script>
  import TaskList from './components/TaskList.vue'
  import ActiveTask from './components/ActiveTask.vue'

  export default {
    name: 'app',
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
    display: flex;
  }

  .section {
    flex: 1;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
