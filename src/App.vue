<template>
  <div id="app">
    <h1>To Do List</h1>
    <TaskList :tasks="tasks" />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'

export default {
  name: 'app',
  components: {
    TaskList
  },
  data: function() {
    return {
      tasks: [
        'Task 1',
        'Task 2',
        'Task 3'
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
