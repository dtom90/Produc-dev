<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
    <b-navbar-brand href="#">
      DevTrack
    </b-navbar-brand>
    
    <div id="time-container">
      <span>{{ displayTime }}</span>
    </div>
    
    <div class="navbar-menu d-flex flex-column align-items-end">
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-b-modal.allActivityModal>
            All Activity
          </b-nav-item>
          <b-nav-item v-b-modal.standupModal>
            Standup
          </b-nav-item>
          <b-nav-item v-b-modal.tagModal>
            Tags
          </b-nav-item>
          <NavbarOptionsDropdown />
        </b-navbar-nav>
      </b-collapse>
    </div>
  </nav>
</template>

<script>
import time from '../lib/time'
import NavbarOptionsDropdown from './dropdowns/NavbarOptionsDropdown'

export default {
  name: 'Navbar',
  
  components: {
    NavbarOptionsDropdown
  },
  
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

.navbar-brand, .navbar-menu, .navbar-toggler {
  flex: 1;
}

.navbar-toggler {
  z-index: 2;
}

#navbarMenuOptions {
  z-index: 4;
}
</style>
