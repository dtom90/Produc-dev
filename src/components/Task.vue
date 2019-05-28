<template>
  <li class="task list-group-item form-check">
    <div class="d-flex">
      <div class="flex-grow-1 d-flex align-items-center">
        <div class="checkbox-container">
          <input class="task-checkbox" type="checkbox" v-model="task.completed" @change="$root.completeTask(task.id)"/>
          <span class="check-custom"></span>
        </div>
        <span v-if="!editing" v-on:click="editing = true">{{task.name}}</span>
        <div v-if="editing" class="d-flex align-items-center">
          <input class="edit-task" v-model="task.name" @keyup.enter="editing = false"/>
          <button type="button" class="btn btn-primary" v-on:click="editing = false">
            <font-awesome-icon icon="save"/>
          </button>
        </div>
      </div>
      <div class="dropright">
        <button type="button" class="btn btn-light" data-toggle="dropdown">
          <font-awesome-icon icon="ellipsis-h"/>
        </button>
        <div class="dropdown-menu">
          <h6>
            {{dateType}} on
          </h6>
          <div>
            {{displayDate}}
          </div>
          <div>
            {{displayTime}}
          </div>
          <div class="dropdown-divider"></div>
          <div class="flex-column">
            <button type="button" class="btn btn-warning btn-sm" v-on:click="editing = true">
              <font-awesome-icon icon="pencil-alt"/>
            </button>
            <button type="button" class="btn btn-danger btn-sm" v-on:click="$root.deleteTask(task.id)">
              <font-awesome-icon icon="trash-alt"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "Task",
    props: {
      task: Object
    },
    data: () => ({
      editing: false
    }),
    computed: {
      dateType: function() {
        return this.task.completed ? 'Completed' : 'Created'
      },
      date: function() {
        return this.task.completed ? this.task.completedDate : this.task.createdDate
      },
      displayDate: function() {
        return moment(this.date).format('ddd MMM DD YYYY,')
      },
      displayTime: function() {
        return moment(this.date).format('h:mm a')
      }
    }
  }
</script>

<style scoped>
  .task {
    text-align: left;
  }

  /* Adapted from https://hackernoon.com/hacking-custom-checkboxes-and-radios-5d48230440d */

  .checkbox-container {
    margin-right: 20px;
    position: relative;
    width: 2rem;
    height: 2rem;
  }

  .checkbox-container > * {
    position: absolute;
    width: 2rem;
    height: 2rem;
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
    border-color: #4a4a4a;
  }

  /* Styles for the focus state of the custom checkbox */
  .task-checkbox:focus ~ .check-custom {
    border-color: #b0d5ff;
    box-shadow: 0 0 0 2px rgba(23, 133, 255, 0.25);
  }

  /* Styles for the checked state of the custom checkbox */
  .task-checkbox:checked ~ .check-custom {
    border-color: #1785ff;
    background: #1785ff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
    background-size: 75%;
  }

  .dropdown-menu > :not(.dropdown-divider) {
    margin-left: 8px;
  }

  .dropdown-menu button {
    margin-right: 8px;
  }
</style>
