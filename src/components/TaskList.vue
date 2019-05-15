<template>
  <div class="section">
    <div class="title-section">
      <component :is="titleTag" class="title">
        {{this.title}}
      </component>
      <div class="dropright">
        <button :id="btnId" class="btn btn-light" data-toggle="dropdown">
          <font-awesome-icon icon="cog"/>
        </button>
        <div class="dropdown-menu">
          <div class="input-group">
            <select class="custom-select" :id="selectId" v-model="$root.order">
              <option selected value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
            </select>
            <div class="input-group-append">
              <label class="input-group-text" :for="selectId">First</label>
            </div>
          </div>
          <div class="dropdown-divider" v-if="completedList"/>
          <button id="clear-btn"
                  class="btn btn-danger"
                  v-if="completedList"
                  v-on:click="$root.clearTasks()">
            Clear All
          </button>
        </div>
      </div>
    </div>
    <input id="new-task" type="text"
           v-if="!completedList"
           class="form-control" placeholder="enter new task"
           v-model="newTask" @keyup.enter="addTask"/>
    <ul class="task-list list-group">
      <Task v-for="task in tasks" :key="task.id" :task="task"/>
    </ul>
  </div>
</template>

<script>
  import Task from './Task.vue'
  import $ from 'jquery'

  $(document).on('click', '.title-section .dropdown-menu', function (e) {
    e.stopPropagation();
  });

  export default {
    name: 'TaskList',
    props: {
      title: {
        type: String,
        default: 'To Do List'
      },
      tasks: Array
    },
    computed: {
      completedList: function() { return this.title === 'Completed Tasks' },
      titleTag: function() { return this.completedList ? 'h3' : 'h1' },
      btnId: function() { return this.completedList ? 'completedSettingsButton' : 'todoSettingsButton' },
      selectId: function() { return (this.completed ? 'completed' : 'toDo') + 'OrderGroupSelect' }
    },
    components: {
      Task
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

<style scoped>

  #new-task {
    margin-bottom: 10px;
  }

  .title-section {
    display: flex;
  }

  .title {
    flex: 1;
    margin-left: 40px;
  }

  .title-section > button {
    margin-bottom: 0.5rem;
  }

</style>