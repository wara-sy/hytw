<template>
  <div id="view-one" style="background-color: #F5F5DC;">
    <div class="tittle">
    <h1>人物简介与活跃度</h1>
    <p>世事如棋，局局新。观人物之浮沉，知世事之变迁。</p>
    </div>
    <div class="container">
      <!-- 左侧展示散点图和按钮 -->
      <div class="left-column">
        <AppearanceCount ref="appearanceCount" @character-selected="handleCharacterSelected" />
        
        <!-- 散点图筛选按钮，移动到散点图下方 -->
        <div class="button-container">
          <button @click="filterData(0, 100)">非重点角色：0-100次</button>
          <button @click="filterData(100, 1000)">次要角色：100-1000次</button>
          <button @click="filterData(1000, 4300)">重点角色：1000-4300次</button>
        
          <button @click="resetFilter">重置筛选</button>
        </div>
        <div class="button-family">
          <button v-for="family in families" :key="family"
            :class="['family-' + family.replace(/ /g, '-'), { 'selected': selectedFamilies.includes(family) }]"
            @click="toggleFamilySelection(family)">
              {{ family }}
          </button>
        </div>
      </div>

      <!-- 右侧展示人物介绍和折线图 -->
      <div class="right-column">
        <CharactersIntro :selectedCharacter="selectedCharacter" />

        <!-- 折线图部分 -->
        <div class="line-chart">
          <CharacterLineChart v-if="selectedCharacter" :selectedCharacter="selectedCharacter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppearanceCount from '@/components/AppearanceCount.vue';
import CharactersIntro from '@/components/CharactersIntro.vue';
import CharacterLineChart from '@/components/CharacterLineChart.vue';

export default {
  name: 'view-one',
  components: {
    AppearanceCount,
    CharactersIntro,
    CharacterLineChart,
  },
  data() {
    return {
      selectedCharacter: null, // 当前选择的角色
      selectedFamilies: [], // 当前选择的家族
      families: ['贾府', '贾府-宁国府', '贾府-荣国府','史府','王府','薛府','非四大家族', ],
      minFrequency: null,
      maxFrequency: null,
    };
  },
  methods: {
    handleCharacterSelected(characterName) {
      this.selectedCharacter = characterName;
    },
    // 更新筛选方法，现在它会保留家族筛选并应用频率筛选
    filterData(min, max) {
      this.minFrequency = min; // 更新最小频率
      this.maxFrequency = max; // 更新最大频率
      if (this.$refs.appearanceCount) {
        // 传递家族筛选参数和频率筛选参数
        this.$refs.appearanceCount.filterData(min, max, this.selectedFamilies);
      } else {
        console.error('AppearanceCount 组件未正确加载');
      }
    },

    // 切换家族选择的方法
    toggleFamilySelection(family) {
      const index = this.selectedFamilies.indexOf(family);
      if (index > -1) {
        this.selectedFamilies.splice(index, 1);
      } else {
        this.selectedFamilies.push(family);
      }
      // 检查是否已经设置了频率筛选，如果没有则使用默认值
      const min = this.minFrequency !== null ? this.minFrequency : 0;
      const max = this.maxFrequency !== null ? this.maxFrequency : 4300;
      this.filterData(min, max);
    },

    resetFilter() {
      if (this.$refs.appearanceCount) {
        this.$refs.appearanceCount.resetFilter(); // 通过 ref 访问组件方法
      } else {
        console.error('AppearanceCount 组件未正确加载');
      }
    },
    
    resetFamilyFilter() {
      this.selectedFamilies = [];
      this.filterData(this.minFrequency, this.maxFrequency); // 更新筛选
    }
  }
};
</script>

<style scoped>

.container {
  background-color: #F5F5DC;
  display: flex;
  justify-content: space-between;
  gap: 0px; /* 控制两列之间的间距 */
}

.left-column {
  display: flex;
  flex-direction: column; /* 垂直排列左侧内容 */
  flex: 1.2; /* 左侧占据可用空间 */
}

.right-column {
  flex: 0.8; /* 右侧占据可用空间 */
}

.button-container {
  margin-top: 20px;
  margin-left: 70px;
  display: flex;
  gap: 10px;
}

.button-container button {
  padding: 10px 20px;
  background-color: #826c06; /* 绿色背景 */
  color: rgb(255, 255, 255); /* 文字 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 圆角 */
  transition: background-color 0.3s ease; /* 背景颜色过渡效果 */
}

.button-family {
  margin-top: 20px;
  margin-left: 70px;
  display: flex;
  gap: 10px;
}

.button-family button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

/* 为每个家族设置特定的颜色 */
.button-family button.family-贾府 { background-color: #961c1c; }
.button-family button.family-贾府-宁国府 { background-color: #d73624; }
.button-family button.family-贾府-荣国府 { background-color: #e44515f1; }
.button-family button.family-史府 { background-color: #d79319; }
.button-family button.family-王府 { background-color: #cd9c20; }
.button-family button.family-薛府 { background-color: #adc534; }
.button-family button.family-非四大家族 { background-color: #678435; }

/* 选中状态的样式 */
.button-family button.selected {
  transform: scale(1.1); /* 略微放大按钮 */
  box-shadow: 0 4px 7px rgb(166, 166, 166); /* 添加阴影效果 */
}



.line-chart {
  margin-top: 20px; /* 折线图距离人物介绍有一些间距 */
}
</style>