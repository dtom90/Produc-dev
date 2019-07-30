export default class CountdownTimer {
  constructor (seconds, tickCallback, finishCallback) {
    this.setSeconds(seconds)
    this.tickCallback = tickCallback
    this.finishCallback = finishCallback
    this.ID = null
  }
  
  setSeconds (seconds) {
    this.totalSeconds = seconds
    this.remainingSeconds = seconds
  }
  
  start () {
    const t = this
    this.ID = setInterval(function () {
      t.remainingSeconds -= 1
      if (t.remainingSeconds === 0) {
        t.clear()
        t.finishCallback()
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

// const counter = new CountdownTimer(5, function(secs) { console.log(secs) }, function() { console.log('done') })
// counter.start()
