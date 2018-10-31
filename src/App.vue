<template>
  <div id="app" class="container">
    <div class="section">
      <div class="title-section">
        <h1 id="todo-title">To Do List</h1>
        <div class="dropright">
          <button class="btn btn-light" data-toggle="dropdown">
            <font-awesome-icon icon="cog"/>
          </button>
          <div id="todo-menu" class="dropdown-menu">
            <div class="input-group">
              <select class="custom-select" id="orderGroupSelect" v-model="$root.order">
                <option selected value="Oldest">Oldest</option>
                <option value="Newest">Newest</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="orderGroupSelect">First</label>
              </div>
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
        <div class="dropright">
          <button id="completedSettingsButton" class="btn btn-light" data-toggle="dropdown">
            <font-awesome-icon icon="cog"/>
          </button>
          <div class="dropdown-menu">
            <div class="input-group">
              <select class="custom-select" id="completedOrderGroupSelect" v-model="$root.completedOrder">
                <option selected value="Recent">Recent</option>
                <option value="Oldest">Oldest</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="completedOrderGroupSelect">First</label>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button id="clear-btn" class="btn btn-danger" v-on:click="$root.clearTasks()">Clear All</button>
          </div>
        </div>
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
