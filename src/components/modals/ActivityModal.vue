<template>
  <b-modal
    v-if="modalTag"
    id="activityModal"
    size="lg"
    ok-only
  >
    <template v-slot:modal-title>
      <span id="activity-for">Activity for</span>
      <TagSettingsButton :tag="modalTag" />
    </template>
    <ActivityView
      v-if="modalTag"
      id="tagActivity"
      :element="modalTag"
      :log="tagActivity(modalTag)"
    />
  </b-modal>
</template>

<script>
import ActivityView from '../ActivityView'
import { mapState, mapGetters } from 'vuex'
import TagSettingsButton from '../TagSettingsButton'

export default {
  name: 'ActivityModal',
  
  components: {
    TagSettingsButton,
    ActivityView
  },
  
  computed: {
    ...mapState([
      'modalTag'
    ]),
    
    ...mapGetters([
      'tagActivity'
    ])
  }
}
</script>

<style scoped>
#activity-for {
  margin-top: 5px;
  margin-right: 5px;
}
</style>
