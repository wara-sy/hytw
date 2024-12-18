<template>
  <div>
    <!-- 散点图容器 -->
    <div id="scatterChart" style="width: 100%; height: 400px; float: left;background-color: #F5F5DC;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      originalData: [], // 原始数据，用于筛选后恢复
      chartData: [], // 存储散点图的当前显示数据
      scatterChart: null, // 散点图实例
      familyColors: {
        '贾府': '#961c1c', 
        '贾府-宁国府': '#d73624',
        '贾府-荣国府': '#e44515f1',
        '史府': '#d97319',
        '王府': '#cd9c20',
        '薛府': '#adc534',
        '非四大家族': '#678435',
      }
    };
  },
  mounted() {
    this.loadChartData(); // 加载数据并初始化散点图
  },
  methods: {
    loadChartData() {
      fetch('/data_character.json') // 假设这是你的人物数据文件路径
        .then(response => response.json())
        .then(data => {
          // 构建散点图数据
          this.originalData = data.map(character => [
            character.FirstAppearanceChapter, // X轴数据
            character.AppearanceCount,        // Y轴数据
            character.name,                   // 用于tooltip显示的名称
            character.Family                  //家族
          ]);
          this.chartData = [...this.originalData]; // 初始化为全部数据

          this.$nextTick(() => {
            this.scatterChart = echarts.init(document.getElementById('scatterChart'));
            this.updateScatterChart();
          });
        })
        .catch(error => console.error('加载数据失败:', error));
    },
    updateScatterChart() {
      const scatterOption = {
        title: { 
          text: '人物活跃度' ,
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: params => `${params.data[2]}:${params.data[1]} 次 <br> 家族：${params.data[3]}`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // 悬浮提示背景色
          textStyle: {
          color: '#FFFFFF' // 悬浮提示文字颜色
          }
        },
        xAxis: { type: 'value', name: '首次章节' },
        yAxis: { type: 'value', name: '出现频次' },
        series: [
          {
            type: 'scatter',
            data: this.chartData,
            itemStyle: { color: params => this.familyColors[params.data[3]] || '#D3D3D3' },
            symbolSize: 15, // 设置点的大小
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fcce10' // 点击时的高亮颜色
              }
            }
          },
        ],
      };
      this.scatterChart.setOption(scatterOption); // 传递 scatterOption
      // 点击散点图时触发事件
      this.scatterChart.on('click', params => {
        const characterName = params.data[2];
        this.$emit('character-selected', characterName); // Emit事件传递选中的角色
      });
    },
    filterData(min, max, selectedFamilies) {
      // 如果没有提供家族筛选参数，则只按频次筛选
      if (!selectedFamilies || selectedFamilies.length === 0) {
        this.chartData = this.originalData
        .filter(item => item[1] >= min && item[1] <= max);
      } else {
        // 同时按频次和家族筛选
        this.chartData = this.originalData.filter(item => {
          const frequency = item[1];
          const family = item[3];
          return frequency >= min &&
                 frequency <= max &&
                 selectedFamilies.includes(family);
        });
      }
      this.updateScatterChart(); // 更新散点图显示
    },
    resetFilter() {
      // 恢复原始数据
      this.chartData = [...this.originalData];
      this.updateScatterChart(); // 更新散点图显示
    },
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.scatterChart) {
      this.scatterChart.dispose();
    }
  },
};
</script>