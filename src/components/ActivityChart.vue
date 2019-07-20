<script>
import { Bar } from 'vue-chartjs'

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

<style>

</style>
