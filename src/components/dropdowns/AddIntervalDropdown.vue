<template>
  <div
    style="display: flex; justify-content: flex-end;"
  >
    <b-dropdown
      ref="dropdown"
      right
      variant="light"
      toggle-class="text-decoration-none"
      no-caret
      @show="dropdownWillShow"
      @shown="dropdownShown = true"
      @hide="dropdownWillHide"
      @hidden="dropdownShown = false"
    >
      <template v-slot:button-content>
        <font-awesome-icon :icon="dropdownShown ? 'times' : 'plus'" />
      </template>
      <b-dropdown-form @submit="addIntervalButtonClicked">
        <b-form-group>
          Duration:
          <b-input-group append="minutes">
            <b-form-input
              ref="appendMinutesInput"
              v-model="appendMinutes"
              type="number"
              @blur="handleBlur"
            />
          </b-input-group>
        </b-form-group>
        
        <b-form-group>
          Ending At:
          <VueCtkDateTimePicker
            v-model="endTime"
            :format="displayDateTimeFormat()"
            :right="true"
          />
        </b-form-group>
        
        <b-btn
          variant="primary"
          style="width: 258px"
          @click="addIntervalButtonClicked"
        >
          Add Interval
        </b-btn>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import time from '../../lib/time'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  name: 'AddIntervalDropdown',
  
  components: {
    VueCtkDateTimePicker
  },
  
  mixins: [time],
  
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  
  data: function () {
    return {
      dropdownShown: false,
      dropdownHide: null,
      intentionalEnter: false,
      appendMinutes: 25,
      endTime: this.displayDateTimeHuman()
    }
  },
  
  methods: {
    ...mapActions(['addInterval']),
    
    dropdownWillShow () {
      this.endTime = this.displayDateTimeHuman()
    },
    
    dropdownWillHide (event) {
      if (!this.intentionalEnter) {
        this.dropdownHide = event
        setTimeout(this.clearDropdownHide, 1000)
      } else {
        this.intentionalEnter = false
      }
    },
    
    clearDropdownHide () {
      this.dropdownHide = null
    },
    
    handleBlur (event) {
      if (event.sourceCapabilities === null && this.dropdownHide !== null) {
        setTimeout(() => {
          this.$refs.dropdown.show()
          setTimeout(() => event.target.focus(), 50)
        }, 50)
      }
    },
    
    addIntervalButtonClicked (event) {
      this.intentionalEnter = true
      event.preventDefault()
      this.addInterval({
        taskId: this.taskId,
        stopped: this.stringToMs(this.endTime),
        timeSpent: this.minutesToMs(this.appendMinutes)
      })
      this.$refs.dropdown.hide()
    }
  }
}
</script>

<style scoped>

</style>
