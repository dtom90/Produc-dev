<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartPluginDataLabels from 'chartjs-plugin-datalabels'
import ChartPluginAnnotation from 'chartjs-plugin-annotation'
import { displayChartDuration, displayChartDurationNewline } from '../lib/time'
import cloneDeep from 'lodash.clonedeep'

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, ChartPluginDataLabels, ChartPluginAnnotation)

const defaultChartOptions = {
  scales: {
    y: {
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
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      displayColors: false,
      position: 'nearest',
      callbacks: {
        title: (tooltipItems) => tooltipItems[0].dataset.label,
        label: tooltipItem => tooltipItem.label + ':',
        afterLabel: tooltipItem => displayChartDuration(tooltipItem.raw)
      }
    },
    datalabels: {
      anchor: 'end',
      align: 'start',
      clip: true,
      color: 'white',
      formatter: displayChartDurationNewline
    },
    annotation: {
      annotations: {}
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
  }
}

const baseTargetLine = Object.freeze({
  type: 'line',
  scaleID: 'y',
  value: 0,
  borderColor: 'red',
  borderWidth: 2,
  label: {
    display: true,
    backgroundColor: 'red',
    content: '',
    padding: 5,
    position: 'center', // 'start', 'center', or 'end' to place the label along the line
    xAdjust: 0, // Ensure no horizontal offset
    yAdjust: 0, // Ensure no vertical offset
    rotation: 0 // Keep the label upright
    // callout: {
    //   display: true,
    //   start: 0
    // }
  }
})

function chartOptions (target = null, scrollRight = false) {
  const chartOptions = cloneDeep(defaultChartOptions)
  if (target) {
    const annotation = cloneDeep(baseTargetLine)
    annotation.value = target
    annotation.label.content = 'Target: ' + displayChartDuration(target)
    chartOptions.plugins.annotation.annotations.targetLine = annotation
  }
  if (scrollRight === false) {
    chartOptions.animation.onComplete = () => {}
  }
  return chartOptions
}

export default {
  name: 'BarChart',
  components: { Bar },

  props: {
    chartData: {
      type: Object,
      required: true
    },
    
    target: {
      type: Number,
      default: null
    }
  },
  
  data: function () {
    return {
      chartOptions: {}
    }
  },
  
  watch: {
    target: function (newTarget) {
      this.chartOptions = chartOptions(newTarget)
    }
  },

  mounted () {
    this.chartOptions = chartOptions(this.target, true)
  }
}

export { defaultChartOptions }
</script>
