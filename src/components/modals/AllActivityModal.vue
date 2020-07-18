<template>
  <b-modal
    id="allActivityModal"
    title="All Activity"
    size="lg"
    ok-only
  >
    <ActivityView
      id="allActivity"
      element="All Activity"
      :log="allActivity"
    />
  </b-modal>
</template>

<script>
import ActivityView from '../ActivityView'
import { mapGetters } from 'vuex'

export default {
  name: 'ActivityModal',
  
  components: {
    ActivityView
  },
  
  computed: {
    ...mapGetters([
      'allActivity'
    ])
  }
}
</script>

<style>
/*noinspection CssUnusedSymbol*/
.modal-title {
  display: flex;
  flex: 1;
  justify-content: center;
}
</style>
