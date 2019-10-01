<template>
  <div>
    <!-- TaskList Title Section -->
    <div class="title-section">
      <!-- TaskList Title -->
      <h3 class="title">
        {{ title }}
      </h3>
      
      <!-- TaskList Settings Button -->
      <div
        class="dropright"
      >
        <button
          :id="btnId"
          class="btn btn-light"
          title="List options"
          data-toggle="dropdown"
        >
          <font-awesome-icon :icon="isCompletedList ? 'ellipsis-v' : 'filter'" />
        </button>
        <div
          v-if="!isCompletedList"
          id="filter-menu"
          class="dropdown-menu"
        >
          <div class="d-flex">
            <TagList
              v-if="selectedTag !== null"
              :tags="[selectedTag]"
              :remove-tag="removeTagFilter"
              remove-text="Clear Filter"
            />
            <TagList
              v-if="selectedTag === null"
              :tags="allTags"
              :select-tag="selectTagFilter"
            />
          </div>
        </div>
        <div
          v-if="isCompletedList"
          class="dropdown-menu"
        >
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
          <div class="dropdown-divider" />
          <button
            id="clear-btn"
            class="btn btn-danger"
            title="Delete all list tasks"
            @click="clearTasks"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
    
    <!-- New Task Input Field -->
    <input
      v-if="!isCompletedList"
      id="new-task"
      v-model="newTask"
      type="text"
      class="form-control"
      placeholder="enter new task"
      @keyup.enter="addNewTask"
    >
    
    <!-- Incomplete Tasks -->
    <draggable
      v-if="!isCompletedList"
      v-model="incompleteTaskList"
    >
      <transition-group>
        <Task
          v-for="task in incompleteTaskList"
          :key="task.id"
          :task="task"
        />
      </transition-group>
    </draggable>
    
    <!-- Completed Tasks -->
    <ul
      v-if="isCompletedList"
      class="task-list list-group"
    >
      <Task
        v-for="task in completedTaskList"
        :key="task.id"
        :task="task"
      />
    </ul>
  </div>
</template>

<script>
import Task from './Task.vue'
import TagList from './TagList.vue'
import { mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import $ from 'jquery'

$(document).on('click', '.title-section .dropdown-menu', function (e) {
  e.stopPropagation()
})

export default {
  
  name: 'TaskList',
  
  components: {
    Task,
    TagList,
    draggable
  },
  
  props: {
    title: {
      type: String,
      default: 'To Do'
    }
  },
  
  data: () => ({
    newTask: '',
    sortOrder: 'Oldest',
    selectedTag: null
  }),
  
  computed: {
    ...mapGetters([
      'incompleteTasks',
      'completedTasks',
      'selectedTask',
      'allTags'
    ]),
    isCompletedList: function () { return this.title === 'Done' },
    btnId: function () { return this.isCompletedList ? 'completedSettingsButton' : 'todoSettingsButton' },
    selectId: function () { return (this.completed ? 'completed' : 'toDo') + 'OrderGroupSelect' },
    sortingOptions: function () { return this.isCompletedList ? ['Recent', 'Oldest'] : ['Newest', 'Oldest'] },
    incompleteTaskList: {
      get () {
        return this.selectedTag
          ? this.incompleteTasks.filter(task => task.tags.includes(this.selectedTag))
          : this.incompleteTasks
      },
      set (value) {
        this.updateIncompleteTasks(value)
      }
    },
    completedTaskList: function () {
      return this.completedTasks && this.sortOrder !== 'Oldest'
        ? this.completedTasks.slice().reverse()
        : this.completedTasks
    }
  },
  
  mounted: function () {
    this.sortOrder = this.sortingOptions[0]
  },
  
  methods: {
    ...mapMutations([
      'addTask',
      'clearTasks',
      'updateIncompleteTasks',
      'selectTask'
    ]),
    addNewTask () {
      this.addTask({ name: this.newTask })
      this.newTask = ''
    },
    selectTagFilter (tag) {
      this.selectedTag = tag
      if (!this.selectedTask.tags.includes(this.selectedTag)) {
        this.selectTask(this.incompleteTasks.filter(task => task.tags.includes(this.selectedTag))[0].id)
      }
    },
    removeTagFilter () {
      this.selectedTag = null
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
  
  #filter-menu {
    padding: 8px;
  }

</style>
