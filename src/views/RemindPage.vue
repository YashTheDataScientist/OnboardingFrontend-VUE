<template>
  <div class="remind-page">
    <h1 class="page-title">DON'T FORGET TO RE-APPLY YOUR SUNSCREEN🧴</h1>
    <h2 class="page-subtitle">WE WILL HELP YOU</h2>

    <div class="reminder-container">
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
          <label>Re-applying interval</label>
          <div class="interval-input-group">
            <input
              type="number"
              v-model="reminderData.interval"
              :min="minInterval"
              :max="maxInterval"
              class="interval-input"
              required
            >
            <select 
              v-model="reminderData.intervalUnit"
              class="unit-select"
            >
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
            </select>
          </div>
        </div>

        <button 
          class="submit-btn"
          @click="setReminder"
          :disabled="!isFormValid || isCounting"
        >
          {{ isCounting ? 'Counting...' : 'SET REMINDER' }}
        </button>
      </div>

      <div class="countdown-section">
        <div v-if="timerStore.isCounting" class="countdown-box">
          <div class="countdown-display">{{ timerStore.formattedCountdown }}</div>
          <button class="cancel-btn" @click="cancelCountdown">Cancel</button>
        </div>
        <div v-if="timerStore.showAlert" class="alert-message">
          ❤️ Please reapply sunscreen! ❤️
        </div>
      </div>
    </div>
  </div>
  <div class="reminder-info-section">
  <img src="/images/remind.png" alt="Reminder Image" class="reminder-img"/>
  
  <div class="reminder-text">
    <h2 class="reminder-tip">Use the Two-Finger Rule</h2>
    <p>A common rule of thumb is to use a nickel-sized amount or about two finger lengths of sunscreen for your face. This should provide adequate coverage to protect your skin.</p>

    <h2 class="reminder-tip">Cover All Exposed Areas</h2>
    <p>Ensure that you cover all exposed areas of your face, including your forehead, nose, cheeks, chin, and neck. Many people tend to overlook the neck, which is susceptible to sun damage.</p>

    <h2 class="reminder-tip">Reapply as Needed</h2>
    <p>Sunscreen effectiveness diminishes over time, especially if you sweat or swim. Reapply sunscreen every two hours or more frequently if you’re sweating or in the water.</p>

    <h2 class="reminder-tip">Layering: Moisturizer and Sunscreen</h2>
    <p>If you use a separate moisturizer, apply it first, and then follow it with sunscreen. Make sure to wait a few minutes between applying products to allow proper absorption.</p>

    <h2 class="reminder-tip">Don’t Forget Your Lips</h2>
    <p>Your lips are also susceptible to sun damage. Use a lip balm or lipstick with SPF protection to keep them safe.</p>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTimerStore } from '@/stores/timerStore'

const timerStore = useTimerStore()

const reminderData = ref({
  time: '09:00',
  period: 'AM',
  interval: 2,
  intervalUnit: 'hours'
})

const minInterval = computed(() => reminderData.value.intervalUnit === 'minutes' ? 1 : 1)
const maxInterval = computed(() => reminderData.value.intervalUnit === 'minutes' ? 240 : 12)

const isFormValid = computed(() => {
  return reminderData.value.time && 
         reminderData.value.interval >= minInterval.value &&
         reminderData.value.interval <= maxInterval.value
})

const setReminder = () => {
  if (!isFormValid.value) return
  
  const multiplier = reminderData.value.intervalUnit === 'minutes' ? 60 : 3600
  const seconds = reminderData.value.interval * multiplier

  timerStore.setTimer(seconds)
}

const cancelCountdown = () => {
  timerStore.clearTimer()
}
</script>

<style scoped>
.remind-page {
  width: 100%;
  padding: 3rem 5%;
  background-color: #f2e3d1;
  border-radius: 0;
  box-shadow: none;
  border-radius: 8px;
}


.page-title {
  color: #460731;
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  color: #4a5568;
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 3rem;
}

.reminder-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
}

.reminder-form {
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #34495e;
}

.time-input-group, .interval-input-group {
  display: flex;
  gap: 1rem;
}

.time-input, .interval-input, .period-select, .unit-select {
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0cbcb;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background: #e88438;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.countdown-box {
  padding: 3rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  text-align: center;
}

.countdown-display {
  font-size: 4rem;
  color: #34495e;
  font-weight: bold;
  margin-bottom: 2rem;
}

.cancel-btn {
  padding: 1rem 2rem;
  background: #e74c3c;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.alert-message {
  font-size: 1.6rem;
  color: #e74c3c;
  padding: 1rem;
  text-align: center;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .reminder-container {
    grid-template-columns: 1fr;
  }

  .countdown-display {
    font-size: 3rem;
  }
}

.reminder-info-section {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background-color: #ffeedc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.reminder-img {
  width: 50%;
  border-radius: 10px;
  object-fit: cover;
}

.reminder-text {
  flex: 1;
}

.reminder-tip {
  color: #8e3a59;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.reminder-text p {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .reminder-info-section {
    flex-direction: column;
  }

  .reminder-img {
    width: 100%;
  }
}

</style>