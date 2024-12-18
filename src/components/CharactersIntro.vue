<template>
    <div class="container">
      <div class="left-column">
        <AppearanceCount @character-selected="handleCharacterSelected" />
      </div>
  
      <div class="right-column">
        <!-- 人物头像和简介部分 -->
        <div class="avatar-intro">
          <img :src="avatarSrc" alt="角色头像" class="avatar" />
          <p class="intro">{{ characterIntro }}</p>
        </div>
  
        <!-- 人物出现频次折线图 -->
        <div class="person-count">
          <PersonCount :selectedCharacter="selectedCharacter" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // 导入所需的组件
  import AppearanceCount from '@/components/AppearanceCount.vue';
  import PersonCount from '@/components/CharacterLineChart.vue';
  
  export default {
    name: "CharactersIntro",
    components: {
      AppearanceCount,
      PersonCount
    },
    data() {
      return {
        avatarSrc: '/avatars/JBY.jpg', // 默认显示贾宝玉
        characterIntro: '请选择一个角色以查看其简介。',
        characterData: [], // 存储角色数据
        selectedCharacter: null, // 当前选中的角色
      };
    },
    mounted() {
      // 获取角色数据
      fetch('/data_character.json')
        .then(response => response.json())
        .then(data => {
          this.characterData = data;
          this.updateCharacterInfo(this.selectedCharacter);
        })
        .catch(error => {
          console.error("获取角色数据时出错：", error);
        });
    },
    watch: {
      // 当选中的角色变化时更新人物信息
      selectedCharacter(newCharacter) {
        this.updateCharacterInfo(newCharacter);
      },
    },
    methods: {
      // 更新人物信息
      updateCharacterInfo(characterName) {
        if (characterName) {
          const character = this.characterData.find(char => char.name === characterName);
          if (character) {
            this.characterIntro = character.background; // 更新简介
            this.avatarSrc = character.avatar; // 更新头像
          } else {
            this.characterIntro = '角色信息未找到。';
            this.avatarSrc = '/avatars/JBY.jpg'; // 恢复默认头像
          }
        }
      },
      // 角色选择时更新选中的角色
      handleCharacterSelected(characterName) {
        this.selectedCharacter = characterName;
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex; /* 使用 Flexbox 布局 */
  }
  
  .avatar-intro {
    text-align: center; /* 头像和简介居中 */
    margin-bottom: 20px; /* 与下面的组件留出空间 */
    margin-top:10px;
    min-width: 500px;
    display: flex;
  }
  
  .avatar {
    width: 100px; /* 设置头像宽度 */
    height: 150px; /* 设置头像高度 */
    margin-left: 60px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    flex:0.3;
  }
  
  .intro {
    font-size: 18px;
    width: 100%;
    height: 100px;
    margin-right: 40px;
    color: #555;
    flex: 1.7;
    padding-left: 20px;
  }

  .person-count {
    width: 950px;
    height: 400px;
  }


  
  </style>
  