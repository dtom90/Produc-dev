<template>
  <b-modal
    v-if="tempSettings.modalTagId"
    id="activityModal"
    size="lg"
    ok-only
  >
    <template v-slot:modal-title>
      <span id="activity-for">Activity for</span>
      <TagSettingsButton :tag-id="tempSettings.modalTagId" />
    </template>
    <ActivityView
      v-if="tempSettings.modalTagId"
      id="tagActivity"
      :element="tempSettings.modalTagId"
      :log="tagActivity(tempSettings.modalTagId)"
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
      'tempSettings'
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
