<template>
  <b-modal
    id="standupModal"
    title="Standup"
    size="lg"
    scrollable
    ok-only
  >
    <h4>Yesterday's Activity</h4>
    <br>
    <table class="table">
      <tr
        v-for="task of yesterdaysActivity"
        :key="task[0]"
      >
        <td>{{ task[0] }}</td>
        <td>{{ displayDuration(task[1]) }}</td>
      </tr>
    </table>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import time, { dayjs } from '../../lib/time'

export default {
  name: 'StandupModal',
  
  mixins: [time],
  
  computed: {
    ...mapGetters([
      'allActivity'
    ]),
    
    yesterdaysActivity () {
      const yesterday = dayjs().subtract(1, 'day').dayOfYear()
      const yesterTasks = this.allActivity.filter(log => dayjs(log.started).dayOfYear() === yesterday)
      return Object.entries(yesterTasks.reduce((sum, task) => {
        sum[task.task] = task.task in sum ? sum[task.task] + task.timeSpent : task.timeSpent
        return sum
      }, {})).sort((a, b) => b[1] - a[1])
    }
  }
}
</script>

<style scoped>

</style>
