<template>
  <div class="home-page">
    <div class="left-panel">
      <img 
        src="/images/search-header.png" 
        class="header-image"
        alt="Sun Safety Header"
      >
      
      <div class="category extreme">
        <h2>Search your suburb</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Enter the suburb..."
          class="search-input"
        >
        <button 
          class="search-btn"
          @click="fetchUVData"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'SEARCH' }}
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="uv-results" v-if="uvData">
        <div class="current-uv">
          <h3>Current UV Index</h3>
          <div class="uvi-value">{{ uvData.now.uvi }}</div>
          <div class="status">{{ getUVStatus(uvData.now.uvi) }}</div>
        </div>

        <div class="forecast">
          <h3>24h Forecast</h3>
          <div class="forecast-items">
            <div 
              v-for="(item, index) in uvData.forecast" 
              :key="index"
              class="forecast-item"
            >
              <div class="time">{{ formatTime(item.time) }}</div>
              <div class="uvi">{{ item.uvi }}</div>
            </div>
          </div>
        </div>
      </div>

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
    </div>

    <img
      src="/images/safety-tips.png"
      class="right-image"
      alt="Safety Tips"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface UVData {
  now: {
    time: string
    uvi: number
  }
  forecast: Array<{
    time: string
    uvi: number
  }>
}

const isLoading = ref(false)
const searchQuery = ref('')
const uvData = ref<UVData | null>(null)
const error = ref<string | null>(null)

const GEO_API_KEY = 'c94f534d862d49c79d34ba0df24dc632'
const UV_API_KEY = 'openuv-c10rrm86m6so7-io'

const fetchUVData = async () => {
  try {
    isLoading.value = true
    error.value = null
    uvData.value = null

    const geoResponse = await axios.get('https://api.geoapify.com/v1/geocode/search', {
      params: {
        text: searchQuery.value,
        apiKey: GEO_API_KEY
      }
    })

    if (!geoResponse.data.features || geoResponse.data.features.length === 0) {
      error.value = 'Suburb not found. Please enter a valid suburb.'
      return
    }

    const [lng, lat] = geoResponse.data.features[0].geometry.coordinates

    const uvResponse = await axios.get('https://api.openuv.io/api/v1/uv', {
      headers: {
        'x-access-token': 'openuv-c10rrm86m6so7-io',
        'Content-Type': 'application/json'
      },
      params: { lat, lng }
    })

    console.log('UV Response:', uvResponse.data) // 调试用

    uvData.value = {
      now: {
        time: uvResponse.data.result.uv_time,
        uvi: uvResponse.data.result.uv
      },
      forecast: (uvResponse.data.result.uv_forecast || []).map(item => ({
        time: item.uv_time,
        uvi: item.uv
      }))
    }

  } catch (err) {
    console.error(err)
    error.value = 'Failed to fetch UV data. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

const getUVStatus = (uvi: number) => {
  if (uvi < 3) return 'Low'
  if (uvi < 6) return 'Moderate'
  if (uvi < 8) return 'High'
  if (uvi < 11) return 'Very High'
  return 'Extreme'
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

</script>



<style scoped>
.home-page {
  display: flex;
  background: #e0e4e9;
  min-height: 100vh;
  padding: 2rem;
}

.left-panel {
  width: 320px;
  position: relative;
  z-index: 20;
}

.header-image {
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.category {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-input {
  width: 90%;
  padding: 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin: 0.5rem 0;
}

.search-btn {
  width: 100%;
  padding: 0.8rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}


.right-image {
  position: fixed;
  left: 400px; 
  top: 2rem;
  width: 600px;
  height: 80vh;
  border-radius: 12px;
  box-shadow: 4px 4px 20px rgba(0,0,0,0.1);
  z-index: 10;
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