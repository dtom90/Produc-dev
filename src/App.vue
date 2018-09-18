<template>
  <div id="app">
    <div class="section">
      <h1>To Do List</h1>
      <input v-model="newTask" placeholder="enter new task" @keyup.enter="addTask">
      <TaskList :tasks="incompleteTasks" />
    </div>
    <div class="section" v-if="completedTasks.length > 0">
      <h3>Completed Tasks</h3>
      <TaskList :tasks="completedTasks" />
    </div>
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
  computed: {
    incompleteTasks: function () { return this.tasks.filter(t => !t.completed) },
    completedTasks: function () { return this.tasks.filter(t => t.completed) }
  },
  methods: {
    addTask: function () {
      const newTask = {
        id: this.tasks.length,
        name: this.newTask,
        completed: false
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
