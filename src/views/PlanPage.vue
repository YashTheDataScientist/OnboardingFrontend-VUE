<template>
  <div class="plan-page">
    <h1 class="page-title">PLAN AHEAD, PROTECT YOUR SKIN</h1>
    
    <div class="plan-form">
      <!-- 起始点 -->
      <div class="form-group">
        <label>Choose Starting Point</label>
        <input
          type="text"
          v-model="form.startPoint"
          placeholder="Enter postcode..."
          class="form-input"
        >
      </div>

      <!-- 目的地 -->
      <div class="form-group">
        <label>Choose Destination</label>
        <input
          type="text"
          v-model="form.destination"
          placeholder="Enter postcode..."
          class="form-input"
        >
      </div>

      <!-- 日期时间 -->
      <div class="datetime-group">
        <!-- 日期选择 -->
        <div class="form-group">
          <label>Choose Date</label>
          <input
            type="date"
            v-model="form.date"
            class="date-input"
            :min="today"
          >
        </div>

        <!-- 时间选择 -->
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
        :disabled="!isFormValid"
      >
        PLAN
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PlanForm {
  startPoint: string
  destination: string
  date: string
  time: string
  period: 'AM' | 'PM'
}

const form = ref<PlanForm>({
  startPoint: '',
  destination: '',
  date: '',
  time: '09:00',
  period: 'AM'
})

const today = new Date().toISOString().split('T')[0]

const isFormValid = computed(() => {
  return form.value.startPoint.length >= 4 &&
         form.value.destination.length >= 4 &&
         form.value.date &&
         form.value.time
})

const handleSubmit = () => {
  // 转换时间为24小时制
  const [hours, minutes] = form.value.time.split(':')
  let hours24 = parseInt(hours)
  if (form.value.period === 'PM' && hours24 < 12) {
    hours24 += 12
  } else if (form.value.period === 'AM' && hours24 === 12) {
    hours24 = 0
  }

  const planData = {
    start: form.value.startPoint,
    end: form.value.destination,
    datetime: `${form.value.date}T${String(hours24).padStart(2, '0')}:${minutes}`
  }

  console.log('Plan submitted:', planData)
  // TODO: 提交到API
  alert('Trip plan created successfully!')
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
}
</style>