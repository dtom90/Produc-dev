<template>
  <b-modal
    id="dataModal"
    title="Data"
    size="lg"
    scrollable
  >
    <pre>{{ $root.$store.state }}</pre>
    <template v-slot:modal-footer>
      <button
        v-if="isElectron"
        type="button"
        class="btn btn-primary"
        @click="saveState"
      >
        Save to File
      </button>
      <button
        v-if="isElectron"
        type="button"
        class="btn btn-danger"
        @click="loadState"
      >
        Load from File
      </button>
    </template>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { initialState } from '../../store'

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(' electron/') > -1

export default {
  name: 'DataModal',
  data: () => ({
    isElectron: isElectron
  }),
  methods: {
    ...mapMutations(['overwriteState']),
    async saveState () {
      if (isElectron) {
        const filePath = await window.electronAPI.saveStateDialog(this.$store.state)
        if (filePath) {
          alert(`DevTrack state saved to ${filePath}`)
        }
      } else {
        alert('Cannot save state on web app!')
      }
    },
    async loadState () {
      if (isElectron) {
        const data = await window.electronAPI.loadStateDialog()
        if (data) {
          const { filePath, jsonObject } = data
          if (Object.keys(initialState).every(key => key in jsonObject)) {
            this.overwriteState(jsonObject)
          } else {
            alert('Error: the   JSON format of this file does not match the format expected by the application!')
          }
          if (filePath) {
            alert(`DevTrack state loaded from ${filePath}`)
          }
        }
      } else {
        alert('Cannot load state on web app!')
      }
    }
  }
}
</script>

<style>
/*noinspection CssUnusedSymbol*/
#dataModal .modal-body {
  max-height: 70vh;
}
</style>
