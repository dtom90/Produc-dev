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
                  class="btn"
                  :style="`backgroundColor: ${tags[tagName].color}`"
                >
                  <font-awesome-icon icon="bars" />
                </button>
                <button
                  class="tag-name btn"
                  :style="`backgroundColor: ${tags[tagName].color}`"
                >
                  {{ tagName }}
                </button>
              <!--              <button-->
              <!--                class="tag-close btn"-->
              <!--                :style="`backgroundColor: ${tags[tagName].color}`"-->
              <!--                title="Delete tag"-->
              <!--                aria-label="Close"-->
              <!--                @click.stop="deleteTag(tagName)"-->
              <!--              >-->
              <!--                <span aria-hidden="true">&times;</span>-->
              <!--              </button>-->
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
import { mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'DataModal',
  components: {
    draggable
  },
  data: () => ({
  }),
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
    ])
  }
}
</script>

<style scoped lang="scss">
.modal-body {
  overflow-y: auto;
}
.tag {
  margin-bottom: 20px;
  
  button {
    color: white;
    text-shadow:
            0 0 3px rgba(0,0,0,0.4),
            0 0 13px rgba(0,0,0,0.1),
            0 0 23px rgba(0,0,0,0.1);
  }
}
</style>
