<template>
  <li class="task list-group-item form-check">
    <div class="d-flex">
      <div class="flex-grow-1 d-flex align-items-center">
        <input class="task-checkbox" type="checkbox" v-model="task.completed" @change="$root.completeTask(task.id)"/>
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

  .task-checkbox {
    margin-right: 20px;
  }

  .dropdown-menu > :not(.dropdown-divider) {
    margin-left: 8px;
  }

  .dropdown-menu button {
    margin-right: 8px;
  }
</style>
