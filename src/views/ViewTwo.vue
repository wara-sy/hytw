<template>
  <div class="view-two">
    <h1>人物关系网</h1>
    <p>人际如网，错综复杂。明关系之脉络，解社会之构造。</p>
  
    <div style="display: flex; justify-content: flex-start; height: 800px;background-color: #F5F5DC;">
      <!-- 左侧图表容器，宽度为 50% -->
      <div id="main-t" style="width: 50%; height: 100%; position: relative;"></div>

      <!-- 右侧视图 -->
      <div class="right-view" style="width: 50%; padding-top: 10px; overflow-y: auto;">
        <!-- 筛选按钮 -->
        <div style="margin-bottom: 10px;">
          <div v-for="category in categories" :key="category" style="margin-right: 10px; display: inline-block;">
            <button
              class="category-button"
              :style="selectedCategories.includes(category) ? { backgroundColor: categoryColor[category] } : {}"
              @click="filterByCategory(category)">
              {{ category }}
            </button>
          </div>
        </div>

        <!-- 显示所有关系和节点的按钮 -->
        <div style="margin-bottom: 20px;">
          <button class="show-all-button" @click="showAllLinks">显示所有关系</button>
          <button class="show-all-button" @click="showAllNodes">显示所有节点</button>
        </div>

        <!-- 显示人物关系 -->
        <div v-if="showCharacterRelations" class="character-relations">
          <h3>{{ currentNodeInfo?.name }} 的人物关系</h3>
          <ul>
            <li v-for="relation in currentNodeRelations" :key="relation.name">
              {{ relation.name }} - {{ relation.type }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import $ from 'jquery';

export default {
  name: 'RelativeNetwork',
  data() {
    return {
      categories: [
        '父系亲属', '母系亲属', '直系亲属', '祖孙', '夫妻','孙媳', '婆媳','堂亲', '表亲', '宗亲', '主仆'
      ],
      categoryColor: {
        '父系亲属': '#961c1c',
        '母系亲属': '#bc2c1c', 
        '直系亲属': '#d73624', 
        '祖孙': '#e44515f1',
        '夫妻': '#e47215f1', 
        '孙媳': '#ee9745f1', 
        '婆媳': '#eebb45f1', 
        '堂亲': '#d6ce33f1', 
        '表亲': '#adb812', 
        '宗亲': '#8e970f', 
        '主仆': '#6e8e46' 
        
      },
      
      families: {},
      originalGraphData: { nodes: [], links: [] },
      currentGraph: {},
      selectedCategories: [],
      selectedFamilies: [],
      characterData: {},
      currentNodeInfo: null, // 当前选中的节点信息
      currentNodeRelations: [], // 当前选中节点的人物关系
      showCharacterRelations: false, // 控制是否显示人物关系视图
    };
  },
  mounted() {
    this.initChart();
    // 监听图表点击事件
    this.myChart.on('click', (params) => {
      if (params.dataType === 'node') {
        this.showNodeRelations(params.data);
      } else {
        this.hideCharacterRelations();
      }
    });
  },
  methods: {
    // 通过关系类别过滤节点和连线
    filterByCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(category);
      }

      const filteredLinks = this.originalGraphData.links.filter(link => 
        this.selectedCategories.includes(link.type)
      );

      const relatedNodeIds = new Set();
      filteredLinks.forEach(link => {
        relatedNodeIds.add(link.source);
        relatedNodeIds.add(link.target);
      });

      const filteredNodes = this.originalGraphData.nodes.filter(node => relatedNodeIds.has(node.name));

      this.currentGraph = { nodes: filteredNodes, links: filteredLinks };
      this.updateChart();
    },
    showAllLinks() {
      this.selectedCategories = [];
      this.currentGraph.links = this.originalGraphData.links;
      this.updateChart();
    },
    showAllNodes() {
      this.selectedFamilies = [];
      this.currentGraph.nodes = this.originalGraphData.nodes;
      this.updateChart();
    },
    initChart() {
      const chartDom = document.getElementById('main-t');
      this.myChart = echarts.init(chartDom);

      this.myChart.showLoading();  // 显示 loading

      // 异步加载人物数据和网络数据
      Promise.all([ 
        $.getJSON('/data_character.json'), 
        $.getJSON('/data_relate.json')
      ])
      .then(([characterData, networkData]) => {
        // 数据加载成功后
        console.log('Character Data Loaded:', characterData);
        console.log('Network Data Loaded:', networkData);

        // 处理人物数据
        characterData.forEach((item) => {
          if (!this.families[item.Family]) {
            this.families[item.Family] = [item.name];
          } else {
            this.families[item.Family].push(item.name);
          }
          this.characterData[item.name] = item;
        });

        // 处理网络数据
        networkData.links.forEach(link => {
          link.lineStyle = { color: this.categoryColor[link.type] };
        });

        this.originalGraphData = networkData;
        this.currentGraph = this.originalGraphData;
        this.updateChart();

        // 隐藏 loading
        this.myChart.hideLoading();
      })
      .catch(err => {
        console.error('Error loading data:', err);
        this.myChart.hideLoading();  // 隐藏 loading 即使出现错误
      });
    },
    updateChart() {
      let graph = this.currentGraph;
      graph.nodes.forEach(node => {
        node.itemStyle = { color: '#9a1a1a' }; 
        node.label = { show: node.symbolSize > 0 };
      });

      let clearedNodes = [];
      graph.nodes.forEach(node => {
        if (graph.links.some(i => i.source === node.name || i.target === node.name)) {
          clearedNodes.push(node);
        }
      });
      graph.nodes = clearedNodes;

      const option = {
        title: {
          text: '    ',
          subtext: 'Circular layout',
          top: 'bottom',
          left: 'right'
        },
        tooltip: {
          formatter: (params) => {
            if (params.dataType === 'edge') {
              return `${params.data.source} - ${params.data.target}: ${params.data.type}`;
            }
            return params.name;
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: '    ',
            type: 'graph',
            layout: 'circular',
            circular: { rotateLabel: true },
            data: graph.nodes,
            links: graph.links,
            categories: this.categories.map(name => ({ name })),
            roam: true,
            label: { position: 'right', formatter: '{b}' },
            lineStyle: {
              width: 3.5,
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency'
            },
            select: {
              itemStyle: { color: '#FF6347' },  // 选中的节点样式
            }
          }
        ]
      };

      this.myChart.setOption(option);
    },
    // 显示节点人物关系
    showNodeRelations(node) {
      this.currentNodeInfo = this.characterData[node.name];
      this.currentNodeRelations = this.getNodeRelations(node.name);
      this.showCharacterRelations = true;
    },
    // 获取节点的所有人物关系
    getNodeRelations(nodeName) {
      const relations = [];
      this.originalGraphData.links.forEach(link => {
        if (link.source === nodeName) {
          relations.push({ name: link.target, type: link.type });
        } else if (link.target === nodeName) {
          relations.push({ name: link.source, type: link.type });
        }
      });
      return relations;
    },
    // 隐藏人物关系
    hideCharacterRelations() {
      this.showCharacterRelations = false;
      this.currentNodeInfo = null;
      this.currentNodeRelations = [];
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

.view-two{
  background-color: #F5F5DC;
}

.category-button, .family-button {
  padding: 10px 20px;
  font-size: 10px;
  border-radius: 5px; /* 圆角 */
  cursor: pointer
}

.show-all-button {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 5px; /* 圆角 */
  cursor: pointer;
  background-color: #826c06; /* 绿色背景 */
  color: white; /* 白色文字 */
  margin-right: 10px; /* 按钮之间的间隔 */
}

#main-t {
  position: relative;
}
.character-relations {
  border: 1px solid black; /* 添加边框 */
  padding: 10px;
  margin-top: 20px;
}
.character-relations ul {
  display: flex;
  flex-wrap: wrap;
}
.character-relations li {
  flex: 0 0 25%; /* 每个li占1/4宽度 */
  box-sizing: border-box;
  padding: 10px;
}
</style>