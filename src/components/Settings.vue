<template>
  <div class="d-flex justify-content-end">
    <div class="dropleft">
      <button
        class="btn btn-light"
        data-toggle="dropdown"
      >
        <font-awesome-icon icon="bell" />
      </button>
      <div class="dropdown-menu">
        <div>
          Notifications: {{ notificationPermission === 'granted' ? 'Enabled' : 'Disabled' }}
        </div>
        <div id="notification-action">
          <button
            v-if="notificationPermission === 'default'"
            class="btn btn-primary"
            @click="requestPermission"
          >
            Enable Notifications
          </button>
          <h5 v-if="notificationPermission === 'denied'">
            <span
              class="badge badge-warning"
            >
              <div>Permissions have been denied</div>
              <div>You can enable them in site settings</div>
              <div>(Icon in URL)</div>
            </span>
          </h5>
          <h5 v-if="notificationPermission === 'granted'">
            <span
              class="badge badge-info"
            >
              <div>You can disable permissions in site settings</div>
              <div>(Icon in URL)</div>
            </span>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notifications from './notifications'

export default {
  name: 'Settings',
  
  computed: {
    notificationPermission: function () {
      return notifications.permission()
    }
  },
  
  methods: {
    requestPermission: function () {
      notifications.requestPermission()
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
    padding: 0.5rem;
    text-align: center;
}
#notification-action {
    margin-top: 0.5rem;
}
</style>
