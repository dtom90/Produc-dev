<script>
import { Bar } from 'vue-chartjs'
import moment from 'moment'

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
        label += moment.duration(tooltipItem.yLabel, 'minutes').humanize()
        return label
      }
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
