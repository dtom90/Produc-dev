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
      <font-awesome-icon
        v-if="displayCountdownIndicator"
        id="indicatorIcon"
        icon="clock"
      />
    </div>
    <div class="d-flex">
      <span
        v-for="tag in taskTags"
        :key="tag"
        class="badge mini-tag"
        :style="{backgroundColor: tags[tag].color}"
      >&nbsp;&nbsp;</span>
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
      'tags',
      'tagOrder',
      'selectedTaskID',
      'activeTaskID'
    ]),
    
    active () {
      return this.selectedTaskID === this.task.id ? ' active' : ''
    },

    checked () {
      return this.task.completed !== null
    },
    
    taskTags () {
      return this.task.tags.slice().sort((a, b) => this.tagOrder.indexOf(a) - this.tagOrder.indexOf(b))
    },
    
    displayCountdownIndicator () {
      return this.activeTaskID === this.task.id
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

#indicatorIcon {
  color: red;
  width: 2rem;
  height: 2rem;
}

.mini-tag {
  width: 50px;
  height: 10px;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
