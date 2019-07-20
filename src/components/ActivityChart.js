import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    }
  },
  
  mounted () {
    this.renderChart(this.chartData, {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    })
  }
}
