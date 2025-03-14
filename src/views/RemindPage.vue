<template>
  <div class="remind-page">
    <h1 class="page-title">DON'T FORGET TO RE-APPLY YOUR SUNSCREEN</h1>
    <h2 class="page-subtitle">WE WILL HELP YOU</h2>

    <div class="reminder-form">
      <div class="form-group">
        <label>Last applied time</label>
        <div class="time-input-group">
          <input
            type="time"
            v-model="reminderData.time"
            class="time-input"
            required
          >
          <select 
            v-model="reminderData.period"
            class="period-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Re-applying interval (hours)</label>
        <input
          type="number"
          v-model="reminderData.interval"
          min="1"
          max="12"
          class="interval-input"
          required
        >
      </div>

      <button 
        class="submit-btn"
        @click="setReminder"
        :disabled="!isFormValid"
      >
        SET REMINDER
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ReminderData {
  time: string
  period: 'AM' | 'PM'
  interval: number
}

const reminderData = ref<ReminderData>({
  time: '09:00',
  period: 'AM',
  interval: 2
})

const isFormValid = computed(() => {
  return reminderData.value.time && 
         reminderData.value.interval >= 1 &&
         reminderData.value.interval <= 12
})

const setReminder = () => {
  if (!isFormValid.value) return
  
  // 转换为24小时制
  const [hours, minutes] = reminderData.value.time.split(':')
  let hours24 = parseInt(hours)
  if (reminderData.value.period === 'PM' && hours24 < 12) {
    hours24 += 12
  } else if (reminderData.value.period === 'AM' && hours24 === 12) {
    hours24 = 0
  }

  const reminderConfig = {
    time: `${String(hours24).padStart(2, '0')}:${minutes}`,
    interval: reminderData.value.interval * 60 * 60 * 1000 // 转换为毫秒
  }

  console.log('Reminder set:', reminderConfig)
  // TODO: 实际设置提醒逻辑
  alert('Reminder set successfully!')
}
</script>

<style scoped>
.remind-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 20px;
}

.page-title {
  color: #2c3e50;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  color: #4a5568;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.reminder-form {
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

.time-input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.time-input {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
}

.period-select {
  width: 100px;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
}

.interval-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
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

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

@media (max-width: 600px) {
  .remind-page {
    padding: 1rem;
  }
  
  .time-input-group {
    flex-direction: column;
  }
  
  .period-select {
    width: 100%;
  }
}
</style>