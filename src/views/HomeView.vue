<template>
  <div class="container" :style="backgroundStyle">
    <div class="main-content">
      <!-- Left Section -->
      <div class="left-section">
        <div class="uv-card">
          <!-- Search Box -->
          <div class="search-box">
            <input type="text" v-model="location" placeholder="Enter Suburb/Postcode" />
            <button @click="fetchLocation">GO</button>
          </div>
          <p class="location-text">{{ city }}</p>

          <!-- Date -->
          <p class="date">{{ currentDate }}</p>

          <!-- BIG UV Index Number -->
          <h1 class="uv-index-big">{{ displayUVIndex }}</h1>
          <p class="uv-risk">{{ uvRiskLevel }}</p>

          <!-- Full-Day UV Forecast -->
          <div class="uv-forecast-container">
            <div class="uv-forecast">
              <div v-for="(hour, index) in hourlyUV" :key="index" class="hour-box">
                <p class="forecast-time">{{ hour.time }}</p>
                <p class="forecast-uv" :style="{ color: uvColor(hour.uv) }">{{ hour.uv }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <p>Learn more about how UV exposure affects your skin and health.</p>
        <button class="explore-btn" @click="scrollToVisualizations">Explore Visualizations</button>
      </div>
    </div>
  </div>

  <!-- Visualizations Section -->
  <div id="visualizations-section">
    <Visualizations />
  </div>
</template>

<script>
import Visualizations from "@/views/Vizualisations.vue"; // Ensure correct path

export default {
  components: {
    Visualizations
  },
  data() {
    return {
      location: "",
      city: "Loading...",
      lat: null,
      lon: null,
      uvIndex: null,
      uvRiskLevel: "Loading...",
      hourlyUV: [],
      defaultLocation: { lat: -37.9152, lon: 145.1300, city: "Clayton, Australia" }
    };
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    },
    displayUVIndex() {
      return this.uvIndex !== null ? this.uvIndex : "--";
    },
    backgroundStyle() {
      let bgImage = "/images/sunny-sky.jpg";
      if (this.uvIndex !== null) {
        if (this.uvIndex === 0) bgImage = "/images/night.jpg";
        else if (this.uvIndex <= 5) bgImage = "/images/sunset-sky.jpg";
        else if (this.uvIndex <= 7) bgImage = "/images/sunny-sky.jpg";
        else bgImage = "/images/extreme-sunny.jpg";
      }
      return {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      };
    }
  },
  methods: {
    async fetchLocation() {
      if (!this.location) {
        alert("Please enter a suburb or postcode!");
        return;
      }

      const isNumber = /^\d+$/.test(this.location);
      const requestBody = isNumber ? { postcode: Number(this.location) } : { locality: this.location };

      try {
        // Fetch latitude & longitude from backend API
        const locationResponse = await fetch("https://eqysflxgv2.execute-api.ap-southeast-2.amazonaws.com/prod/get-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const locationResult = await locationResponse.json();

        if (!locationResult.lat || !locationResult.long) {
          alert("Invalid location. Please try again.");
          return;
        }

        // Update location data
        this.lat = locationResult.lat;
        this.lon = locationResult.long;
        this.city = this.location.charAt(0).toUpperCase() + this.location.slice(1); // Capitalize first letter

        // Fetch UV Index using updated coordinates
        this.fetchUVData();
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Error fetching location data. Please try again.");
      }
    },

    async fetchUVData() {
      let url = `https://currentuvindex.com/api/v1/uvi?latitude=${this.lat}&longitude=${this.lon}`;

      try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.now && data.now.uvi !== undefined) {
          this.uvIndex = Math.round(data.now.uvi);
        } else {
          this.uvIndex = 1;
        }

        this.uvRiskLevel = this.getRiskLevel(this.uvIndex);
        this.hourlyUV = (data.forecast || []).slice(0, 12).map(hour => ({
          time: new Date(hour.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          uv: Math.round(hour.uvi)
        }));
      } catch (error) {
        console.error("Error fetching UV data:", error);
        this.uvIndex = 1;
      }
    },

    getRiskLevel(uv) {
      if (uv <= 2) return "Low UV Risk";
      if (uv <= 5) return "Moderate UV Risk";
      if (uv <= 7) return "High UV Risk";
      if (uv <= 10) return "Very High UV Risk";
      return "Extreme UV Risk";
    },

    uvColor(uv) {
      if (uv <= 2) return "blue";
      if (uv <= 5) return "yellow";
      if (uv <= 7) return "orange";
      return "red";
    },

    scrollToVisualizations() {
      const section = document.getElementById("visualizations-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Got user location, fetch UV data
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            this.city = "Current Location: Clayton, VIC";
            this.fetchUVData();
          },
          () => {
            // Permission denied, use default (Clayton)
            console.warn("Geolocation denied. Using default location.");
            this.lat = this.defaultLocation.lat;
            this.lon = this.defaultLocation.lon;
            this.city = this.defaultLocation.city;
            this.fetchUVData();
          }
        );
      } else {
        // Geolocation not supported, use default
        console.warn("Geolocation not supported. Using default location.");
        this.lat = this.defaultLocation.lat;
        this.lon = this.defaultLocation.lon;
        this.city = this.defaultLocation.city;
        this.fetchUVData();
      }
    }
  },
  mounted() {
    this.getLocation(); // Ask for location on page load
  }
};
</script>


<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

/* ✅ Reset Default Styles */
* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ✅ Ensure Full Width & Height */
html, body {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background: #000; /* Set a background color to check for white padding */
}

/* ✅ Main Container */
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

/* ✅ Main Content Layout */
.main-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

/* ✅ Left Section */
.left-section {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
}

/* ✅ UV Index Card */
.uv-card {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/* ✅ Search Box */
.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.search-box input {
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  width: 60%;
}

.search-box button {
  padding: 12px 18px;
  border: none;
  background: white;
  color: black;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

/* ✅ BIG UV INDEX */
.uv-index-big {
  font-size: 120px;
  font-weight: 600;
  margin: 0;
}

/* ✅ UV Risk Label */
.uv-risk {
  font-size: 20px;
  margin-bottom: 50px;
}

/* ✅ UV Forecast Container */
.uv-forecast-container {
  width: 100%;
  max-width: 90%;
  margin: auto;
  overflow: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 10px;
}

/* ✅ Scrollable Forecast */
.uv-forecast {
  display: flex;
  gap: 25px;
  padding: 15px 0;
  width: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;
  white-space: nowrap;
  text-align: center;
  scrollbar-width: none;
}

/* ✅ Hide scrollbar for Webkit browsers */
.uv-forecast::-webkit-scrollbar {
  display: none;
}

/* ✅ Forecast Time & UV Index */
.hour-box {
  flex: 0 0 auto;
  min-width: 80px;
  text-align: center;
}

.forecast-time {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.forecast-uv {
  font-size: 18px;
  font-weight: bold;
}

/* ✅ Right Section */
.right-section {
  width: 55%;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 10px;
  height: 500px;
  text-align: center;
  color: white;
  font-size: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

/* ✅ Explore Button */
.explore-btn {
  background: white;
  color: black;
  padding: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 60px;
}

/* ✅ RESPONSIVENESS */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .left-section,
  .right-section {
    width: 100%;
    max-width: 95%;
  }

  .right-section {
    margin-top: 20px;
  }

  .uv-forecast {
    justify-content: center;
    padding-bottom: 10px;
  }
  /* Add space above visualizations so scrolling looks natural */
#visualizations-section {
  padding-top: 50px;
}
}

</style>
