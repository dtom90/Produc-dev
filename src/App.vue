<template>
  <div id="app" class="container">
    <div class="section">
      <h1>To Do List</h1>
      <input id="new-task" type="text" class="form-control" placeholder="enter new task"
             v-model="newTask" @keyup.enter="addTask"/>
      <TaskList :tasks="$root.incompleteTasks()"/>
    </div>
    <br/>
    <div class="section" v-if="$root.completedTasks().length > 0">
      <div id="title-section">
        <h3 id="completed-title">Completed Tasks</h3>
        <button id="clear-btn" v-on:click="$root.clearTasks()">Clear</button>
      </div>
      <TaskList :tasks="$root.completedTasks()"/>
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
      newTask: ''
    }),
    methods: {
      addTask() {
        this.$root.addTask(this.newTask)
        this.newTask = ''
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
    max-width: 500px;
  }

  #new-task {
    margin-bottom: 10px;
  }

  #title-section {
    display: flex;
  }

  #completed-title {
    margin-left: 63px;
    flex: 1;
  }

  #clear-btn {

  }
</style>
