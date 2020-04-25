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
            data-target="#tagModal"
            href="javascript:void(0);"
          >Tags</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="modal"
            data-target="#dataModal"
            href="javascript:void(0);"
          >Data</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data: function () {
    return {
      displayTime: '',
      currentMinute: null
    }
  },
  mounted () {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    updateTime () {
      const currentDate = new Date()
      const currentMinute = currentDate.getMinutes()
      if (currentMinute !== this.currentMinute) {
        this.currentMinute = currentMinute
        this.displayTime = `${currentDate.getHours()}:${this.currentMinute}`
      }
    }
  }
}
</script>

<style scoped>
#time-container {
  position: fixed;
  width: 100%;
  margin: 0 -16px;
  display: flex;
  justify-content: center;
  font-size: larger;
}
</style>
