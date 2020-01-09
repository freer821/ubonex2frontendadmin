<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getPackageCount } from '@/api/package'

import echarts from 'echarts' // echarts theme
import resize from './mixins/resize'
require('echarts/theme/macarons')

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      chart: null,
      xAxisData: [],
      yAxisData: []
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created () {
    this.fetchPackagesCountWeek()
  },
  methods: {
    fetchPackagesCountWeek () {
      getPackageCount('week').then(response => {
        this.xAxisData = response.data.map(value => value.day)
        this.yAxisData = response.data.map(value => value.available)
        this.initChart()
      }).catch(err => {
        console.log(err)
      })
    },
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions () {
      this.chart.setOption({
        xAxis: {
          data: this.xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['新建订单']
        },
        series: [{
          name: '新建订单',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.yAxisData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>
