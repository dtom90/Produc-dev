<script>
import { Bar } from 'vue-chartjs/src/BaseCharts'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { displayDurationChart } from '../lib/time'

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
        label += displayDurationChart(tooltipItem.yLabel)
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
      formatter: displayDurationChart
    }
  },
  animation: {
    duration: 0,
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
