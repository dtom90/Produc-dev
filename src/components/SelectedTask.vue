<template>
  <div>
    <div
      v-if="task"
      class="border"
    >
      <br>
      <!--  Main Section (Flex Grow)  -->
      <div class="d-flex">
        <div
          id="checkbox-name-section"
          class="d-flex flex-grow-1 align-items-center justify-content-center"
        >
          <!--  Checkbox  -->
          <Checkbox
            :checked="checked"
            :task-id="task.id"
          />

          <!--  Task Name & Field (when editing)  -->
          <div id="task-name-container">
            <span
              v-if="!editing"
              id="task-name"
              @click="editing = true"
            >{{ task.name }}</span>
            <div
              v-if="editing"
              class="d-flex align-items-center"
            >
              <input
                v-model="task.name"
                class="edit-task"
                @keyup.enter="editing = false"
              >
              <button
                type="button"
                class="btn btn-primary"
                @click="editing = false"
              >
                <font-awesome-icon icon="save" />
              </button>
            </div>
          </div>
        </div>

        <!-- Menu Options -->
        <div class="dropleft">
          <button
            class="btn btn-light"
            title="Task options"
            data-toggle="dropdown"
          >
            <font-awesome-icon icon="ellipsis-v" />
          </button>
          <div class="dropdown-menu">
            <div class="flex-column">
              <button
                type="button"
                class="btn btn-warning"
                title="Edit task name"
                @click="editing = true"
              >
                <font-awesome-icon icon="pencil-alt" />
              </button>
              <button
                type="button"
                class="btn btn-danger"
                title="Delete task"
                @click="deleteTask({id: task.id})"
              >
                <font-awesome-icon icon="trash-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tags Section -->
      <TagList
        :tags="task.tags"
        :task-id="task.id"
        :select-tag="selectTag"
        :modal="true"
        :remove-tag="removeTag"
      />
      
      <!-- Activity Modal -->
      <ActivityModal
        :tag="selectedTag"
      />
      
      <br>
      
      <!-- Countdown Timer -->
      <keep-alive>
        <Countdown
          v-if="!task.completed && (!running || activeTaskID === task.id)"
          :task-id="task.id"
        />
      </keep-alive>
      <br>
      
      <!-- Activity View -->
      <ActivityView
        id="taskActivity"
        class="border-top"
        :task-id="task.id"
        :element="task.name"
        :log="task.log"
      />
    </div>
  </div>
</template>

<script>
import Checkbox from './Checkbox'
import TagList from './TagList'
import Countdown from './Countdown'
import ActivityView from './ActivityView'
import ActivityModal from './ActivityModal'
import { mapState, mapMutations } from 'vuex'

export default {
  
  name: 'SelectedTask',
  
  components: {
    Checkbox,
    TagList,
    Countdown,
    ActivityView,
    ActivityModal
  },
  
  props: {
    task: {
      type: Object,
      default: () => null
    }
  },
  
  data: () => ({
    editing: false,
    newTag: '',
    tagOptions: [],
    selectedTag: null,
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState([
      'activeTaskID',
      'running'
    ]),
    
    checked: function () {
      return this.task.completed !== null
    }
    
  },
  
  methods: {
    
    ...mapMutations([
      'addTaskTag',
      'removeTaskTag',
      'deleteTask'
    ]),
    
    addTagButton: function () {
      this.showTagInput = !this.showTagInput
      if (this.showTagInput) {
        this.$nextTick(() => {
          this.$refs.addTagInput.focus()
        })
      }
    },
    
    tagInputChange: function () {
      this.tagOptions = this.availableTags(this.task.id, this.newTag)
    },
    
    addTag: function (newTag) {
      this.addTaskTag({ id: this.task.id, tag: newTag })
      this.newTag = ''
      this.tagInputChange()
      this.tagOptions = []
      this.$refs.addTagInput.focus()
    },

    selectTag: function (tag) {
      this.selectedTag = tag
    },
    
    removeTag: function (tag) {
      this.removeTaskTag({ id: this.task.id, tag })
      this.$forceUpdate()
    },
    
    clickOutside: function (event) {
      if (!(event.relatedTarget && event.relatedTarget.classList &&
            event.relatedTarget.classList.contains('tag-option'))) {
        this.tagOptions = []
        if (!(event.relatedTarget && event.relatedTarget.id === 'addTagButton')) {
          this.showTagInput = false
        }
      }
    }
    
  }
}
</script>

<style scoped lang="scss">
    
    #checkbox-name-section {
        margin-left: 20px;
      flex: 1;
    }
    
    #task-name {
        font-weight: 600;
        font-size: xx-large;
    }

    .dropleft .btn {
        margin: 8px;
    }

    $play-btn-size: 75px;

    #play-btn {
        width: $play-btn-size;
        height: $play-btn-size;
        font-size: 28px;
        border-radius: $play-btn-size;
    }
</style>
