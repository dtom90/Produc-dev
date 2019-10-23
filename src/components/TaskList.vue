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
          <font-awesome-icon icon="ellipsis-v" />
        </button>
        
        <!-- To Do List Menu -->
        <div
          v-if="!isCompletedList"
          id="filter-menu"
          class="dropdown-menu"
        >
          <TagList
            v-if="selectedTags.length > 0"
            label="Filtering on"
            :tags="selectedTags"
            :remove-tag="removeTagFilter"
            remove-text="Clear Filter"
          />
          <div
            v-if="selectedTags.length > 0"
            class="form-check form-check-inline"
          >
            <input
              id="addTagsSelect"
              v-model="toggleAddSelectedTags"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="addTagsSelect"
            >Include in new tasks</label>
          </div>
          <div
            v-if="selectedTags.length > 0 && unselectedTags.length > 0"
            class="dropdown-divider"
          />
          <TagList
            v-if="unselectedTags.length > 0"
            :label="selectedTags.length > 0 ? 'Add to filter' : 'Filter on'"
            :tags="unselectedTags"
            :select-tag="selectTagFilter"
          />
          <div class="dropdown-divider" />
          <h6 style="margin-bottom: 10px;">
            Add New Tasks To:
          </h6>
          <div
            class="btn-group btn-group-toggle custom-icons"
          >
            <label
              :class="'btn btn-light' + (insertAtTop === true ? ' active' : '')"
              title="Top of List"
            >
              <input
                id="insert-top"
                type="radio"
                value="Top"
                @click="setTopInsert(true)"
              >
              <img
                src="add_to_top.svg"
                alt="Add to Top"
              >
            </label>
            <label
              :class="'btn btn-light' + (insertAtTop === false ? ' active' : '')"
              title="Bottom of List"
            >
              <input
                id="insert-bottom"
                type="radio"
                value="Bottom"
                @click="setTopInsert(false)"
              >
              <img
                src="add_to_bottom.svg"
                alt="Add to Bottom"
              >
            </label>
          </div>
        </div>
        
        <!-- Done List Menu -->
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
import { mapState, mapGetters, mapMutations } from 'vuex'
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
    sortOrder: 'Oldest'
  }),
  
  computed: {
    ...mapState([
      'selectedTags',
      'addSelectedTags',
      'insertAtTop'
    ]),
    ...mapGetters([
      'incompleteTasks',
      'completedTasks',
      'selectedTask',
      'unselectedTags'
    ]),
    isCompletedList: function () { return this.title === 'Done' },
    btnId: function () { return this.isCompletedList ? 'completedSettingsButton' : 'todoSettingsButton' },
    selectId: function () { return (this.completed ? 'completed' : 'toDo') + 'OrderGroupSelect' },
    sortingOptions: function () { return this.isCompletedList ? ['Recent', 'Oldest'] : ['Newest', 'Oldest'] },
    toggleAddSelectedTags: {
      get () {
        return this.addSelectedTags
      },
      set (value) {
        this.updateAddSelectedTags(value)
      }
    },
    incompleteTaskList: {
      get () {
        return this.selectedTags.length > 0
          ? this.incompleteTasks.filter(task => this.selectedTags.some(tag => task.tags.includes(tag)))
          : this.incompleteTasks
      },
      set (value) {
        this.updateIncompleteTasks(value)
      }
    },
    completedTaskList: function () {
      const filteredTasks = this.selectedTags.length > 0
        ? this.completedTasks.filter(task => this.selectedTags.some(tag => task.tags.includes(tag)))
        : this.completedTasks
      return filteredTasks && this.sortOrder !== 'Oldest'
        ? filteredTasks.slice().reverse()
        : filteredTasks
    }
  },
  
  mounted: function () {
    this.sortOrder = this.sortingOptions[0]
  },
  
  methods: {
    ...mapMutations([
      'addTask',
      'setTopInsert',
      'updateAddSelectedTags',
      'clearTasks',
      'updateIncompleteTasks',
      'selectTag',
      'removeTag',
      'selectTask'
    ]),
    addNewTask () {
      this.addTask({ name: this.newTask })
      this.newTask = ''
    },
    selectTagFilter (tag, e) {
      e.stopPropagation()
      this.selectTag({ tag })
      if (this.selectedTask && !this.selectedTags.some(tag => this.selectedTask.tags.includes(tag))) {
        const tasksWithTag = this.incompleteTasks.filter(task => this.selectedTags.some(tag => task.tags.includes(tag)))
        if (tasksWithTag.length > 0) {
          this.selectTask(tasksWithTag[0].id)
        } else {
          this.selectTask(null)
        }
      }
    },
    removeTagFilter (tag) {
      this.removeTag({ tag })
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
    width: 200px;
  }
  
  #filter-menu .form-check {
    margin: 0;
  }
  
  .custom-icons img {
    width: 1.5em;
    height: 1.5em;
  }

</style>
