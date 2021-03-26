<template>
  <b-modal
    id="standupModal"
    title="Standup"
    size="lg"
    scrollable
    ok-only
  >
    <h4>{{ lastDayDisplay }}</h4>
    <br>
    <table class="table">
      <tr
        v-for="task of lastDaysActivity"
        :key="task[0]"
      >
        <td class="d-flex align-items-center">
          <Checkbox
            :checked="completedTasks.filter(completedTask => completedTask.name === task[0]).length > 0"
            :disabled="true"
          />
          <span>{{ task[0] }}</span>
        </td>
        <td>{{ displayDuration(task[1]) }}</td>
      </tr>
    </table>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import time, { dayjs } from '../../lib/time'
import Checkbox from '@/components/Checkbox'

export default {
  name: 'StandupModal',
  components: { Checkbox },
  mixins: [time],
  
  computed: {
    ...mapGetters([
      'allActivity',
      'completedTasks'
    ]),
    
    lastDay () {
      const today = dayjs()
      for (let i = this.allActivity.length - 1; i > 0; i--) {
        const day = dayjs(this.allActivity[i].started)
        if (day.dayOfYear() < today.dayOfYear() && day.year() === today.year()) {
          return day
        }
      }
      return null
    },
    
    lastDayDisplay () {
      return this.lastDay === null ? 'No Activity Yet' : this.displayFullDateHuman(this.lastDay) + ' Activity'
    },
    
    lastDaysActivity () {
      if (this.lastDay === null) {
        return []
      }
      const yesterTasks = this.allActivity.filter(log => {
        return log.started && dayjs(log.started).dayOfYear() === this.lastDay.dayOfYear() &&
          dayjs(log.started).year() === this.lastDay.year()
      })
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
