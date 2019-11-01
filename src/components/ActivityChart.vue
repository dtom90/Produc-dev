<script>
import { Bar } from 'vue-chartjs/src/BaseCharts'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import annotationPlugin from 'chartjs-plugin-annotation'
import { minutesToMs, displayDuration, displayDurationChart } from '../lib/time'
import cloneDeep from 'lodash.clonedeep'

const defaultChartOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Time Spent'
      },
      ticks: {
        beginAtZero: true,
        callback: mins => displayDurationChart(mins).split('\n')
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

const baseTargetLine = Object.freeze({
  type: 'line',
  mode: 'horizontal',
  scaleID: 'y-axis-0',
  value: 0,
  borderColor: 'red',
  borderWidth: 2,
  label: {
    backgroundColor: 'red',
    content: '',
    yAdjust: 10,
    enabled: true
  }
})

function chartOptions (target = null) {
  const chartOptions = cloneDeep(defaultChartOptions)
  if (target !== null) {
    const annotation = cloneDeep(baseTargetLine)
    annotation.value = target
    annotation.label.content = 'Target: ' + displayDuration(minutesToMs(target))
    if (chartOptions.annotation.annotations.length === 0) {
      chartOptions.annotation.annotations.push(annotation)
    } else {
      chartOptions.annotation.annotations[0] = annotation
    }
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
    target: {
      type: Number,
      default: null
    }
  },

  watch: {
    chartData: function (newChartData) {
      this.renderChart(newChartData, chartOptions(this.target))
    },
    target: function (newTarget) {
      this.renderChart(this.chartData, chartOptions(newTarget))
    }
  },
  
  mounted () {
    this.renderChart(this.chartData, chartOptions(this.target))
  }
}

export { defaultChartOptions }
</script>
