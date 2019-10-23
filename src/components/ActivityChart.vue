<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import humanizeDuration from 'humanize-duration'

const displayFormat = (minutes) => humanizeDuration(minutes * 60000, {
  units: ['d', 'h', 'm'],
  round: true,
  delimiter: ',\n'
})

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
        precision: 0
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
  animation: {
    onComplete: function (event) {
      const canvas = event.chart.canvas
      const chartWrapper = canvas.parentElement.parentElement
      chartWrapper.scrollLeft = canvas.clientWidth
    }
  },
  responsive: true,
  maintainAspectRatio: false
}

export default {
  extends: Bar,
  
  props: {
    chartData: {
      type: Object,
      default: () => ({})
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
