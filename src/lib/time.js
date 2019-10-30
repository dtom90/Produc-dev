import dayjs from 'dayjs'
import humanizeDuration from 'humanize-duration'

const baseDurationOptions = {
  units: ['d', 'h', 'm'],
  round: true
}

const minutesToMs = ms => ms * 60000

export default {
  methods: {
    msToMinutes: ms => ms / 60000,
    
    minutesToMs,
    
    displayDateISO: day => dayjs(day).format('YYYY-MM-DD'),
    
    displayDateHuman: day => dayjs(day).format('ddd MMM DD'),
    
    displayTimeHuman: time => dayjs(time).format('h:mm a'),
    
    displayDateTimeHuman: time => dayjs(time).format('ddd MMM DD, h:mm a'),
    
    displayDuration: ms => humanizeDuration(ms, baseDurationOptions)
  }
}

const displayDurationChart = mins => humanizeDuration(
  minutesToMs(mins),
  Object.assign({ delimiter: ',\n' }, baseDurationOptions)
)

export {
  displayDurationChart
}
