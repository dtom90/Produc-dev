import { chartOptions } from '@/components/ActivityChart'
import { generateActivity } from '../fixtures'

const { day1Duration, day2Duration } = generateActivity()

const datasets = [{
  label: 'Activity for task1',
  backgroundColor: '#2020FF',
  data: [day1Duration, day2Duration].map(dur => dur / 60000)
}]

describe('ActivityChart', () => {
  
  it('should not display a legend', () => {
    expect(chartOptions.legend.display).toEqual(false)
  })
  
  it('should display the correct data label', () => {
    const displayday1Duration = chartOptions.plugins.datalabels.formatter(datasets[0].data[0])
    const displayday2Duration = chartOptions.plugins.datalabels.formatter(datasets[0].data[1])
    
    expect(displayday1Duration).toEqual('47 minutes')
    expect(displayday2Duration).toEqual('40 minutes')
  })
  
})
