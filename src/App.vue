<template>
  <div id="app" class="container">
    <div class="section">
      <h1>To Do List</h1>
      <input id="new-task" type="text" class="form-control" placeholder="enter new task"
             v-model="newTask" @keyup.enter="addTask" />
      <TaskList :tasks="incompleteTasks" :deleteTask="deleteTask" />
    </div>
    <br/>
    <div class="section" v-if="completedTasks.length > 0">
      <h3>Completed Tasks</h3>
      <TaskList :tasks="completedTasks" :deleteTask="deleteTask" />
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
  data: () => ({
    tasks: [],
    newTask: ''
  }),
  computed: {
    incompleteTasks() { return this.tasks.filter(t => !t.completed) },
    completedTasks() { return this.tasks.filter(t => t.completed) }
  },
  methods: {
    addTask () {
      const newTask = {
        id: this.tasks.length,
        name: this.newTask,
        completed: false
      }
      this.tasks.push(newTask)
      this.newTask = ''
    },
    deleteTask (id) {
      const index = this.tasks.findIndex(t => t.id === id)
      const task = this.tasks[index];
      const result = confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`);
      if (result) {
        this.tasks.splice(index, 1);
      }
    }
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
  max-width: 400px;
}
#new-task {
  margin-bottom: 10px;
}
</style>
