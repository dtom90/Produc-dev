<template>
  <div>
    <!-- TaskList Title Section -->
    <div class="title-section">
      <!-- TaskList Title -->
      <h3 class="title">
        {{ title }}
      </h3>

      <!-- TaskList Settings Button -->
      <div class="dropright">
        <button
          :id="btnId"
          class="btn btn-light"
          data-toggle="dropdown"
        >
          <font-awesome-icon icon="ellipsis-v" />
        </button>
        <div class="dropdown-menu">
          <div class="input-group">
            <select
              :id="selectId"
              v-model="sortOrder"
              class="custom-select"
            >
              <option
                v-for="option in sortingOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <div class="input-group-append">
              <label
                class="input-group-text"
                :for="selectId"
              >First</label>
            </div>
          </div>
          <div
            v-if="completedList"
            class="dropdown-divider"
          />
          <button
            v-if="completedList"
            id="clear-btn"
            class="btn btn-danger"
            @click="clearTasks"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- New Task Input Field -->
    <input
      v-if="!completedList"
      id="new-task"
      v-model="newTask"
      type="text"
      class="form-control"
      placeholder="enter new task"
      @keyup.enter="addNewTask"
    >

    <!-- TaskList -->
    <ul class="task-list list-group">
      <Task
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
      />
    </ul>
  </div>
</template>

<script>
import Task from './Task.vue'
import { mapMutations } from 'vuex'
import $ from 'jquery'

$(document).on('click', '.title-section .dropdown-menu', function (e) {
  e.stopPropagation()
})

export default {
  
  name: 'TaskList',
  
  components: {
    Task
  },
  
  props: {
    title: {
      type: String,
      default: 'To Do'
    },
    tasks: {
      type: Array,
      default: function () {
        return [
          { id: 1, name: 'new task 1' },
          { id: 2, name: 'new task 2' },
          { id: 3, name: 'new task 3' }
        ]
      }
    }
  },
  
  data: () => ({
    newTask: '',
    sortOrder: 'Oldest'
  }),
  
  computed: {
    completedList: function () { return this.title === 'Done' },
    btnId: function () { return this.completedList ? 'completedSettingsButton' : 'todoSettingsButton' },
    selectId: function () { return (this.completed ? 'completed' : 'toDo') + 'OrderGroupSelect' },
    sortingOptions: function () { return this.completedList ? [ 'Recent', 'Oldest' ] : [ 'Newest', 'Oldest' ] },
    sortedTasks: function () { return this.sortOrder !== 'Oldest' ? this.tasks.slice().reverse() : this.tasks }
  },
  
  mounted: function () {
    this.sortOrder = this.sortingOptions[0]
  },
  
  methods: {
    ...mapMutations([
      'addTask',
      'clearTasks'
    ]),
    addNewTask () {
      this.addTask(this.newTask)
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
