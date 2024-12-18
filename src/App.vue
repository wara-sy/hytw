<template>
  <div id="app" class="app-container">
    <!-- 首页部分 -->
    <section class="home-section" :style="homeSectionStyle">
      <!-- 使用古典字体并添加阴影 -->
      <h1 class="home-title" style="font-family: '楷体', serif; font-size: 4em; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">红缘探微——红楼梦人物关系可视化</h1>
      <p class="home-subtitle" style="font-family: '楷体', serif; font-size: 2em; color: white; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);">探索《红楼梦》中错综复杂的人物关系及社会阶级状况</p>
    </section>

    <!-- 介绍三个页面部分 -->
    <section class="intro-section">
      <div class="intro-item" @click="scrollTo('viewOne')">
        <h2>人物简介</h2>
        <p>深入了解《红楼梦》中的主要人物及其背景，揭示他们在故事中的活跃度。</p>
      </div>
      <div class="intro-item" @click="scrollTo('viewTwo')">
        <h2>人物关系网</h2>
        <p>利用人物关系网，分析人物之间的关系，揭示《红楼梦》中错综复杂的亲情、友情与爱情。</p>
      </div>
      <div class="intro-item" @click="scrollTo('viewThree')">
        <h2>人物社会阶级</h2>
        <p>探索《红楼梦》背景下的社会阶层分布，分析封建社会的阶级构成。</p>
      </div>
    </section>

    <!-- 三个页面视图部分 -->
    <section class="view-section">
      <!-- 展示view1 -->
      <div class="first-column" ref="viewOne">
        <ViewOne />
      </div>

      <!-- 展示view2 -->
      <div class="second-column" ref="viewTwo">
        <ViewTwo />
      </div>

      <!-- 展示view3 -->
      <div class="third-column" ref="viewThree">
        <ViewThree />
      </div>
    </section>

    <!-- 红楼梦链接推送部分 -->
<section class="links-section">
  <div class="link-container">
    <!-- 原始链接项 -->
    <div class="link-item" v-for="(link, index) in links" :key="index">
      <a :href="link.url" target="_blank" class="link-anchor">
        <img :src="link.image" :alt="link.title" class="link-image">
        <h3 class="link-title">{{ link.title }}</h3>
      </a>
    </div>
    <!-- 克隆链接项以实现循环滚动效果 -->
    <div class="link-item" v-for="(link, index) in links" :key="`clone-${index}`">
      <a :href="link.url" target="_blank" class="link-anchor">
        <img :src="link.image" :alt="link.title" class="link-image">
        <h3 class="link-title">{{ link.title }}</h3>
      </a>
    </div>
  </div>
</section>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ViewOne from './views/ViewOne.vue';
import ViewTwo from './views/ViewTwo.vue';
import ViewThree from './views/ViewThree.vue';


const images = [
  'ALL.jpg',
  'ALL1.jpg',
  'ALL2.jpg',
  'ALL3.jpg',
  'ALL4.jpg',
  'ALL5.jpg',
  'ALL6.jpg',
  'ALL7.jpg'
];

const currentImageIndex = ref(0);

export default {
  name: 'app',
  components: {
    ViewOne,
    ViewTwo,
    ViewThree
  },
  setup() {
    const homeSectionStyle = computed(() => ({
      backgroundImage: `url(${require(`@/assets/${images[currentImageIndex.value]}`)})`
    }));

    const links = ref([
      { title: '红楼梦人物详解', image: require('@/assets/Link1.jpg'), url: 'https://baijiahao.baidu.com/s?id=1794650367122142272' },
      { title: '红楼梦社会背景分析', image: require('@/assets/Link2.jpg'), url: 'https://zhuanlan.zhihu.com/p/544969639' },
      { title: '红楼梦诗词鉴赏', image: require('@/assets/Link3.jpg'), url: 'https://www.gushicimingju.com/gushi/hongloumengshici/' },
      { title: '红楼梦百度百科', image: require('@/assets/Link4.jpg'), url: 'https://baike.baidu.com/item/%E7%BA%A2%E6%A5%BC%E6%A2%A6/15311' },
      { title: '红楼梦87年版电视剧', image: require('@/assets/Link5.jpg'), url: 'https://www.bilibili.com/bangumi/play/ep327843?bsource=bing_ogv' },
      { title: '红楼梦小说全集', image: require('@/assets/Link6.jpg'), url: 'https://hongloumeng.5000yan.com/' },
      { title: '深度解读《红楼梦》：人性洞察', image: require('@/assets/Link7.jpg'), url: 'https://www.sohu.com/a/455254361_661905' },
      { title: '从多个角度解读人生和世界的哲学巨作', image: require('@/assets/Link8.jpg'), url: 'https://baijiahao.baidu.com/s?id=1781222836422610802' },

    ]);

    const changeBackground = () => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
    };

    const intervalId = setInterval(changeBackground, 3000);

    onMounted(() => {
      document.querySelector('.app-container').style.opacity = 1;
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      homeSectionStyle,
      changeBackground,
      intervalId,
      links,
    };
  },
  methods: {
    scrollTo(viewRef) {
      const element = this.$refs[viewRef];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  transition: opacity 1.5s ease-in-out;
  background-color: #F5F5DC;
  opacity: 0; 
}

/* 入场动画样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


  /* 首页部分背景和文本 */
.home-section {
  position: relative;
  background-size: cover;
  background-position: center;
  height: 550px;
  color: #F5F5DC;
  text-align: center;
  padding: 80px 20px;
  transition: background-image 1s ease-in-out; /* 平滑过渡背景图 */
}

.home-title {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
}

.home-subtitle {
  font-size: 20px;
}

/* 介绍三个页面部分 */
.intro-section {
  display: flex;
  justify-content: space-around; /* 均匀分布 */
  padding: 50px 20px;
  background-color: #F5F5DC;
  
}

.intro-item {
  width: 30%;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-image: url('@/assets/BK.jpg');
  background-size: 100% 100%; 
  background-position: center;
  background-repeat: no-repeat;
}

.intro-item h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.intro-item p {
  font-size: 16px;
  color: #555;
}

/* 三个页面部分 */
.view-section {
  display: flex;
  flex-direction: column;
  height: 2500px; 
}

.first-column {
  width: 100%; 
  height: 800px; 
}
.second-column{
  width: 100%; 
  height: 900px;
}

.third-column{
  width: 100%; 
  height: 800px;
}

  /* 响应式设计 */
@media (max-width: 768px) {
  .intro-section {
    flex-direction: column;
    align-items: center;
  }

  .intro-item {
    width: 80%;
    margin-bottom: 20px;
  }

  .view-section {
      width: 100%;
      height: 100%; 
    }
}

/* 红楼梦链接推送部分样式 */
.links-section {
  background-color: #F5F5DC;
  padding: 20px;
  margin-top: 220px;
  overflow: hidden;
  border-top: 5px solid #961c1c;
  position: relative; /* 为定位容器做准备 */
}

.link-container {
  display: flex;
  animation: scrollLink 28s linear infinite; /* 添加滚动动画 */
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  white-space: nowrap;
}

.link-image {
  height: 180px; /* 固定高度 */
  width: auto; /* 宽度自动调整以保持宽高比 */
  border-radius: 4px;
}

.link-title {
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
  color: #961c1c;
}

/* 定义滚动动画 */
@keyframes scrollLink {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%); /* 移动到容器的宽度 */
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .link-image {
    width: 100px; /* 在小屏幕上调整大小 */
  }
}
</style>