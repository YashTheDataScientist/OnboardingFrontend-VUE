<template>
  <div class="personalise-page">
    <h1>PERSONALISE YOUR RECOMMENDATION</h1>
    
    <div class="form-container">

      <div class="form-group">
        <label>Age:</label>
        <input 
          type="number" 
          v-model="formData.age"
          min="1"
          max="120"
          class="form-input"
          placeholder="Enter your age"
        >
      </div>


      <div class="form-group">
        <label>Skin Color:</label>
        <div class="radio-group">
          <label 
            v-for="color in skinColors"
            :key="color.value"
            class="radio-option"
          >
            <input
              type="radio"
              v-model="formData.skinColor"
              :value="color.value"
            >
            <span class="radio-label">{{ color.label }}</span>
            <div 
              class="color-sample"
              :style="{ backgroundColor: color.code }"
            ></div>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Gender:</label>
        <div class="radio-group">
          <label
            v-for="gender in genders"
            :key="gender.value"
            class="radio-option"
          >
            <input
              type="radio"
              v-model="formData.gender"
              :value="gender.value"
            >
            <span class="radio-label">{{ gender.label }}</span>
          </label>
        </div>
      </div>

      <div class="button-group">
        <button 
          class="btn reset-btn"
          @click="resetForm"
        >
          RESET
        </button>
        <button 
          class="btn submit-btn"
          @click="submitForm"
        >
          OK
        </button>
      </div>
    </div>
  </div>
  <div v-if="showAdvice" class="advice-section">
  <h2>Your Personalised Sunscreen Advice</h2>
  <ul>
    <li v-for="advice in adviceList" :key="advice">{{ advice }}</li>
  </ul>

  <div class="advice-images">
    <img src="/images/sinkyear.png" alt="Skin protection this year">
    <img src="/images/skintrend.png" alt="Skin care trends">
    <img src="/images/uvheatmap.png" alt="UV heatmap">
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'


interface FormData {
  age: number | null
  skinColor: string
  gender: string
}


const skinColors = [
  { value: 'fair', label: 'Fair', code: '#FFE4C4' },
  { value: 'medium', label: 'Medium', code: '#D2B48C' },
  { value: 'olive', label: 'Olive', code: '#808000' },
  { value: 'dark', label: 'Dark', code: '#704214' }
]


const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]


const formData = ref<FormData>({
  age: null,
  skinColor: 'medium',
  gender: 'other'
})






const showAdvice = ref(false)

const adviceList = ref<string[]>([])

const submitForm = () => {
  showAdvice.value = true

  adviceList.value = [] 
  if (formData.value.age && formData.value.age < 12) {
    adviceList.value.push("Children should use SPF 50+ sunscreen.")
  } else if (formData.value.age && formData.value.age < 60) {
    adviceList.value.push("Use sunscreen SPF 30+ daily, re-apply every 2 hours.")
  } else {
    adviceList.value.push("Older adults should use higher SPF and frequent reapplication.")
  }

  if (formData.value.skinColor === 'fair') {
    adviceList.value.push("Fair skin burns easily, use high SPF products (SPF 50+).")
  } else if (formData.value.skinColor === 'dark') {
    adviceList.value.push("Dark skin requires SPF protection of at least 15-30 SPF.")
  } else {
    adviceList.value.push("Medium and Olive skin tones should apply SPF 30+ regularly.")
  }

  if (formData.value.gender === 'female') {
    adviceList.value.push("Consider using sunscreen that doubles as moisturizer.")
  } else if (formData.value.gender === 'male') {
    adviceList.value.push("Consider sweat-resistant sunscreen for active lifestyle.")
  } else {
    adviceList.value.push("Choose sunscreen suitable for sensitive skin.")
  }

  console.log('Submitted:', formData.value)
}

const resetForm = () => {
  formData.value = {
    age: null,
    skinColor: 'medium',
    gender: 'other'
  }
  showAdvice.value = false
  adviceList.value = []
}

</script>

<style scoped>
.personalise-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-container {
  padding: 1.5rem;
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

.radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #4299e1;
}

input[type="radio"] {
  margin-right: 0.8rem;
}

.color-sample {
  width: 10px;
  height: 24px;
  border-radius: 50%;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn {
  background: #4299e1;
  color: white;
}

.reset-btn {
  background: #cbd5e0;
  color: #4a5568;
}

.btn:hover {
  opacity: 0.9;
}
.advice-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.advice-section h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
}

.advice-section ul {
  list-style: disc;
  padding-left: 2rem;
  margin-bottom: 1.5rem;
}

.advice-images {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.advice-images img {
  max-width: 30%;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

</style>