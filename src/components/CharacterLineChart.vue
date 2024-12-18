<template>
  <div id="lineChart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    selectedCharacter: String, // 接收父组件传递的选中角色
  },
  data() {
    return {
      characterData: null, // 当前选中角色的折线数据
      lineChart: null, // ECharts 实例
    };
  },
  watch: {
    selectedCharacter(newCharacter) {
      this.fetchCharacterData(newCharacter); // 角色改变时更新数据
    },
  },
  methods: {
    fetchCharacterData(characterName) {
      if (!characterName) return;
      fetch('/data_character.json')
        .then(response => response.json())
        .then(data => {
          const character = data.find(item => item.name === characterName);
          if (character) {
            this.characterData = character.Count.map((count, index) => [
              `第${index + 1}章`, count
            ]);
            this.updateLineChart();
          }
        })
        .catch(error => console.error('加载角色数据失败:', error));
    },
    updateLineChart() {
      if (this.characterData) {
        const lineOption = {
          title: {
            text: '角色出现频次',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            formatter: params => `${params[0].axisValue}: ${params[0].value} 次`,
          },
          xAxis: {
            type: 'category',
            data: this.characterData.map(item => item[0]),
          },
          yAxis: {
            type: 'value',
            name: '频次',
          },
          series: [{
            name: '频次',
            type: 'line',
            data: this.characterData.map(item => item[1]),
            itemStyle: { color: '#a44b3c' },
          }],
        };

        if (this.lineChart) {
          this.lineChart.dispose();
        }

        this.lineChart = echarts.init(document.getElementById('lineChart'));
        this.lineChart.setOption(lineOption);
      }
    },
  },
  beforeUnmount() {
    if (this.lineChart) {
      this.lineChart.dispose();
    }
  },
};
</script>