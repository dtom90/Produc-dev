<template>
  <div
    :id="id"
    class="activity-view"
  >
    <h3>
      Activity for <strong>{{ element }}</strong>
    </h3>
    
    <!-- ActivityChart -->
    <div
      ref="chartWrapper"
      class="chart-wrapper"
    >
      <ActivityChart
        ref="activityChart"
        :chart-data="dailyActivity.chartData"
        :styles="chartStyles"
      />
    </div>
    
    <br>
    
    <!-- Log View Switch -->
    <div
      id="viewType"
      class="d-flex justify-content-center"
    >
      <button
        id="viewLogSwitch"
        :class="'btn btn-light nav-link' + (logVisible ? ' active' : '')"
        :title="(logVisible ? 'Hide' : 'Show') + ' activity log'"
        @click="toggleLog"
      >
        Activity Log
      </button>
    </div>

    <!-- Activity Data -->
    <div
      v-if="logVisible"
      class="border"
    >
      <!-- Input to enter interval manually -->
      <div
        v-if="id === 'taskActivity'"
        style="position: relative"
      >
        <div style="position: absolute; right: 0">
          <button
            class="btn btn-light"
            :title="showIntervalInput ? 'Cancel' : 'Add interval manually'"
            @click="showIntervalInput = !showIntervalInput"
          >
            <font-awesome-icon
              v-if="!showIntervalInput"
              icon="plus"
            />
            <font-awesome-icon
              v-if="showIntervalInput"
              icon="times"
            />
          </button>
        </div>
        <div
          v-if="showIntervalInput"
          style="position: absolute; right: 37px;"
        >
          <div
            class="input-group"
            style="width: 140px"
          >
            <input
              ref="intervalMinutesInput"
              type="number"
              value="25"
              class="form-control"
            >
            <div class="input-group-append">
              <span
                class="input-group-text"
              >minutes</span>
            </div>
          </div>
          <button
            class="btn btn-primary"
            @click="addIntervalButtonClicked"
          >
            Add Interval
          </button>
        </div>
      </div>
      
      <!-- Log -->
      <Log
        v-for="(dayActivity, day) in dailyActivity.dailyActivity"
        :key="day"
        :day="day"
        :log="dayActivity.log"
        :time-spent="dayActivity.timeSpent"
      />
    </div>
  </div>
</template>

<script>
import Log from './Log'
import ActivityChart from './ActivityChart'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'ActivityView',
  
  components: {
    Log,
    ActivityChart
  },
  
  props: {
    id: {
      type: String,
      default: 'taskActivity'
    },
    taskId: {
      type: Number,
      default: null
    },
    element: {
      type: String,
      default: ''
    },
    log: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  
  data: function () {
    return {
      logVisible: false,
      showIntervalInput: false
    }
  },
  
  computed: {
    
    descendingLog: function () { return this.log.slice().reverse() },
    
    dailyActivity: function () {
      const dailyActivity = {}
      let day
      
      // Create dailyActivity Object from this.log
      for (const event of this.descendingLog) {
        day = moment(event.started).format('YYYY-MM-DD')
        if (day in dailyActivity) {
          dailyActivity[day].log.push(event)
        } else {
          dailyActivity[day] = { log: [event] }
        }
      }
      
      // Initialize chartData
      const chartData = {
        labels: [],
        datasets: [{
          label: 'Activity for ' + this.element,
          backgroundColor: '#2020FF',
          data: []
        }]
      }
      
      // Add time spent per day and add to chartData
      Object.keys(dailyActivity).forEach(day => {
        dailyActivity[day].timeSpent = this.calculateTimeSpent(dailyActivity[day].log)
        chartData.labels.unshift(moment(day, 'YYYY-MM-DD').format('ddd MMM DD'))
        chartData.datasets[0].data.unshift(dailyActivity[day].timeSpent.asMinutes())
      })
      
      return { dailyActivity, chartData }
    },
    
    chartWidth () {
      return 50 + this.dailyActivity.chartData.labels.length * 100
    },
    
    chartStyles () {
      return {
        width: `${this.chartWidth}px`,
        height: '400px',
        position: 'relative'
      }
    }
    
  },
  
  // updated () {
  //   this.$ready(() => {
  //     const container = this.$refs.chartWrapper
  //     console.log(container.clientWidth)
  //     container.scrollLeft = this.chartWidth
  //   })
  // },
  
  methods: {
    
    ...mapMutations(['addInterval']),
    
    calculateTimeSpent (log) {
      return moment.duration(
        log.filter(interval => interval.timeSpent)
          .reduce((total, interval) => total + interval.timeSpent, 0)
      )
    },
    
    toggleLog () {
      this.logVisible = !this.logVisible
    },
    
    addIntervalButtonClicked () {
      this.addInterval({
        id: this.taskId,
        timeSpent: this.$refs.intervalMinutesInput.value * 60000 // convert minutes to ms
      })
    }
  }
}
</script>

<style scoped>
  
  .activity-view {
    padding: 20px;
  }
  
  .chart-wrapper {
    border: red 1px solid;
    max-width: 600px;
    overflow-x: auto;
  }
  
</style>
