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
    
    <p
      v-if="!editing"
      id="timerDisplay"
      @click="editing = true"
    >
      {{ timeRemaining }}
    </p>
    
    <div class="d-flex justify-content-center">
      <div
        v-if="editing"
        id="edit-container"
        class="input-group"
      >
        <input
          v-model="timeRemaining"
          type="number"
          class="form-control"
          @keyup.enter="editing = false"
        >
        <div class="input-group-append">
          <button
            type="button"
            class="btn btn-primary"
            @click="editing = false"
          >
            <font-awesome-icon icon="save" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const TIMER = 25

export default {
  
  name: 'Countdown',
  
  data: () => ({
    timeRemaining: TIMER,
    editing: false
  }),
  
  methods: {
    
    startTimer () {
      this.timer = setInterval(this.decrementTimer, 1000)
    },
    
    decrementTimer () {
      if (this.timeRemaining > 1) {
        this.timeRemaining -= 1
      } else {
        this.finishTimer()
      }
    },
    
    finishTimer () {
      this.timeRemaining = TIMER
      clearInterval(this.timer)
    }
  }
}

</script>

<style scoped>

#edit-container {
  max-width: 110px;
}

</style>
