<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="SPF Society Logo" class="logo" />
        <h1 class="site-title">SPF Society</h1>
      </div>
      <ul>
        <li><router-link to="/" class="nav-link">Home</router-link></li>
        <li><router-link to="/recommendations" class="nav-link">Sun Safety Tips</router-link></li>
        <li><router-link to="/reminders" class="nav-link">Sunscreen Alerts</router-link></li>
        <li><router-link to="/plan" class="nav-link">UV Travel Guide</router-link></li>
        <li><router-link to="/about" class="nav-link">About Us</router-link></li>
      </ul>
    </nav>

    <main class="main-content">
      <router-view></router-view> <!-- ✅ Ensures content renders correctly -->
    </main>
  </div>
</template>

<style scoped>
html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  
  height: 100vh;
  background-color: black; /* Ensures full coverage */
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
}

.main-content {
  flex-grow: 1;
  margin: 0;
}

/* Navbar Styles */
.navbar {
  width: 100%;
  background: rgba(33, 32, 32, 0.3); /* ✅ More transparency */
  backdrop-filter: blur(10px); /* ✅ Slight blur for a sleek effect */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.logo-container {
  display: flex;
  margin-left: 70px;
  align-items: center;
  gap: 12px; /* Space between logo and title */
  min-width: 180px; /* ✅ Ensures the logo section doesn’t shrink */
}

.logo {
  width: 45px;
}

.site-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0;
}

/* Navigation Styles */
.navbar ul {
  list-style: none;
  display: flex;
  align-items: center; /* ✅ Center nav items properly */
  gap: 100px;
  margin: 0;
  
  padding: 0;
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: white;
  position: relative;
  transition: color 0.3s;
}

/* Underline Animation */
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

/* Ensure Main Content Takes Up Space */
.main-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
