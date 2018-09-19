<template>
  <div id="app" class="container">
    <div class="row">
    <div class="col-md"></div>
    <div class="col-md">
      <div class="section">
        <h1>To Do List</h1>
        <input v-model="newTask" placeholder="enter new task" @keyup.enter="addTask" type="text" class="form-control" >
        <TaskList :tasks="incompleteTasks" />
      </div>
      <br/>
      <div class="section" v-if="completedTasks.length > 0">
        <h3>Completed Tasks</h3>
        <TaskList :tasks="completedTasks" />
      </div>
    </div>
    <div class="col-md"></div>
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
