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
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="modal"
            data-target="#allActivityModal"
            href="javascript:void(0);"
          >All Activity</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="modal"
            data-target="#standupModal"
            href="javascript:void(0);"
          >Standup</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="modal"
            data-target="#tagModal"
            href="javascript:void(0);"
          >Tags</a>
        </li>
        <li class="nav-item dropdown">
          <a
            id="optionsDropdown"
            class="nav-link dropdown-toggle"
            href="javascript:void(0);"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Options
          </a>
          <div
            class="dropdown-menu dropdown-menu-right"
            aria-labelledby="optionsDropdown"
          >
            <b-dropdown-item v-b-modal.time-settings-modal>
              Time Settings
            </b-dropdown-item>
            <div class="dropdown-divider" />
            <a
              class="dropdown-item"
              data-toggle="modal"
              data-target="#dataModal"
              href="javascript:void(0);"
            >Data</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import time from '../lib/time'

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
    displayTime () {
      return this.displayTimeHuman(this.currentDate)
    }
  },
  
  mounted () {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  
  methods: {
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
