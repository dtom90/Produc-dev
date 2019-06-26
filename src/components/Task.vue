<template>
  <!--  Task List Group Item Wrapper  -->
  <li
    :class="'task list-group-item list-group-item-action form-check'+active"
    @click="selectTask(task.id)"
  >
    <div class="d-flex">
      <span>{{ task.name }}</span>
    </div>
  </li>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  
  name: 'Task',
  
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: Date.now(),
          completedDate: null,
          completed: false
        }
      }
    }
  },
  
  computed: {
    
    ...mapState([
      'selectedTask'
    ]),
    
    active: function () {
      return this.selectedTask === this.task ? ' active' : ''
    }
  },
  
  methods: {
    ...mapMutations([
      'selectTask'
    ])
  }
  
}
</script>

<style scoped>

</style>
