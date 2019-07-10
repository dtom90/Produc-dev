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
          <!--  Checkbox Container  -->
          <div class="checkbox-container">
            <input
              v-model="task.completed"
              class="task-checkbox"
              type="checkbox"
              @change="completeTask(task.id)"
            >
            <span class="check-custom" />
          </div>

          <!--  Task Name & Field (when editing)  -->
          <div class="task-name-container">
            <span
              v-if="!editing"
              class="task-name"
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
            class="btn btn-primary"
          >
            {{ tag }}
          </button>
          <button
            class="btn btn-primary"
            @click="removeTag(tag)"
          >
            x
          </button>
        </div>
      </div>
      
      <!-- Countdown Timer -->
      <Countdown
        v-if="!task.completed"
        :task-id="task.id"
      />
      <br>
      
      <!-- View Switch -->
      <ul
        id="view-type"
        class="nav nav-pills d-flex justify-content-center"
      >
        <li
          id="all-view"
          class="nav-item"
        >
          <a
            class="nav-link active"
            data-toggle="tab"
            href="#"
            @click="view = 'all'"
          >All Activity</a>
        </li>
        <li
          id="daily-view"
          class="nav-item"
        >
          <a
            class="nav-link"
            data-toggle="tab"
            href="#"
            @click="view = 'daily'"
          >Daily Activity</a>
        </li>
      </ul>
      
      <br>
      <Activity
        v-if="view === 'all'"
        :activity="activityEvents"
      />
      <div v-if="view === 'daily'">
        <Activity
          v-for="(events, day) in activityEvents"
          :key="day"
          :day="day"
          :activity="events"
        />
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import Countdown from './Countdown'
import Activity from './Activity'
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  
  name: 'ActiveTask',
  
  components: {
    Countdown,
    Activity
  },
  
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: Date.now(),
          activity: [{
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
    view: 'all'
  }),
  
  computed: {
    
    ...mapGetters([
      'availableTags'
    ]),
    
    activityEvents: function () {
      if (this.view === 'all') {
        return this.task.activity
      } else {
        const dayActivity = {}
        let day
        for (let event of this.task.activity) {
          day = moment(event.time).format('YYYY-MM-DD')
          if (day in dayActivity) {
            dayActivity[day].push(event)
          } else {
            dayActivity[day] = [event]
          }
        }
        return dayActivity
      }
    }
    
  },
  
  methods: {
    
    ...mapMutations([
      'addTaskTag',
      'removeTaskTag',
      'completeTask',
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

    .task-name-container {
        margin-left: 5px;
    }

    .task-name {
        font-weight: 600;
        font-size: xx-large;
    }

    /* Adapted from https://hackernoon.com/hacking-custom-checkboxes-and-radios-5d48230440d */

    $checkbox-size: 2.2rem;

    .checkbox-container {
        margin-right: 25px;
        position: relative;
        width: $checkbox-size;
        height: $checkbox-size;
    }

    .checkbox-container > * {
        position: absolute;
        width: $checkbox-size;
        height: $checkbox-size;
    }

    /* Styles for hiding the native checkbox */
    .task-checkbox {
        z-index: 2;
        opacity: 0;
        cursor: pointer;
    }

    /* Styles for the basic appearance of the custom checkbox */
    .check-custom {
        border: 2px solid #969696;
        border-radius: 50%;
    }

    /* Styles for the hover state of the custom checkbox */
    .task-checkbox:hover ~ .check-custom {
        border-color: #b0d5ff;
        box-shadow: 0 0 0 2px rgba(23, 133, 255, 0.25);
    }

    /* Styles for the checked state of the custom checkbox */
    .task-checkbox:checked ~ .check-custom {
        border-color: #1785ff;
        background: #1785ff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
        background-size: 75%;
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
