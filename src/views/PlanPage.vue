<template>
  <div class="plan-page">
    <h1 class="page-title">PLAN AHEAD, PROTECT YOUR SKIN</h1>
    
    <div class="plan-form">
 
      <div class="form-group">
        <label>Enter Starting (CITY/COUNTRY)</label>
        <input
          type="text"
          v-model="form.startPoint"
          placeholder="Enter "
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label>Enter Destination(CITY/COUNTRY)</label>
        <input
          type="text"
          v-model="form.destination"
          placeholder="Enter "
          class="form-input"
        >
      </div>

   
      <div class="datetime-group">

        <div class="form-group">
          <label>Choose Date</label>
          <input
            type="date"
            v-model="form.date"
            class="date-input"
            :min="today"
          >
        </div>

     
        <div class="form-group">
          <label>Choose Time</label>
          <div class="time-input-group">
            <input
              type="time"
              v-model="form.time"
              class="time-input"
            >
            <select 
              v-model="form.period"
              class="period-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        class="submit-btn"
        @click="handleSubmit"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? 'Loading...' : 'PLAN' }}
      </button>
    </div>
    <div v-if="weatherData" class="weather-display">
      <h2>Weather in {{ weatherData.location.name }}</h2>
      <div class="weather-info">
        <img 
          :src="weatherData.current.condition.icon" 
          :alt="weatherData.current.condition.text"
          class="weather-icon"
        >
        <div class="weather-details">
          <p>{{ weatherData.current.condition.text }}</p>
          <p>Temperature: {{ weatherData.current.temp_c }}°C</p>
          <p>UV Index: {{ weatherData.current.uv }}</p>
        </div>
      </div>
      <div class="weather-chart">
        <h3>24 Hour Forecast</h3>
        <canvas ref="chartEl"></canvas>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chart = ref<Chart>()
const chartEl = ref<HTMLCanvasElement>()

interface PlanForm {
  startPoint: string
  destination: string
  date: string
  time: string
  period: 'AM' | 'PM'
}

interface WeatherData {
  location: { name: string }
  current: {
    condition: { text: string; icon: string }
    temp_c: number
    uv: number
  }
  forecast: { forecastday: Array<{
    hour: Array<{ time: string; temp_c: number; uv: number; condition: { icon: string; text: string } }>
  }> }
}

const form = ref<PlanForm>({
  startPoint: '',
  destination: '',
  date: '',
  time: '09:00',
  period: 'AM'
})

const today = new Date().toISOString().split('T')[0]
const weatherData = ref<WeatherData | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const API_KEY = '7356d702687a4628a9242640251403'

const isFormValid = computed(() => {
  return form.value.startPoint.length >= 4 &&
         form.value.destination.length >= 4 &&
         form.value.date &&
         form.value.time
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = null
    weatherData.value = null

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${form.value.startPoint}&dt=${form.value.date}`
    )

    if (!response.ok) throw new Error('Failed to fetch weather data')

    const data = await response.json()

    weatherData.value = data

    console.log('Plan submitted:', {
      start: form.value.startPoint,
      end: form.value.destination,
      datetime: formatDateTime()
    })

    await nextTick()
    initChart()

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to get weather data'
  } finally {
    isLoading.value = false
  }
}

const formatDateTime = () => {
  const [hours, minutes] = form.value.time.split(':')
  let hours24 = parseInt(hours)
  if (form.value.period === 'PM' && hours24 < 12) {
    hours24 += 12
  } else if (form.value.period === 'AM' && hours24 === 12) {
    hours24 = 0
  }
  return `${form.value.date}T${String(hours24).padStart(2, '0')}:${minutes}`
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

const initChart = () => {
  if (!chartEl.value || !weatherData.value) return

  if (chart.value) chart.value.destroy()

  const forecastHours = weatherData.value.forecast.forecastday[0].hour

  chart.value = new Chart(chartEl.value, {
    type: 'line',
    data: {
      labels: forecastHours.map(d => formatTime(d.time)),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: forecastHours.map(d => d.temp_c),
          borderColor: '#ff6b6b',
          backgroundColor: '#ff6b6b33',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'UV Index',
          data: forecastHours.map(d => d.uv),
          borderColor: '#4299e1',
          backgroundColor: '#4299e133',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: {
          display: true,
          position: 'left',
          title: { display: true, text: 'Temperature (°C)' }
        },
        y1: {
          display: true,
          position: 'right',
          title: { display: true, text: 'UV Index' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  })
}
</script>


<style scoped>
.plan-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
}

.page-title {
  color: #2c3e50;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.plan-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.8rem;
  color: #4a5568;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
}

.datetime-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.time-input-group {
  display: flex;
  gap: 1rem;
}

.time-input {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
}

.period-select {
  width: 100px;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  background: white;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .datetime-group {
    grid-template-columns: 1fr;
  }
  
  .period-select {
    width: 100%;
  }
  
  .plan-form {
    padding: 1.5rem;
  }
  weather-display {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

.weather-details {
  font-size: 1.1rem;
  color: #4a5568;
}

.error-message {
  color: #e53e3e;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 6px;
  margin-top: 1rem;
}
}
.weather-chart {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

canvas {
  max-height: 400px;
}

@media (max-width: 600px) {
  .weather-chart {
    padding: 1rem;
  }
  
  canvas {
    max-height: 300px;
  }
}
</style>