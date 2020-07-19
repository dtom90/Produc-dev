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
                    const { initialState } = require('../../store')
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

<style>
/*noinspection CssUnusedSymbol*/
#dataModal .modal-body {
  max-height: 70vh;
}
</style>
