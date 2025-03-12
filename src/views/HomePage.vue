<template>
    <div class="home-page">
      <div class="left-panel">
        <!-- 紫外线指数内容 -->
        <div class="uv-section">
            <img 
            src="/images/search-header.png" 
            class="header-image"
            alt="Sun Safety Header"
            >
            <div class="category extreme">
            <h2>Search your suburd</h2>
            <input 
              type="text" 
              placeholder="Enter the suburb..."
              class="search-input"
            >
            <button class="search-btn">SEARCH</button>
          </div>
        </div>
  
        <!-- 底部导航 -->
        <nav class="side-nav">
          <router-link to="/personalise" class="nav-btn">
            PERSONALISE YOUR RECOMMENDATIONS
          </router-link>
          <router-link to="/remind" class="nav-btn">
            SET REMINDER
          </router-link>
          <router-link to="/plan" class="nav-btn">
            PLAN YOUR TRIP SAFELY
          </router-link>
        </nav>
        <img
        src="/images/safety-tips.png"
        class="right-image"
        alt="Safety Tips"
      >
      </div>
    </div>
  </template>

<!-- HomePage.vue 的 style 部分 -->
<style scoped>
.home-page {
  background: #e0e4e9; /* 深蓝底色 */
  min-height: 100vh;
  padding: 2rem;
}

.left-panel {
  width: 320px; /* 左侧固定宽度 */
  margin-right: auto; /* 保持左侧定位 */
}

.title {
  color: rgb(54, 156, 174);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

/* 紫外线分类区块 */
.category {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.category h2 {
  color: rgb(10, 74, 65);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.values {
  color: #14171c;
  font-size: 0.9rem;
}

/* 搜索框样式 */
.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #7b90b0;
  border-radius: 4px;
  background: #eef0f3;
  color: white;
  margin: 0.5rem 0;
}

.search-btn {
  width: 100%;
  padding: 0.6rem;
  background: #4299e1; /* 亮蓝色按钮 */
  color: rgb(21, 6, 6);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 导航按钮 */
.side-nav {
  margin-top: 2rem;
}

.nav-btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  background: #758fbc; /* 深灰蓝色 */
  color: white !important;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #4299e1; /* 悬停亮蓝色 */
  transform: translateX(5px);
}

/* 当前激活按钮样式 */
.router-link-active.nav-btn {
  background: #4299e1;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
}

/* 在原有样式后追加 */
.header-image {
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.right-image {
  position: fixed;
  left: 720px; /* 左侧面板宽度320px + 40px间距 */
  top: 2rem;
  width: 600px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 4px 4px 20px rgba(0,0,0,0.15);
  z-index: 10;
}

/* 调整左侧面板避免重叠 */
.left-panel {
  position: relative; /* 确保右侧图片定位基准 */
  z-index: 20; /* 保持左侧内容在前 */
}
</style>