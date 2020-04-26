import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import humanizeDuration from 'humanize-duration'

dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)
dayjs.extend(utc)

const baseDurationOptions = {
  units: ['h', 'm', 's'],
  largest: 2,
  round: true
}

const minutesToMs = ms => ms * 60000

const displayDateHuman = day => dayjs(day).format('ddd MMM DD')

const displayDuration = ms => humanizeDuration(ms, baseDurationOptions)

export default {
  methods: {
    msToMinutes: ms => ms / 60000,
  
    minutesToMs,
  
    // a and b are javascript Date objects
    dateDiffInDays (a, b) {
      const [ua, ub] = [a, b].map(day => dayjs.utc(day))
      return Math.abs(ua.diff(ub, 'day'))
    },
  
    daysLater: (a, diffDays) => dayjs.utc(a).add(diffDays, 'day'),
  
    displayWeekISO: day => {
      const djs = dayjs(day)
      return djs.format('YYYY-') + djs.week()
    },
  
    displayWeekHuman: week => {
      const [y, w] = week.split('-')
      const djs = dayjs().year(y).week(w)
      return [displayDateHuman(djs.startOf('week')) + ' -', displayDateHuman(djs.endOf('week'))]
    },
  
    displayDateISO: day => dayjs(day).format('YYYY-MM-DD'),
  
    displayDateHuman,
  
    displayTimeHuman: (time, tf24 = false) => dayjs(time).format(`${tf24 ? 'H' : 'h'}:mm A`),
  
    displayDateTimeHuman: time => dayjs(time).format('ddd MMM DD, h:mm A'),
  
    displayDuration
  }
}

const displayChartDuration = mins => displayDuration(minutesToMs(mins))

const displayChartDurationNewline = mins => humanizeDuration(
  minutesToMs(mins),
  Object.assign({ delimiter: ',\n' }, baseDurationOptions)
)

export {
  displayChartDuration,
  displayChartDurationNewline
}
