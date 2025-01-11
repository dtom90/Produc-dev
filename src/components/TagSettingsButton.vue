<template>
  <div
    v-if="tag"
    ref="tagSettingsButton"
    class="btn-group dropright"
    role="group"
  >
    <button
      type="button"
      class="btn tag-button dropdown-toggle"
      :style="`backgroundColor: ${tag.color}`"
      data-toggle="dropdown"
      data-boundary="viewport"
    >
      {{ tag.tagName }}
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
          title="Rename tag"
          @keyup.enter="updateTagSubmit"
        >
        <button
          type="button"
          class="btn btn-primary"
          @click="updateTagSubmit"
        >
          <font-awesome-icon icon="save" />
        </button>
      </div>
      <div class="dropdown-divider" />
      <sketch-picker
        v-model="newTagColor"
        @input="newTagColor = $event.hex"
      />
      <div class="dropdown-divider" />
      <button
        id="delete-tag-btn"
        type="button"
        class="btn btn-danger"
        title="Delete tag"
        @click="deleteTag({ tagId })"
      >
        <font-awesome-icon icon="trash-alt" />
      </button>
    </div>
  </div>
</template>

<script>
import Sketch from 'vue-color/src/components/Sketch'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TagSettingsButton',
  
  components: {
    'sketch-picker': Sketch
  },
  
  props: {
    tagId: {
      type: String,
      default: null
    }
  },
  
  data: () => ({
    newTagColor: '#FFFFFF',
    newTagName: ''
  }),
  
  computed: {
    ...mapState([
      'tags'
    ]),
    tag: function () {
      return this.tags[this.tagId]
    }
  },
  
  mounted () {
    if (!this.tag) {
      return
    }
    this.newTagName = this.tag.tagName
    this.newTagColor = this.tag.color
  },
  
  methods: {
    ...mapActions([
      'updateTag',
      'deleteTag'
    ]),
    
    async updateTagSubmit () {
      await this.updateTag({
        tagId: this.tagId,
        tagName: this.newTagName,
        color: this.newTagColor
      })
      this.$refs.tagSettingsButton.classList.remove('show')
      this.$refs.tagSettingsButton.querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
      this.$refs.tagSettingsButton.querySelector('.dropdown-menu').classList.remove('show')
    }
  }
}
</script>

<style scoped>

.tag-button {
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
  0 0 13px rgba(0, 0, 0, 0.1),
  0 0 23px rgba(0, 0, 0, 0.1);
}

.tag-button:hover {
  color: lightgrey;
}

.dropdown-menu {
  min-width: 40px;
  position: absolute;
}

#delete-tag-btn {
  margin-left: 8px;
}

</style>
