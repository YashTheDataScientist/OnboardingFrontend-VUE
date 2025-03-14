/* App.vue */
<template>
  <div class="app-container">
    <header class="global-header">
      <router-link 
        to="/" 
        class="home-link"
        v-if="$route.path !== '/'"
      >
        ← Back to Home
      </router-link>
      <h1 class="app-title">Sun Safety Guard</h1>
    </header>

    <!-- 合并后的正确路由视图 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #4299e1;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.home-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  margin-right: 2rem;
  transition: opacity 0.2s;
}

.home-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.app-title {
  margin: 0;
  font-size: 1.4rem;
}

.router-view {
  margin-top: 70px;
}


</style>