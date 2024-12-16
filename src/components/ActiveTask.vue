<template>
  <button
    id="active-task-container"
    class="btn btn-light border d-flex justify-content-center align-items-center"
    @click="selectTask({ taskId: task.id })"
  >
    <font-awesome-icon
      id="active-indicator-icon"
      icon="clock"
    />
    <div id="active-task-name">
      <span>{{ task.name }}</span>
    </div>
  </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ActiveTask',
  props: {
    task: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    ...mapActions(['selectTask'])
  }
}
</script>

<style scoped>
#active-task-container {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

#active-indicator-icon {
  color: red;
  width: 4rem;
  height: 4rem;
  margin: 2px 0.75rem 2px 0.75rem;
}

#active-task-name {
  font-weight: 600;
  font-size: xx-large;
  text-align: center;
}
</style>
