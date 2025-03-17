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
        <div class="current-uv" :style="{ backgroundColor: getUVStatus(uvData.now.uvi).color }">
          <h3>Current UV Index</h3>
          <div class="uvi-value">{{ uvData.now.uvi }}</div>
          <div class="status">{{ getUVStatus(uvData.now.uvi).status }}</div>
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
      <div>
        <h2>Sun Safety and Cancer Trends</h2>
        <CancerTrendsChart />
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
    <section class="recommendation-section">
    <h2 class="section-title">RECOMMENDATION</h2>
    <div class="recommendation-container">
      <div class="recommendation-card">
        <h3>ALL YOU NEED TO KNOW ABOUT SUNSCREEN</h3>
        <img :src="'/images/sunscreen.png'" alt="Sunscreen Recommendations">
        <button class="btn-read-more" @click="fetchRecommendations">Read More</button>
      </div>

      <div class="recommendation-card">
        <h3>WHAT TO WEAR THIS SUMMER</h3>
        <img :src="'/images/wear.png'" alt="What to Wear Recommendations">
        <button class="btn-read-more" @click="fetchRecommendations">Read More</button>
      </div>
    </div>

  
    <div v-if="products.length" class="recommended-products">
      <h4>Recommended Products:</h4>
      <ul>
        <li v-for="product in products" :key="product.product_id">
          {{ product.product_name }}
        </li>
      </ul>
    </div>
  </section>
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
interface Product {
  product_id: number
  product_name: string
}
const products = ref<Product[]>([])

const fetchRecommendations = async () => {
  try {
    const response = await axios.get('https://443a5sxzx7.execute-api.ap-southeast-2.amazonaws.com/test/get_db')

    if (response.status === 200) {
      const responseBody = JSON.parse(response.data.body)
      products.value = responseBody
    } else {
      alert('Failed to fetch recommendations')
    }
  } catch (error) {
    console.error('API request error:', error)
    alert('Failed to fetch recommendations')
  }
}

const isLoading = ref(false)
const searchQuery = ref('')
//const uvData = ref<UVData | null>(null)
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
  if (uvi < 3) return { status: 'Low', color: '#8BC34A' } // green
  if (uvi < 6) return { text: 'Moderate', color: '#FBD44E' } // 黄色
  if (uvi < 8) return { status: 'High', color: '#F2994A' } // 橙色
  if (uvi < 11) return { status: 'Very High', color: '#EB5757' } // 深橙色
  return { status: 'Extreme', color: '#C0392B' } // 红色
}

const uvData = ref({
  now: {
    time: '',
    uvi: 0
  }
})

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}


import CancerTrendsChart from "@/components/CancerTrendsChart.vue";

</script>



<style scoped>
.home-page {
  background-image: url('/images/background.png');
  background-repeat: no-repeat; 
  background-position: center; 
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  padding-bottom: 2rem;
  padding-left: 2rem; 
}
.current-uv {
  padding: 1rem;
  border-radius: 10px;
  color: white;
  text-align: center;
  margin-top: 1rem;
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
  border: 1px solid #e0e6ec;
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



.side-nav {
  margin-top: 2rem;
}

.nav-btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  background: #758fbc; 
  color: white !important;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #4299e1; 
  transform: translateX(5px);
}


.router-link-active.nav-btn {
  background: #4299e1;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
}


.header-image {
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.right-image {
  position: fixed;
  left: 720px; /* 左侧面板宽度320px + 40px间距 */
  top: 5rem;
  width: 600px;
  max-height: 25vh;
  border-radius: 12px;
  box-shadow: 4px 4px 20px rgba(0,0,0,0.15);
  z-index: 10;
}
.recommendation-section {
  width: 100%;
  max-width: 1200px;
  margin-top: 3rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.recommendation-container {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.recommendation-card {
  background: #e2ecf9;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 45%;
}

.recommendation-card img {
  width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.btn-read-more {
  background: #3c4f76;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-read-more:hover {
  background: #2a69ac;
}

@media (max-width: 768px) {
  .recommendation-container {
    flex-direction: column;
    align-items: center;
  }

  .recommendation-card {
    width: 90%;
    margin-bottom: 2rem;
  }
}

.recommended-products {
  margin-top: 2rem;
  background-color: #f0f7ff;
  padding: 1.5rem;
  border-radius: 8px;
}

.recommended-products ul {
  list-style: none;
  padding: 0;
}

.recommended-products li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.recommended-products li:last-child {
  border-bottom: none;
}

</style>