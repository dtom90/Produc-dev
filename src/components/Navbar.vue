<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">DevTrack</span>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarMenuOptions"
      aria-controls="navbarMenuOptions"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    
    <div id="time-container">
      <span>{{ displayTime }}</span>
    </div>
    
    <div
      id="navbarMenuOptions"
      class="collapse navbar-collapse"
    >
      <ul class="navbar-nav ml-auto">
        <b-nav-item v-b-modal.allActivityModal>
          All Activity
        </b-nav-item>
        <b-nav-item v-b-modal.standupModal>
          Standup
        </b-nav-item>
        <b-nav-item v-b-modal.tagModal>
          Tags
        </b-nav-item>
        <b-nav-item-dropdown
          text="Options"
          boundary="viewport"
        >
          <b-dropdown-item-button>
            <b-form-checkbox v-model="checkboxEnableNotifications">
              Enable Notifications
            </b-form-checkbox>
          </b-dropdown-item-button>
          <b-dropdown-item-button>
            <b-form-checkbox v-model="timeFormat">
              Use 24-hour Clock
            </b-form-checkbox>
          </b-dropdown-item-button>
          <div class="dropdown-divider" />
          <b-dropdown-item-button v-b-modal.dataModal>
            Data
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </ul>
    </div>
  </nav>
</template>

<script>
import time from '../lib/time'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Navbar',
  
  mixins: [time],
  
  data: function () {
    return {
      currentDate: null,
      currentMinute: null
    }
  },
  
  computed: {
    ...mapState([
      'globalNotificationsEnabled',
      'timeFormat24'
    ]),
    
    displayTime () {
      return this.displayTimeHuman(this.currentDate)
    },
    
    checkboxEnableNotifications: {
      get () {
        return this.globalNotificationsEnabled
      },
      set (newValue) {
        this.setNotificationsEnabled(newValue)
      }
    },
    
    timeFormat: {
      get () {
        return this.timeFormat24
      },
      set (newValue) {
        this.setTimeFormat(newValue)
      }
    }
  },
  
  mounted () {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  
  methods: {
    ...mapMutations([
      'setNotificationsEnabled',
      'setTimeFormat'
    ]),
    
    updateTime () {
      this.currentDate = new Date()
    }
  }
}
</script>

<style scoped lang="scss">
.navbar-brand {
  z-index: 2;
}

.navbar-toggler {
  z-index: 2;
}

#time-container {
  position: fixed;
  z-index: 1;
  width: 100%;
  margin: 0 -16px;
  display: flex;
  justify-content: center;
  font-size: larger;
}

#navbarMenuOptions {
  z-index: 4;
}
</style>
