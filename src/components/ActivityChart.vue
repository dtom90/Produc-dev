<script>
import { Bar } from 'vue-chartjs/src/BaseCharts'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import annotationPlugin from 'chartjs-plugin-annotation'
import { displayDurationChart } from '../lib/time'

const defaultChartOptions = {
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
  annotation: {
    events: ['click'],
    annotations: []
  },
  responsive: true,
  maintainAspectRatio: false
}

const baseGoalLine = {
  type: 'line',
  mode: 'horizontal',
  scaleID: 'y-axis-0',
  value: 500,
  borderColor: 'red',
  borderWidth: 2,
  label: {
    backgroundColor: 'red',
    content: '',
    enabled: true
  }
}

function chartOptions (goal = null) {
  let chartOptions
  if (goal) {
    chartOptions = Object.assign({}, defaultChartOptions)
    const annotation = Object.assign({}, baseGoalLine)
    annotation.value = goal
    annotation.label.content = 'Target: ' + goal
    if (chartOptions.annotation.annotations.length === 0) {
      chartOptions.annotation.annotations.push(annotation)
    } else {
      chartOptions.annotation.annotations[0] = annotation
    }
  } else {
    chartOptions = defaultChartOptions
  }
  return chartOptions
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
      default: () => [ChartDataLabels, annotationPlugin]
    },
    goal: {
      type: Number,
      default: null
    }
  },

  watch: {
    chartData: function (newChartData) {
      this.renderChart(newChartData, chartOptions(this.goal))
    }
  },
  
  mounted () {
    this.renderChart(this.chartData, chartOptions(this.goal))
  }
}

export { defaultChartOptions }
</script>
