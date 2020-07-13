<template>
  <div
    id="standupModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="tagModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            Standup
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          class="modal-body"
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
        </div>
        <div class="modal-footer" />
      </div>
    </div>
  </div>
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
