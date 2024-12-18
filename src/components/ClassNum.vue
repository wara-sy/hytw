<template>
  <div id="main" ref="main" style="width: 100%; height: 800px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import chartData from '../../public/new_data.json';

export default {
  name: 'class-num',
  data() {
    return {
      chartData: chartData
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.main;
      const myChart = echarts.init(chartDom);
      const option = this.getOption();

      myChart.setOption(option);
    },
    resizeChart() {
      const myChart = echarts.init(this.$refs.main);
      if (myChart) {
        myChart.resize();
      }
    },
    getOption() {
      const { legend, xAxisData, seriesData } = this.chartData;

      const labelOption = {
        show: true,
        position: 'inside',
        formatter: (params) => {
          // 如果数据为 0，不显示标签
          return params.value !== 0 ? params.value : '';
        }
      };

      // 定义颜色数组
      const colors = ['#961c1c', '#d97319', '#cd9c20', '#adc534', '#678435'];

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: legend.map((item, index) => ({
          name: item,
          itemStyle: {
              color: colors[index % colors.length], // 设置按钮的颜色
              borderColor: '#fff', // 设置按钮边框颜色
              borderWidth: 1 // 设置按钮边框宽度
            }
        }))
      },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            magicType: { 
              show: true,
              type: ['line', 'bar', 'stack']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: xAxisData,
            axisLabel: {
              interval: 0, // 显示所有标签
              rotate: 45, // 设置标签旋转角度
              margin: 10, // 设置标签与轴线的距离
              textStyle: {
                color: '#333' // 设置标签文字颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesData.map((series, index) => ({
          name: series.name,
          type: 'bar',
          label: labelOption,
          itemStyle: {
            color: colors[index % colors.length] // 为每个系列设置颜色
          },
          data: series.data
        }))
      };

      return option;
    }
  }
};
</script>