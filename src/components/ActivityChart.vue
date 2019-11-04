<script>
import { Bar } from 'vue-chartjs/src/BaseCharts'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import annotationPlugin from 'chartjs-plugin-annotation'
import { displayChartDuration, displayChartDurationNewline } from '../lib/time'
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
        maxTicksLimit: 7,
        stepSize: 0.5,
        callback: mins => displayChartDurationNewline(mins).split('\n')
      }
    }]
  },
  tooltips: {
    displayColors: false,
    position: 'nearest',
    callbacks: {
      title: (tooltipItem, data) => data.datasets[tooltipItem[0].datasetIndex].label,
      label: tooltipItem => tooltipItem.xLabel + ':',
      afterLabel: tooltipItem => displayChartDuration(tooltipItem.yLabel)
    }
  },
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'start',
      clip: true,
      color: 'white',
      formatter: displayChartDurationNewline
    }
  },
  animation: {
    duration: 0,
    onComplete: function (event) {
      if (event.numSteps === 0) {
        const canvas = event.chart.canvas
        const chartWrapper = canvas.parentElement.parentElement
        chartWrapper.scrollLeft = canvas.clientWidth
      }
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
    annotation.label.content = 'Target: ' + displayChartDuration(target)
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
