<template>
  <div
    id="exampleModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            Data
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          class="modal-body"
        >
          <pre>{{ $root.$store.state }}</pre>
        </div>
        <div class="modal-footer">
          <button
            v-if="isElectron"
            type="button"
            class="btn btn-primary"
            @click="saveState"
          >
            Save to File
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(' electron/') > -1

export default {
  name: 'DataModal',
  data: () => ({
    isElectron: isElectron
  }),
  methods: {
    saveState () {
      if (this.isElectron) {
        const { dialog, app } = require('electron').remote
        const fs = require('fs')
        const path = require('path')
        dialog.showSaveDialog({
          title: 'Save Data',
          defaultPath: path.join(app.getPath('desktop'), '/DevTrack.json')
        })
          .then(save => {
            if (!save.canceled) {
              fs.writeFile(save.filePath, JSON.stringify(this.$store.state, null, 2), err => {
                if (err) {
                  alert(err)
                }
              })
            }
          })
      }
    }
  }
}
</script>

<style scoped>
.modal-body {
  height: 70vh;
  overflow-y: auto;
}
</style>
