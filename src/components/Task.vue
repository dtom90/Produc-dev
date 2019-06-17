<template>
  <!--  Task List Group Item Wrapper  -->
  <li
    :class="'task list-group-item list-group-item-action form-check'+active"
    @click="$root.selectTask(task.id)"
  >
    <div class="d-flex">
      <span>{{ task.name }}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Task',
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: new Date(),
          completedDate: null,
          completed: false
        }
      }
    }
  },
  computed: {
    active: function () {
      return this.$root.selectedTask === this.task ? ' active' : ''
    }
  }
}
</script>

<style scoped>

</style>
