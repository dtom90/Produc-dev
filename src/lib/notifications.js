/* eslint-disable no-new */

window.electronAPI.onMessage((data) => {
  alert(data)
})

export default {
  
  requestPermission: function () {
    if (!('Notification' in window)) { // Check if the browser supports notifications
      alert('This browser does not support system notifications')
    } else {
      const formerPermission = Notification.permission
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted' && formerPermission === 'default') {
          new Notification('Permissions to notify you have been granted!')
        } else if (formerPermission === 'default') {
          alert('Warning! Permissions to notify you have been denied! You may not tell when your Pomodoro timer ends.')
        }
      })
    }
  },
  
  notify: function (message) {
    if (!('Notification' in window)) { // Check if the browser supports notifications
      alert(message)
    } else if (Notification.permission === 'granted') { // Check if notification permissions have already been granted
      return new Notification(message) // If it's okay, create a notification
    } else if (Notification.permission !== 'denied') { // Otherwise, display an alert
      alert(message)
    }
  }
  
}
