<template>
    <div class="about-container">
      <h1 class="title">Meet Our Amazing Team</h1>
  
      <div class="team-section">
        <div class="team-images">
          <img src="/images/team.jpg" alt="Team Photo 1" class="team-image" />
          <img src="/images/team2.jpg" alt="Team Photo 2" class="team-image" />
        </div>
  
        <div class="team-names">
          <ul>
            <li v-for="member in teamMembers" :key="member">{{ member }}</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const teamMembers = ref([
    "Shifara",
    "Tina",
    "Yichen",
    "Yashwanth",
    "Nuo",
    "Shuai"
  ]);
  </script>
  
  <style scoped>
  .about-container {
    width: 100%;
    text-align: center;
    padding: 50px 20px;
    background: #121212;
    color: white;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .team-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
  }
  
  .team-images {
    display: flex;
    gap: 20px;
  }
  
  .team-image {
    width: 500px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
  }
  
  .team-names {
    text-align: left;
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .team-names ul {
    list-style: none;
    padding: 0;
  }
  
  .team-names li {
    margin: 10px 0;
  }
  </style>
  