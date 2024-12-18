import { createRouter, createWebHistory } from 'vue-router';

// 引入页面组件
import ViewOne from '../views/ViewOne.vue';
import ViewTwo from '../views/ViewTwo.vue';
import ViewThree from '../views/ViewThree.vue';

import ClassSun from '@/components/ClassSun.vue';
import ClassNum from '@/components/ClassNum.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue'),  // 首页使用 App.vue
  },
  {
    path: '/view-one',
    name: 'view-one',
    component: ViewOne,  // 人物简介页面
  },
  {
    path: '/view-two',
    name: 'view-two',
    component: ViewTwo,  // 人物关系网页面
  },
  {
    path: '/view-three',
    name: 'view-three',
    component: ViewThree,  // 人物社会阶级页面
  },
  {
    path: '/class-sun',
    name: '/class-sun',
    component: ClassSun,
  },
  {
    path: '/class-num',
    name: '/class-num',
    component: ClassNum,
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;