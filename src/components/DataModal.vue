<template>
  <div
    id="dataModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="dataModalLabel"
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
          <button
            v-if="isElectron"
            type="button"
            class="btn btn-danger"
            @click="loadState"
          >
            Load from File
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(' electron/') > -1

export default {
  name: 'DataModal',
  data: () => ({
    isElectron: isElectron
  }),
  methods: {
    ...mapMutations(['overwriteState']),
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
    },
    loadState () {
      if (this.isElectron) {
        const { dialog, app } = require('electron').remote
        const fs = require('fs')
        const path = require('path')
        dialog.showOpenDialog({
          title: 'Load Data',
          defaultPath: path.join(app.getPath('desktop'), '/DevTrack.json'),
          properties: ['openFile'],
          filters: [
            { name: 'JSON', extensions: ['json'] }
          ]
        })
          .then(open => {
            if (!open.canceled) {
              fs.readFile(open.filePaths[0], { encoding: 'utf8' }, (err, data) => {
                if (err) {
                  alert(err)
                } else {
                  try {
                    const json = JSON.parse(data)
                    const { initialState } = require('../store')
                    if (Object.keys(initialState).every(key => key in json)) {
                      this.overwriteState(json)
                    } else {
                      alert('Error: the JSON format of this file does not match the format expected by the application!')
                    }
                  } catch (e) {
                    if (e instanceof SyntaxError) {
                      alert(`The file you selected, ${open.filePaths[0]}, does not appear to be a JSON file!`)
                    } else {
                      alert(e)
                    }
                  }
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
