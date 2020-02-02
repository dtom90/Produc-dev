<template>
  <div
    id="tagModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="tagModalLabel"
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
            Tags
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
          <draggable
            v-model="changeTagOrder"
            animation="200"
            @start="startDrag"
            @end="endDrag"
          >
            <div
              v-for="tagName in tagOrder"
              :key="tagName"
              class="tag btn-toolbar"
            >
              <div
                class="btn-group"
                role="group"
              >
                <button
                  type="button"
                  class="btn move-btn"
                  :style="`backgroundColor: ${tags[tagName].color}`"
                >
                  <font-awesome-icon icon="bars" />
                </button>
                <TagSettingsButton :tag="tagName" />
              </div>
            </div>
          </draggable>
        </div>
        <div class="modal-footer" />
      </div>
    </div>
  </div>
</template>

<script>
import TagSettingsButton from './TagSettingsButton'
import { mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'DataModal',
  
  components: {
    TagSettingsButton,
    draggable
  },
  
  computed: {
    ...mapState([
      'tags',
      'tagOrder'
    ]),
    changeTagOrder: {
      get () {
        return this.tagOrder
      },
      set (newOrder) {
        this.updateTagOrder({ newOrder })
      }
    }
  },
  
  methods: {
    ...mapMutations([
      'updateTagOrder'
    ]),
    startDrag () {
      this.$el.closest('html').classList.add('draggable-cursor')
    },
    endDrag () {
      this.$el.closest('html').classList.remove('draggable-cursor')
    }
  }
}
</script>

<style scoped lang="scss">

.tag {
  margin-bottom: 20px;

  //noinspection CssInvalidPropertyValue
  .move-btn {
    color: white;
    text-shadow:
            0 0 3px rgba(0,0,0,0.4),
            0 0 13px rgba(0,0,0,0.1),
            0 0 23px rgba(0,0,0,0.1);
    cursor: move;
    cursor: -webkit-grab;
    cursor:    -moz-grab;
    cursor:         grab;
  }
  
  .move-btn:hover {
    color: lightgrey;
  }
  
}

</style>
