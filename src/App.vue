<template>
  <div id="app" class="container">
    <div class="section">
      <div class="title-section">
        <h1 id="todo-title">To Do List</h1>
        <div class="dropdown">
          <button id="settings-btn" class="btn btn-light" data-toggle="dropdown">
            <font-awesome-icon icon="cog"/>
          </button>
          <div class="dropdown-menu" aria-labelledby="settings-btn">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="orderGroupSelect">Order</label>
              </div>
              <select class="custom-select" id="orderGroupSelect" v-model="$root.order">
                <option selected value="Queue">Queue</option>
                <option value="Stack">Stack</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <input id="new-task" type="text" class="form-control" placeholder="enter new task"
             v-model="newTask" @keyup.enter="addTask"/>
      <TaskList :tasks="$root.incompleteTasks()"/>
    </div>
    <br/>
    <div class="section" v-if="$root.completedTasks().length > 0">
      <div class="title-section">
        <h3 id="completed-title">Completed Tasks</h3>
        <button id="clear-btn" class="btn btn-danger" v-on:click="$root.clearTasks()">Clear All</button>
      </div>
      <TaskList :tasks="$root.completedTasks()"/>
    </div>
  </div>
</template>

<script>
  import TaskList from './components/TaskList.vue'
  import $ from 'jquery'

  $(document).on('click', '.title-section .dropdown-menu', function (e) {
    e.stopPropagation();
  });

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

  .title-section {
    display: flex;
  }

  .title-section > h1, h3 {
    flex: 1;
  }

  #todo-title {
    margin-left: 40px;
  }

  .title-section > button {
    margin-bottom: 0.5rem;
  }

  #completed-title {
    margin-left: 63px;
  }
</style>
