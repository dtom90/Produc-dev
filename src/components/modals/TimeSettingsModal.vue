<template>
  <b-modal
    id="time-settings-modal"
    title="Time Settings"
  >
    <b-form-checkbox v-model="timeFormat">
      Use 24-hour Clock
    </b-form-checkbox>
  </b-modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TimeSettingsModal',
  
  computed: {
    ...mapState(['timeFormat24']),
    
    timeFormat: {
      get () {
        return this.timeFormat24
      },
      set (newValue) {
        this.setTimeFormat(newValue)
      }
    }
  },
  
  methods: {
    ...mapMutations(['setTimeFormat'])
  }
}
</script>

<style scoped>

</style>
