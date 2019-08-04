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
      if (remainingMs <= 200) {
        t.clear()
        t.finishCallback()
      } else {
        t.remainingSeconds = Math.round(remainingMs / 1000)
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
