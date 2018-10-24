<template>
  <li class="task list-group-item form-check">
    <div class="row">
      <div class="col">
        <input class="task-checkbox" type="checkbox" v-model="task.completed" @change="$root.completeTask(task.id)"/>
        <span v-if="!editing" v-on:click="editing = true">{{task.name}}</span>
        <span v-if="editing">
          <input class="edit-task" v-model="task.name" @keyup.enter="editing = false"/>
          <button type="button" class="btn btn-primary" v-on:click="editing = false">
            <font-awesome-icon icon="save"/>
          </button>
        </span>
      </div>
      <div class="dropright">
        <button type="button" class="btn btn-light" data-toggle="dropdown">
          <font-awesome-icon icon="ellipsis-h"/>
        </button>
        <div class="dropdown-menu">
          <h6>
            Created:
          </h6>
          <div>
            {{createdDate}}
          </div>
          <div>
            {{createdTime}}
          </div>
          <div class="dropdown-divider"></div>
          <button type="button" class="btn btn-danger btn-sm" v-on:click="$root.deleteTask(task.id)">
            <font-awesome-icon icon="trash-alt"/>
          </button>
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
      createdDate: function() {
        return moment(this.task.createdDate).format('ddd MMM DD YYYY,')
      },
      createdTime: function() {
        return moment(this.task.createdDate).format('h:mm a')
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
</style>
