export default class CountdownTimer {
  constructor (seconds, tickCallback, finishCallback) {
    this.totalSeconds = seconds
    this.tickCallback = tickCallback
    this.finishCallback = finishCallback
    this.ID = null
  }
  
  setSeconds (seconds) {
    this.totalSeconds = seconds
  }
  
  start () {
    this.startTime = Date.now()
    this.endTime = this.startTime + (this.totalSeconds * 1000)
    const t = this
    this.ID = setInterval(function () {
      const remainingMs = t.endTime - Date.now()
      if (remainingMs <= 200) {
        t.clear()
        t.finishCallback()
      } else {
        const remainingSeconds = Math.round(remainingMs / 1000)
        t.tickCallback(remainingSeconds)
      }
    }, 1000)
  }
  
  pause () {
    clearInterval(this.ID)
  }
  
  clear () {
    clearInterval(this.ID)
  }
}

// const counter = new CountdownTimer(5, secs => console.log(secs), () => console.log('done'))
// counter.start()
