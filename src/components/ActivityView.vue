<template>
  <div
    :id="id"
    class="activity-view"
  >
    <div class="view-select d-flex justify-content-center position-relative">
      <div
        class="btn-group btn-group-toggle"
      >
        <label
          :class="'btn btn-light' + (dailyChart === true ? ' active' : '')"
          title="Top of List"
        >
          <input
            type="radio"
            value="daily"
            @click="dailyChart = true"
          >
          Daily Activity
        </label>
        <label
          :class="'btn btn-light' + (dailyChart === false ? ' active' : '')"
          title="Bottom of List"
        >
          <input
            type="radio"
            value="weekly"
            @click="dailyChart = false"
          >
          Weekly Activity
        </label>
      </div>
      <div
        v-if="!isTaskActivity"
        class="position-absolute"
        style="right: 0"
      >
        <div class="dropdown">
          <button
            class="btn btn-light"
            data-toggle="dropdown"
          >
            Set Target
          </button>
          <div class="dropdown-menu">
            <label>{{ dailyChart ? 'Daily' : 'Weekly' }} Target:</label>
            <div
              class="input-group"
            >
              <input
                v-model="target"
                type="number"
                class="form-control"
              >
              <div class="input-group-append">
                <span
                  class="input-group-text"
                >hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ActivityChart -->
    <div
      ref="chartWrapper"
      class="chart-wrapper"
    >
      <ActivityChart
        ref="activityChart"
        :chart-data="chartData"
        :styles="chartStyles"
        :target="target * 60"
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
        <span>Activity Log</span>
      </button>
    </div>
    
    <!-- Activity Data -->
    <div
      v-if="logVisible"
      class="border"
    >
      <!-- Dropdown to add interval manually -->
      <DropdownAddInterval
        v-if="manualInput"
        :task-id="taskId"
      />
      
      <!-- Log -->
      <div :id="manualInput ? 'task-log' : ''">
        <Log
          v-for="(dayActivity, day) in dailyActivity.dailyActivity"
          :key="day"
          :day="day"
          :log="dayActivity.log"
          :time-spent="dayActivity.timeSpent"
          :delete-interval-button-clicked="deleteIntervalButtonClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Log from './Log'
import ActivityChart from './ActivityChart'
import DropdownAddInterval from './DropdownAddInterval'
import { mapState, mapMutations } from 'vuex'
import time from '../lib/time'

export default {
  name: 'ActivityView',
  
  components: {
    ActivityChart,
    DropdownAddInterval,
    Log
  },

  mixins: [time],
  
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
    manualInput: {
      type: Boolean,
      default: false
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
      dailyChart: true,
      logVisible: false
    }
  },
  
  computed: {
    
    ...mapState([
      'tasks',
      'tags',
      'totalTarget'
    ]),
    
    isTaskActivity: function () { return this.taskId !== null },
    
    descendingLog: function () { return this.log.slice().reverse() },
    
    target: {
      get () {
        if (this.isTaskActivity) { return null }
        const type = this.dailyChart ? 'dailyTarget' : 'weeklyTarget'
        const targetElement = this.element === 'All Activity' ? this.totalTarget : this.tags[this.element]
        return targetElement[type]
      },
      set (value) {
        const targetPayload = this.element === 'All Activity' ? {} : { tag: this.element }
        targetPayload[this.dailyChart ? 'dailyTarget' : 'weeklyTarget'] = parseFloat(value)
        this.setTarget(targetPayload)
      }
    },
    
    dailyActivity: function () {
      const dailyActivity = {}
      let day
      
      if (this.isTaskActivity) {
        const task = this.tasks.filter(task => task.id === this.taskId)[0]
        if (task.completed) {
          day = this.displayDateISO(task.completed)
          dailyActivity[day] = { log: [{ completed: task.completed }] }
        }
      }
      
      // Create dailyActivity Object from this.log
      for (const event of this.descendingLog) {
        const timestamp = 'started' in event ? event.started : event.completed
        day = this.displayDateISO(timestamp)
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
          label: this.element,
          backgroundColor: '#2020FF',
          data: []
        }]
      }
      
      // Add time spent per day and add to chartData
      Object.keys(dailyActivity).forEach(day => {
        dailyActivity[day].timeSpent = this.calculateTimeSpent(dailyActivity[day].log)
        chartData.labels.unshift(this.displayDateHuman(day))
        chartData.datasets[0].data.unshift(this.msToMinutes(dailyActivity[day].timeSpent))
      })
      
      return { dailyActivity, chartData }
    },
    
    weeklyActivity: function () {
      const weeklyActivity = {}
      let week
      
      // Create dailyActivity Object from this.log
      for (const event of this.log) {
        week = this.displayWeekISO(event.started)
        if (week in weeklyActivity) {
          weeklyActivity[week].log.push(event)
        } else {
          weeklyActivity[week] = { log: [event] }
        }
      }
      
      // Initialize chartData
      const chartData = {
        labels: [],
        datasets: [{
          label: this.element,
          backgroundColor: '#2020FF',
          data: []
        }]
      }
      
      // Add time spent per week and add to chartData
      Object.keys(weeklyActivity).slice().sort().forEach(week => {
        chartData.labels.push(this.displayWeekHuman(week))
        chartData.datasets[0].data.push(this.msToMinutes(this.calculateTimeSpent(weeklyActivity[week].log)))
      })
      
      return chartData
    },
    
    chartData () {
      const chartData = Object.assign({}, this.dailyChart ? this.dailyActivity.chartData : this.weeklyActivity)
      chartData.labels = chartData.labels.slice(-30)
      chartData.datasets[0].data = chartData.datasets[0].data.slice(-30)
      return chartData
    },
    
    chartStyles () {
      const width = 50 + this.chartData.labels.length * 100
      
      return width > 600 ? {
        width: `${width}px`,
        height: '400px',
        position: 'relative'
      } : {
        height: '400px'
      }
    }
    
  },
  
  methods: {
    
    ...mapMutations([
      'setTarget',
      'deleteInterval'
    ]),
    
    calculateTimeSpent (log) {
      return log.filter(interval => interval.timeSpent)
        .reduce((total, interval) => total + interval.timeSpent, 0)
    },
    
    toggleLog () {
      this.logVisible = !this.logVisible
    },
    
    deleteIntervalButtonClicked (startedTime) {
      this.deleteInterval({
        taskId: this.taskId,
        startedTime
      })
    }
  }
}
</script>

<style scoped>
  
  .view-select {
    margin-bottom: 20px;
  }
  
  .activity-view {
    padding: 20px;
  }
  
  .chart-wrapper {
    width: 100%;
    overflow-x: auto;
  }
  
  #viewLogSwitch {
    font-size: 1.25rem;
    font-weight: 500;
  }
  
  /*noinspection CssUnusedSymbol*/
  #task-log {
    margin-top: -38px;
  }
  
</style>
