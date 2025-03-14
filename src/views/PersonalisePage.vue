<template>
  <div class="personalise-page">
    <h1>PERSONALISE YOUR RECOMMENDATION</h1>
    
    <div class="form-container">
      <!-- 年龄输入 -->
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

      <!-- 肤色选择 -->
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

      <!-- 性别选择 -->
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

      <!-- 操作按钮 -->
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单数据类型
interface FormData {
  age: number | null
  skinColor: string
  gender: string
}

// 肤色选项
const skinColors = [
  { value: 'fair', label: 'Fair', code: '#FFE4C4' },
  { value: 'medium', label: 'Medium', code: '#D2B48C' },
  { value: 'olive', label: 'Olive', code: '#808000' },
  { value: 'dark', label: 'Dark', code: '#704214' }
]

// 性别选项
const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

// 响应式数据
const formData = ref<FormData>({
  age: null,
  skinColor: 'medium',
  gender: 'other'
})

// 提交表单
const submitForm = () => {
  console.log('Submitted:', formData.value)
  // TODO: 提交到API
}

// 重置表单
const resetForm = () => {
  formData.value = {
    age: null,
    skinColor: 'medium',
    gender: 'other'
  }
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
</style>