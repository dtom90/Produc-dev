<template>
  <!--  Task List Group Item Wrapper  -->
  <li
    :class="'task list-group-item list-group-item-action form-check'+active"
    @click="selectTask(task.id)"
  >
    <div class="d-flex align-items-center">
      <Checkbox
        :checked="checked"
        :task-id="task.id"
      />
      <span class="task-name">{{ task.name }}</span>
    </div>
  </li>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Checkbox from './Checkbox'

export default {
  
  name: 'Task',
  components: { Checkbox },
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: Date.now(),
          completed: false
        }
      }
    }
  },
  
  computed: {
    
    ...mapState([
      'selectedTaskID'
    ]),
    
    active: function () {
      return this.selectedTaskID === this.task.id ? ' active' : ''
    },

    checked: function () {
      return this.task.completed !== null
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
.task-name {
  flex: 1;
  text-align: left;
}
</style>
