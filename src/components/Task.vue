<template>
  <li class="task list-group-item form-check">
    <div class="row">
      <div class="col">
        <input class="task-checkbox" type="checkbox" v-model="task.completed"/>
        <span v-if="!editing" v-on:click="editing = true">{{task.name}}</span>
        <span v-if="editing">
          <input v-model="task.name" @keyup.enter="editing = false"/>
          <button type="button" class="btn btn-primary" v-on:click="editing = false">
            <font-awesome-icon icon="save"/>
          </button>
        </span>
      </div>
      <button type="button" class="btn btn-danger btn-sm" v-on:click="$root.deleteTask(task.id)">
        <font-awesome-icon icon="trash-alt"/>
      </button>
    </div>
  </li>
</template>

<script>
  export default {
    name: "Task",
    props: {
      task: Object
    },
    data: () => ({
      editing: false
    })
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
