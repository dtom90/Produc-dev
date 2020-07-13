import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import humanizeDuration from 'humanize-duration'
import { mapState } from 'vuex'

dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)
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
  computed: {
    ...mapState(['timeFormat24'])
  },
  
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
    
    displayTimeHuman (time) {
      return dayjs(time).format(`${this.timeFormat24 ? 'H' : 'h'}:mm ${this.timeFormat24 ? '' : 'A'}`)
    },
    
    displayDuration
  }
}

const displayChartDuration = mins => displayDuration(minutesToMs(mins))

const displayChartDurationNewline = mins => humanizeDuration(
  minutesToMs(mins),
  Object.assign({ delimiter: ',\n' }, baseDurationOptions)
)

export {
  dayjs,
  displayDuration,
  displayChartDuration,
  displayChartDurationNewline
}
