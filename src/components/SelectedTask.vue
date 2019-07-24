<template>
  <div>
    <div
      v-if="task"
      class="border"
    >
      <br>
      <!--  Main Section (Flex Grow)  -->
      <div class="d-flex">
        <div class="d-flex flex-grow-1 align-items-center justify-content-center">
          <!--  Checkbox  -->
          <Checkbox
            :checked="task.completed"
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
            data-toggle="dropdown"
          >
            <font-awesome-icon icon="ellipsis-v" />
          </button>
          <div class="dropdown-menu">
            <div class="flex-column">
              <button
                type="button"
                class="btn btn-warning"
                @click="editing = true"
              >
                <font-awesome-icon icon="pencil-alt" />
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteTask(task.id)"
              >
                <font-awesome-icon icon="trash-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tags List -->
      <div
        id="tagZone"
        class="form-inline"
      >
        <label class="col-sm-2">Tags:</label>
        <div
          id="tagDropdown"
        >
          <div
            id="tagDropdownMenu"
            class="btn-group-vertical"
            @blur="tagOptions = []"
          >
            <button
              v-for="tag in tagOptions"
              :key="tag"
              class="tag-option btn btn-light"
              @click="addTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        <input
          id="add-tag"
          v-model="newTag"
          type="text"
          class="form-control"
          placeholder="add new tag"
          @input="tagInputChange"
          @focus="tagInputChange"
          @blur="clickOutside"
          @keyup.enter="addTag(newTag)"
        >
        <div
          v-for="tag in task.tags"
          :key="tag"
          class="tag btn-group"
        >
          <button
            class="tag-name btn btn-primary"
            data-toggle="modal"
            data-target="#activityModal"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
          <button
            class="tag-close btn btn-primary"
            @click="removeTag(tag)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
      
      <!-- Activity Modal -->
      <ActivityModal
        :tag="selectedTag"
      />
      
      <br>
      
      <!-- Countdown Timer -->
      <Countdown
        v-if="!task.completed"
        :task-id="task.id"
      />
      <br>
      
      <!-- Activity View -->
      <ActivityView
        id="taskActivity"
        :element="task.name"
        :log="task.log"
      />
    </div>
  </div>
</template>

<script>
import Checkbox from './Checkbox'
import Countdown from './Countdown'
import ActivityView from './ActivityView'
import ActivityModal from './ActivityModal'
import { mapGetters, mapMutations } from 'vuex'

export default {
  
  name: 'SelectedTask',
  
  components: {
    Checkbox,
    Countdown,
    ActivityView,
    ActivityModal
  },
  
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: Date.now(),
          log: [{
            type: 0,
            time: Date.now()
          }],
          completed: false
        }
      }
    }
  },
  
  data: () => ({
    editing: false,
    newTag: '',
    tagOptions: [],
    selectedTag: null,
    showActivity: false
  }),
  
  computed: {
    
    ...mapGetters([
      'availableTags'
    ])
    
  },
  
  methods: {
    
    ...mapMutations([
      'addTaskTag',
      'removeTaskTag',
      'deleteTask'
    ]),
    
    tagInputChange: function () {
      this.tagOptions = this.availableTags(this.task.id, this.newTag)
    },
    
    addTag: function (newTag) {
      this.addTaskTag({ id: this.task.id, tag: newTag })
      this.newTag = ''
      this.tagInputChange()
      this.tagOptions = []
    },
    
    removeTag: function (tag) {
      this.removeTaskTag({ id: this.task.id, tag })
      this.$forceUpdate()
    },
    
    clickOutside: function (event) {
      if (!(event.relatedTarget && event.relatedTarget.classList &&
             event.relatedTarget.classList.contains('tag-option'))) {
        this.tagOptions = []
      }
    }
    
  }
}
</script>

<style scoped lang="scss">

    #task-name-container {
        margin-left: 5px;
    }

    #task-name {
        font-weight: 600;
        font-size: xx-large;
    }
    
    #tagZone > * {
       margin-top: 20px;
    }
    
    #add-tag {
        max-width: 160px;
    }
    
    #tagDropdown {
        position: relative;
    }

    #tagDropdownMenu {
        position: absolute;
        top: 20px;
        z-index: 4;
    }
    
    .tag {
        margin-left: 20px;
    }
    
    .tag-close {
      font-weight: 700;
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
