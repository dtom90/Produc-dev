<template>
    <li class="task list-group-item form-check">
        <div class="row">
            <div class="col">
                <input type="checkbox" :id="'task-'+task.id" v-model="task.completed"/>{{ task.name }}
            </div>
            <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteTask(task.id)">
                <font-awesome-icon icon="trash-alt" />
            </button>
        </div>
    </li>
</template>

<script>
  export default {
    name: "Task",
    props: {
      task: Object,
      deleteTask: Function
    },
  }
</script>

<style scoped>
    .task {
        text-align: left;
    }
    input {
        margin-right: 20px;
    }
</style>