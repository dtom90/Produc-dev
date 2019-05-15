<template>
  <div id="app" class="container">

    <TaskList title="To Do List"
              :tasks="$root.incompleteTasks()"/>
    <br/>
    <br/>

    <TaskList title="Completed Tasks"
              :tasks="$root.completedTasks()"
              v-if="$root.completedTasks().length > 0"/>
  </div>
</template>

<script>
  import TaskList from './components/TaskList.vue'

  export default {
    name: 'app',
    components: {
      TaskList
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
    max-width: 500px;
  }
</style>
