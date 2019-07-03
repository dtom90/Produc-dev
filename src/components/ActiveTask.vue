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

      <!-- Countdown Timer -->
      <Countdown
        v-if="!task.completed"
        :task-id="task.id"
      />

      <!-- Task Time Spent -->
      <br>
      <h4>Time Spent: {{ timeSpent }}</h4>

      <!-- Task Activity Log -->
      <br>
      <table
        id="activity-log"
        class="table"
      >
        <tr
          v-for="(event, index) in taskEvents"
          :key="index"
        >
          <th>{{ eventNames[event.type] }}: </th>
          <td>{{ displayDateTime(event.time) }}</td>
        </tr>
      </table>
      <br>
    </div>
  </div>
</template>

<script>
import Countdown from './Countdown'
import { eventTypes, eventNames } from '@/constants'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  
  name: 'ActiveTask',
  
  components: {
    Countdown
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
    editing: false
  }),
  
  computed: {

    eventNames: function () {
      return eventNames
    },
    
    taskEvents: function () {
      const taskEvents = this.task.activity.slice()
      taskEvents.reverse()
      return taskEvents
    },
    
    timeSpent: function () {
      return moment.duration(
        this.task.activity
          .filter((event, i) =>
            (event.type === eventTypes.Started && i !== this.task.activity.length - 1) ||
                              event.type === eventTypes.Stopped)
          .reduce((total, event) => event.type === eventTypes.Started
            ? total - event.time
            : total + event.time, 0)
      ).humanize()
    }
    
  },
  
  methods: {
    
    ...mapMutations([
      'completeTask',
      'deleteTask'
    ]),
    
    displayDateTime: date => moment(date).format('ddd MMM DD, h:mm a')
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

    .btn {
        margin: 8px;
    }

    $play-btn-size: 75px;

    #play-btn {
        width: $play-btn-size;
        height: $play-btn-size;
        font-size: 28px;
        border-radius: $play-btn-size;
    }

    #activity-log {
        font-size: 16px;
    }
</style>
