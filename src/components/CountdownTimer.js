export default class CountdownTimer {
  constructor (seconds, tickCallback, finishCallback) {
    this.totalSeconds = seconds
    this.remainingSeconds = this.totalSeconds
    this.tickCallback = tickCallback
    this.finishCallback = finishCallback
    this.ID = null
  }
  
  setSeconds (seconds) {
    this.totalSeconds = seconds
    this.remainingSeconds = this.totalSeconds
  }
  
  start () {
    this.startTime = Date.now()
    this.endTime = this.startTime + (this.remainingSeconds * 1000)
    const t = this
    this.ID = setInterval(function () {
      const remainingMs = t.endTime - Date.now()
      t.remainingSeconds = Math.round(remainingMs / 1000)
      if (t.remainingSeconds <= 0) {
        t.finishCallback(t.remainingSeconds)
      } else {
        t.tickCallback(t.remainingSeconds)
      }
    }, 1000)
  }
  
  pause () {
    clearInterval(this.ID)
  }
  
  clear () {
    clearInterval(this.ID)
    this.remainingSeconds = this.totalSeconds
  }
}
