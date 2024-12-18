<template>
  <div id="main-s" style="width: 100%; height: 100%;background-color: #F5F5DC;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'class-sun',
  data() {
    return {
      chartData: null
    };
  },
  mounted() {
    this.fetchData().then(() => {
      this.initChart();
    });
  },
  methods: {
    addValueToNodes(node) {
      if (!node.children) {
      node.value = node.value || 1;
      node.label = { 
        show: false,   // 默认不显示标签
        position: 'outside'  // 悬停时显示在节点外部
      };
    }else {
          node.children.forEach(child => this.addValueToNodes(child));
      }
    },
    async fetchData() {
        try {
            const response = await axios.get('/data_class.json');
            this.chartData = response.data;
            this.chartData.forEach(category => this.addValueToNodes(category));
        } catch (error) {
            console.error('数据加载失败:', error);
        }
    },
    initChart() {
      if (!this.chartData) return;

      var chartDom = document.getElementById('main-s');
      var myChart = echarts.init(chartDom, null, {
        renderer: 'canvas'
      });

      // 动态计算容器的高度，根据需求设置
      chartDom.style.height = `${window.innerHeight * 0.8}px`;  // 设置为视口高度的80%

      var option = {
        tooltip: {
        trigger: 'item',
        formatter: function (params) {
          // 如果当前节点没有子节点，就不显示tooltip
          if (!params.data.children) {
            return '';  // 不显示工具提示
          }
          return params.name;  // 显示tooltip
        }
      },
        series: {
          type: 'sunburst',
          data: this.chartData,
          radius: [0, '90%'],
          sort: undefined,
          emphasis: {
            focus: 'ancestor',
            label: { 
              show: true,
              fontSize:14
            }  // 悬停时显示标签
          },
          label: {
            fontSize: 10
          },
          color: [
            '#d73624', 
            '#e44515f1',
            '#d97319', 
            '#cd9c20',
             '#adc534', 
             '#678435'
            ], // 颜色数组

          levels: [
          {
              r0: '0%',
              r: '20%',
              label: {
                silent: true
              }
            },
            {
              r0: '20%',
              r: '45%',
              itemStyle: {
                borderWidth: 2
              },
              label: {
                rotate: 'tangential'
              }
            },
            {
              r0: '45%',
              r: '70%',
              label: {
                rotate: 'tangential'
              }
            },
            {
              r0: '70%',
              r: '85%',
              label: {
                rotate: 'tangential'
              }
            },
            {
              r0: '85%',
              r: '90%',
              label: {
                silent: true
              },
              itemStyle: {
                borderWidth: 1
              }
            }
          ]
        }
      };

      myChart.setOption(option);

    }
  }
};
</script>

<style scoped>

#main-s {
  width: 100%;
  height: 100%;
}
</style>

