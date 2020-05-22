<template>
  <div
    v-if="task"
    id="selected-task-container"
    :class="'border ' + heightClass"
  >
    <br>
    <!--  Title Section  -->
    <div class="d-flex justify-content-between">
      <div
        id="checkbox-name-container"
        class="d-flex align-items-center justify-content-center flex-grow-1"
      >
        <div
          v-if="!editingName"
          id="menu-counterbalance"
          style="width: 28px;"
        />
        
        <!--  Checkbox  -->
        <div>
          <Checkbox
            :checked="checked"
            :task-id="task.id"
            style="margin-left: 20px"
          />
        </div>
        
        <!--  Task Name & Field (when editing)  -->
        <div
          v-if="!editingName"
          id="task-name"
          @mousedown="possibleEdit = true"
          @mousemove="possibleEdit = false"
          @mouseup="editName"
        >
          <span>{{ task.name }}</span>
        </div>
        <div
          v-if="editingName"
          class="input-group flex-grow-1"
        >
          <input
            id="task-name-input"
            ref="taskNameInput"
            v-model="task.name"
            class="form-control"
            @keyup.enter="editingName = false"
          >
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-primary"
              @click="editingName = false"
            >
              <font-awesome-icon icon="save" />
            </button>
          </div>
        </div>
        
        <div
          v-if="!editingName"
          id="checkbox-counterbalance"
          style="width: 55.19px;"
        />
      </div>
      
      <!-- Menu Options -->
      <div
        ref="taskMenu"
        class="dropdown"
      >
        <button
          class="btn btn-light"
          title="Task options"
          data-toggle="dropdown"
        >
          <font-awesome-icon icon="ellipsis-v" />
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <div
            id="selected-task-menu"
            class="d-flex"
          >
            <button
              type="button"
              class="btn btn-warning"
              title="Edit task name"
              @click="editName"
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
      :tag-list="taskTags"
      :task-id="task.id"
      :modal="true"
      :remove-tag="removeTag"
    />
    
    <!-- Notes Section -->
    <div
      id="notes-section"
      class="d-flex align-items-center"
    >
      <span id="notes-label">Notes: </span>
      
      <!-- Display Mode -->
      <!-- eslint-disable vue/no-v-html -->
      <span
        v-if="task.notes && !editingNotes"
        id="display-notes"
        class="flex-grow-1"
        v-html="displayNotes"
      />
      <!-- eslint-enable vue/no-v-html -->
      <button
        v-if="!editingNotes"
        type="button"
        class="btn btn-light"
        title="Edit task name"
        @click="editingNotes = true"
      >
        <font-awesome-icon icon="pencil-alt" />
      </button>
      
      <!-- Editing Mode -->
      <div
        v-if="editingNotes"
        class="input-group"
      >
        <textarea
          v-model="task.notes"
          class="form-control no-wrap"
          :rows="task.notes.split('\n').length"
        />
        <div class="input-group-append">
          <button
            v-if="editingNotes"
            type="button"
            class="btn btn-primary"
            @click="editingNotes = false"
          >
            <font-awesome-icon icon="save" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Countdown Timer -->
    <keep-alive>
      <Countdown
        v-if="!task.completed && (!running || activeTaskID === task.id)"
        :task-id="task.id"
        class="top-margin"
      />
    </keep-alive>
    
    <!-- Activity View -->
    <ActivityView
      id="taskActivity"
      class="border-top top-margin"
      :task-id="task.id"
      :element="task.name"
      :log="task.log"
      :manual-input="!task.completed"
    />
    <br>
  </div>
</template>

<script>
import Checkbox from './Checkbox'
import TagList from './TagList'
import Countdown from './Countdown'
import ActivityView from './ActivityView'
import { mapMutations, mapState } from 'vuex'
import marked from 'marked'
import DOMPurify from 'dompurify'

const renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text)
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}

export default {
  
  name: 'SelectedTask',
  
  components: {
    Checkbox,
    TagList,
    Countdown,
    ActivityView
  },
  
  props: {
    task: {
      type: Object,
      default: () => null
    },
    heightClass: {
      type: String,
      default: 'full-height'
    }
  },
  
  data: () => ({
    possibleEdit: true,
    editingName: false,
    editingNotes: false,
    newTag: '',
    tagOptions: [],
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState([
      'activeTaskID',
      'running',
      'tagOrder'
    ]),
    
    checked () {
      return this.task.completed !== null
    },
    
    taskTags () {
      return this.task.tags
    },
    
    displayNotes () {
      return marked(DOMPurify.sanitize(this.task.notes), { renderer })
    }
    
  },
  
  methods: {
    
    ...mapMutations([
      'addTaskTag',
      'removeTaskTag',
      'deleteTask'
    ]),
    
    editName () {
      if (this.possibleEdit) {
        this.editingName = true
        this.$refs.taskMenu.classList.remove('show')
        this.$refs.taskMenu.querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
        this.$refs.taskMenu.querySelector('.dropdown-menu').classList.remove('show')
        this.$nextTick(() => this.$refs.taskNameInput.focus())
      }
      this.possibleEdit = true
    },
    
    addTagButton () {
      this.showTagInput = !this.showTagInput
      if (this.showTagInput) {
        this.$nextTick(() => {
          this.$refs.addTagInput.focus()
        })
      }
    },
    
    tagInputChange () {
      this.tagOptions = this.availableTags(this.task.id, this.newTag)
    },
    
    addTag (newTag) {
      this.addTaskTag({ id: this.task.id, tag: newTag })
      this.newTag = ''
      this.tagInputChange()
      this.tagOptions = []
      this.$refs.addTagInput.focus()
    },
    
    removeTag (tag) {
      this.removeTaskTag({ id: this.task.id, tag })
      this.$forceUpdate()
    },
    
    clickOutside (event) {
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
@import "../styles/_variables.scss";

#selected-task-container {
  overflow-y: auto;
  border-radius: 0.25rem;
}

.full-height {
  max-height: calc(100vh - #{$top-offset})
}

.partial-height {
  max-height: calc(100vh - #{$top-offset} - 94px)
}

#checkbox-name-section {
  margin-left: 20px;
  flex: 1;
}

#task-name-container {
  margin: 8px;
}

#task-name {
  font-weight: 600;
  font-size: xx-large;
  text-align: center;
}

#selected-task-menu {
  justify-content: space-evenly;
}

#notes-section {
  padding: 15px 10px 10px;
}

#notes-label {
  padding-right: 15px;
}

.no-wrap {
  white-space: nowrap;
}

#display-notes {
  padding: 10px;
  border: #e2e6ea 1px solid;
  border-radius: 5px;
  font-size: 18px;
  overflow-x: scroll;
  @extend .no-wrap;
}

.dropdown .btn {
  margin: 0 8px;
}

.dropdown-menu {
  min-width: 40px;
}

$play-btn-size: 75px;

#play-btn {
  width: $play-btn-size;
  height: $play-btn-size;
  font-size: 28px;
  border-radius: $play-btn-size;
}

.top-margin {
  margin-top: 20px;
}
</style>
