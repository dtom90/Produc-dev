<template>
  <div
    id="panel"
    class="border-top"
  >
    <h3 v-if="tag">
      Activity for: {{ tag }}
    </h3>
    
    <!-- View Switch -->
    <ul
      id="viewType"
      class="nav nav-pills d-flex justify-content-center"
    >
      <li
        id="allView"
        class="nav-item"
      >
        <a
          class="nav-link active"
          data-toggle="tab"
          href="#"
          @click="view = 'all'"
        >All Activity</a>
      </li>
      <li
        id="dailyView"
        class="nav-item"
      >
        <a
          class="nav-link"
          data-toggle="tab"
          href="#"
          @click="view = 'daily'"
        >Daily Activity</a>
      </li>
    </ul>

    <!-- Activity Data -->
    <Activity
      v-if="view === 'all'"
      :activity="activityEvents"
    />
    <div v-if="view === 'daily'">
      <Activity
        v-for="(events, day) in activityEvents"
        :key="day"
        :day="day"
        :activity="events"
      />
    </div>
  </div>
</template>

<script>
import Activity from './Activity'
import moment from 'moment'

export default {
  name: 'ActivityView',
  
  components: {
    Activity
  },
  
  props: {
    activity: {
      type: Array,
      default: function () {
        return []
      }
    },
    tag: {
      type: String,
      default: function () {
        return null
      }
    }
  },
  
  data: () => ({
    view: 'all'
  }),
  
  computed: {
  
    activityEvents: function () {
      if (this.view === 'all') {
        return this.activity
      } else {
        const dayActivity = {}
        let day
        for (let event of this.activity) {
          day = moment(event.time).format('YYYY-MM-DD')
          if (day in dayActivity) {
            dayActivity[day].push(event)
          } else {
            dayActivity[day] = [event]
          }
        }
        return dayActivity
      }
    }
    
  }
}
</script>

<style scoped>

  #panel {
    padding: 20px;
  }
  
</style>
