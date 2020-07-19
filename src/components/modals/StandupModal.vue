<template>
  <b-modal
    id="standupModal"
    title="Standup"
    size="lg"
    scrollable
    ok-only
  >
    <h4>{{ displayFullDateHuman(lastDay) }} Activity</h4>
    <br>
    <table class="table">
      <tr
        v-for="task of lastDaysActivity"
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
    
    lastDay () {
      return dayjs(this.allActivity[this.allActivity.length - 1].started)
    },
    
    lastDaysActivity () {
      const yesterTasks = this.allActivity.filter(log =>
        dayjs(log.started).dayOfYear() === this.lastDay.dayOfYear() &&
        dayjs(log.started).year() === this.lastDay.year()
      )
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
