<template>
  <div>
    <button
      id="play-btn"
      type="button"
      class="btn btn-success btn-lg"
      @click="startTimer"
    >
      <font-awesome-icon icon="play" />
    </button>
    <p>
      {{ timeRemaining }}
    </p>
  </div>
</template>

<script>

const TIMER = 5

export default {
  
  name: 'Countdown',
  
  data: () => ({
    timeRemaining: 0
  }),
  
  methods: {
    
    startTimer () {
      this.timeRemaining = TIMER
      this.timer = setInterval(this.decrementTimer, 1000)
    },
    
    // Countdown function
    decrementTimer () {
      if (this.timeRemaining > 1) {
        this.timeRemaining -= 1
      } else {
        this.finishTimer()
      }
    },
  
    finishTimer () {
      this.timeRemaining = 0
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>

</style>
