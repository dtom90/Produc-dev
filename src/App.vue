<template>
  <div id="app">
    <h1>To Do List</h1>
    <input v-model="newTask" placeholder="enter new task" @keyup.enter="addTask">
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
      tasks: [],
      newTask: ''
    }
  },
  methods: {
    addTask: function () {
      const newTask = {
        id: this.tasks.length,
        name: this.newTask
      }
      this.tasks.push(newTask)
      this.newTask = ''
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
