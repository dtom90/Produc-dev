<template>
  <div
    ref="tagSettingsButton"
    class="btn-group dropright"
    role="group"
  >
    <button
      type="button"
      class="btn tag-button dropdown-toggle"
      :style="`backgroundColor: ${tagProperties.color}`"
      data-toggle="dropdown"
      data-boundary="viewport"
    >
      {{ tagName }}
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
        @click="deleteTag({tag:tagName})"
      >
        <font-awesome-icon icon="trash-alt" />
      </button>
    </div>
  </div>
</template>

<script>
import Sketch from 'vue-color/src/components/Sketch'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'TagSettingsButton',
  
  components: {
    'sketch-picker': Sketch
  },
  
  props: {
    tagName: {
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
    tagProperties: function () {
      return this.tags[this.tagName]
    }
  },
  
  watch: {
    tag: function (newTag) {
      this.newTagName = newTag
      this.color = this.tagProperties.color
    }
  },
  
  mounted () {
    this.newTagName = this.tagName
    this.color = this.tagProperties.color
  },
  
  methods: {
    ...mapMutations([
      'setTagColor',
      'renameTag',
      'deleteTag'
    ]),
    
    updateTagName () {
      this.renameTag({
        oldName: this.tagName,
        newName: this.newTagName
      })
      this.$refs.tagSettingsButton.classList.remove('show')
      this.$refs.tagSettingsButton.querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
      this.$refs.tagSettingsButton.querySelector('.dropdown-menu').classList.remove('show')
    },
  
    updateTagColor (value) {
      this.setTagColor({
        tag: this.tagName,
        color: value.hex
      })
      this.color = this.tagProperties.color
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
