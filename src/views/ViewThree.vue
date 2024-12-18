<template>
  <div class="view-three" style="background-color: #F5F5DC;">
    <div class="tittle">
      <h1>人物社会阶级</h1>
      <p>贵贱有序，阶级分明。察阶级之分布，明社会之分层。</p>
    </div>
    <div class="container">
      <div class="class-sun">
        <ClassSun></ClassSun>
      </div>
      <div class="class-num">
        <ClassNum></ClassNum>
      </div>
    </div>
  </div>
</template>

<script>
import ClassNum from '@/components/ClassNum.vue';
import ClassSun from '@/components/ClassSun.vue';

export default {
  name: 'view-three',
  components: {
    ClassSun,
    ClassNum
  }
}
</script>  

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
  width: 100%;
}

.class-sun {
  width: 50%; /* 旭日图占60%宽度 */
  height: 800px;
}

.class-num {
  width: 50%; /* ClassNum.vue 组件占35%宽度 */
  height: 800px;
  background-color: #F5F5DC;
  padding: 20px;
}

</style>