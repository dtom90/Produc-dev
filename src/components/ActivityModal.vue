<template>
  <div
    v-if="tag"
    id="activityModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3
              id="exampleModalLabel"
            >
              Activity for&nbsp;
            </h3>
            <button
              class="btn tag-button"
              :style="`backgroundColor: ${tagProperties.color}`"
              data-toggle="dropdown"
            >
              {{ tag }}
            </button>
            <div
              id="tag-menu"
              class="dropdown-menu"
            >
              <div
                class="d-flex align-items-center"
              >
                <input
                  v-model="newTagName"
                  @keyup.enter="updateTagName"
                >
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="updateTagName"
                >
                  <font-awesome-icon icon="save" />
                </button>
              </div>
              <div class="dropdown-divider" />
              <sketch-picker
                :value="color"
                @input="updateTagColor"
              />
              <div class="dropdown-divider" />
              <button
                id="delete-tag-btn"
                type="button"
                class="btn btn-danger"
                title="Delete tag"
                @click="deleteTag({tag})"
              >
                <font-awesome-icon icon="trash-alt" />
              </button>
            </div>
          </div>
          
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ActivityView
            v-if="tag"
            id="tagActivity"
            :element="tag"
            :log="tagActivity(tag)"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityView from './ActivityView'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Sketch from 'vue-color/src/components/Sketch.vue'

export default {
  name: 'ActivityModal',
  
  components: {
    ActivityView,
    'sketch-picker': Sketch
  },
  
  props: {
    tag: {
      type: String,
      default: null
    }
  },
  
  data: () => ({
    color: '#FFFFFF',
    newTagName: ''
  }),
  
  computed: {

    ...mapState([
      'tags'
    ]),
    
    ...mapGetters([
      'tagActivity'
    ]),
    
    tagProperties: function () { return this.tags[this.tag] }
  },
  
  watch: {
    tag: function (newTag) {
      this.newTagName = newTag
      this.color = this.tagProperties.color
    }
  },
  
  methods: {
    
    ...mapMutations([
      'setTagColor',
      'renameTag',
      'deleteTag'
    ]),
    
    updateTagName () {
      this.renameTag({
        oldName: this.tag,
        newName: this.newTagName
      })
    },
    
    updateTagColor (value) {
      this.setTagColor({
        tag: this.tag,
        color: value.hex
      })
      this.color = this.tagProperties.color
    }
  }
}
</script>

<style scoped>
.modal-title {
  display: flex;
  flex: 1;
  justify-content: center;
}

.modal-title > h3 {
  margin-top: .2rem;
  margin-bottom: 0;
}

.tag-button {
  color: white;
  text-shadow:
          0 0 3px rgba(0,0,0,0.4),
          0 0 13px rgba(0,0,0,0.1),
          0 0 23px rgba(0,0,0,0.1);
}

.tag-button:hover {
  color: lightgrey;
}

.dropdown-menu {
  min-width: 40px;
}

#delete-tag-btn {
  margin-left: 8px;
}

</style>
