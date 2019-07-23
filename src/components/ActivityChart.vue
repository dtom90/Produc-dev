<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import moment from 'moment'

const displayFormat = (minutes) => moment.duration(minutes, 'minutes').humanize()

const chartOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Minutes'
      },
      ticks: {
        beginAtZero: true,
        stepSize: 1
      }
    }]
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        let label = data.datasets[tooltipItem.datasetIndex].label || ''
        if (label) {
          label += ': '
        }
        label += displayFormat(tooltipItem.yLabel)
        return label
      }
    }
  },
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'start',
      clip: true,
      color: 'white',
      formatter: value => displayFormat(value)
    }
  },
  responsive: true,
  maintainAspectRatio: true
}

export default {
  extends: Bar,
  
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '200'
    },
    plugins: {
      type: Array,
      default: () => [ChartDataLabels]
    }
  },

  watch: {
    chartData: function (newChartData) {
      this.renderChart(newChartData, chartOptions)
    }
  },
  
  mounted () {
    this.renderChart(this.chartData, chartOptions)
  }
}
</script>
