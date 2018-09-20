<template>
  <ul class="task-list list-group">
    <li v-for="task in tasks" :key="task.id" class="task list-group-item form-check">
      <div class="row">
        <div class="col">
          <input type="checkbox" :id="'task-'+task.id" v-model="task.completed"/>{{ task.name }}
        </div>
        <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteTask(task.id)">
          <font-awesome-icon icon="trash-alt" />
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: Array,
    deleteTask: Function
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task {
  text-align: left;
}
input {
  margin-right: 20px;
}
</style>
