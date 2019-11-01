import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import humanizeDuration from 'humanize-duration'

dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)

const baseDurationOptions = {
  units: ['h', 'm'],
  round: true
}

const minutesToMs = ms => ms * 60000

const displayDateHuman = day => dayjs(day).format('ddd MMM DD')

const displayDuration = ms => humanizeDuration(ms, baseDurationOptions)

export default {
  methods: {
    msToMinutes: ms => ms / 60000,
    
    minutesToMs,
    
    displayWeekISO: day => {
      const djs = dayjs(day)
      return djs.format('YYYY-') + djs.week()
    },
    
    displayWeekHuman: week => {
      const [y, w] = week.split('-')
      const djs = dayjs().year(y).week(w)
      return displayDateHuman(djs.startOf('week')) + ' - ' + displayDateHuman(djs.endOf('week'))
    },
    
    displayDateISO: day => dayjs(day).format('YYYY-MM-DD'),
    
    displayDateHuman,
    
    displayTimeHuman: time => dayjs(time).format('h:mm a'),
    
    displayDateTimeHuman: time => dayjs(time).format('ddd MMM DD, h:mm a'),
    
    displayDuration
  }
}

const displayDurationChart = mins => humanizeDuration(
  minutesToMs(mins),
  Object.assign({ delimiter: ',\n' }, baseDurationOptions)
)

export {
  minutesToMs,
  displayDuration,
  displayDurationChart
}
