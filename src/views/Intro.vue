<template>
    <div class="landing-container">
      <img src="@/assets/logo.png" class="bouncing-logo" alt="SPF Society Logo" @click="goToHome" />
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToHome() {
        this.$router.push("/home"); // Change '/home' to the actual main page route
      }
    }
  };
  </script>
  
  <style scoped>
.landing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;  /* Ensures full width */
  background: black;
}

.bouncing-logo {
  width: 500px;
  animation: bounce 2s infinite;
  cursor: pointer;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style>
