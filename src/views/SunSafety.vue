<template>
    <div class="container" :style="backgroundStyle">
      <div class="overlay"></div>
      <div class="main-content">
        <!-- Left Section (UV Index & Forecast) -->
        <div class="left-section">
          <div class="uv-card">
            <div class="search-box">
              <input type="text" v-model="location" placeholder="Enter Suburb/Postcode" />
              <button @click="fetchLocation">GO</button>
            </div>
            <p class="location-text">{{ city }}</p>
            <p class="date">{{ currentDate }}</p>
            <h1 class="uv-index-big">{{ displayUVIndex }}</h1>
            <p class="uv-risk">{{ uvRiskLevel }}</p>
            <div class="uv-forecast-container">
              <div class="uv-forecast">
                <div v-for="(hour, index) in hourlyUV" :key="index" class="hour-box">
                  <p class="forecast-time">{{ hour.time }}</p>
                  <p class="forecast-uv" :style="{ color: getUVColor(hour.uv) }">{{ hour.uv }}</p>
                </div>
              </div>
            </div>
            <!-- Skin Tone Selection & Recommendations Button -->
            <div class="recommendation-input">
              <label for="skinTone">Select your skin tone:</label>
              <select v-model="skinTone" id="skinTone">
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="dark">Dark</option>
              </select>
              <button @click="getRecommendations">💡 Get Recommendations</button>
            </div>
          </div>
        </div>
        
        <!-- Right Section (UV Safety Recommendations Card) -->
        <div class="right-section">
          <div class="recommendation-card">
            <h2> UV Safety Zone</h2>
            <div v-if="recommendations">
              <h3> Sun Protection Advice</h3>
              <p><strong>Sunscreen:</strong> {{ recommendations.sunscreen }} teaspoons</p>
              <p><strong>Clothing:</strong> {{ recommendations.clothing }}</p>
            </div>
            <p class="source">🔗 Data from OpenWeather & WHO guidelines</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        location: "Clayton",
        city: "Clayton, Australia",
        lat: -37.9152,
        lon: 145.1300,
        uvIndex: null,
        uvRiskLevel: "Loading...",
        hourlyUV: [],
        skinTone: "light",
        recommendations: null
      };
    },
    computed: {
      currentDate() {
        return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      },
      displayUVIndex() {
        return this.uvIndex !== null ? this.uvIndex : "--";
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
          this.lat = locationResult.lat;
          this.lon = locationResult.long;
          this.city = this.location.charAt(0).toUpperCase() + this.location.slice(1);
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
          this.uvIndex = data.now?.uvi !== undefined ? Math.round(data.now.uvi) : 0;
          this.uvRiskLevel = this.getRiskLevel(this.uvIndex);
          this.hourlyUV = (data.forecast || []).slice(0, 12).map(hour => ({
            time: new Date(hour.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            uv: Math.round(hour.uvi)
          }));
        } catch (error) {
          console.error("Error fetching UV data:", error);
          this.uvIndex = 0;
        }
      },
      getRecommendations() {
        const sunscreenAmounts = {
          light: { low: 0.5, moderate: 1, high: 1.5, extreme: 2 },
          medium: { low: 0.4, moderate: 0.8, high: 1.2, extreme: 1.8 },
          dark: { low: 0.3, moderate: 0.6, high: 1, extreme: 1.5 }
        };
        
        let riskLevel = "low";
        if (this.uvIndex > 2 && this.uvIndex <= 5) riskLevel = "moderate";
        else if (this.uvIndex > 5 && this.uvIndex <= 7) riskLevel = "high";
        else if (this.uvIndex > 7) riskLevel = "extreme";
        
        const clothingRecommendations = {
          low: "Regular clothing, sunglasses.",
          moderate: "Long sleeves, hat, sunglasses.",
          high: "UV-protective clothing, avoid direct sun.",
          extreme: "Stay indoors, use full coverage." 
        };
        
        this.recommendations = {
          sunscreen: sunscreenAmounts[this.skinTone][riskLevel] || "0",
          clothing: clothingRecommendations[riskLevel]
        };
      },
      getRiskLevel(uv) {
        if (uv <= 2) return "Low UV Risk";
        if (uv <= 5) return "Moderate UV Risk";
        if (uv <= 7) return "High UV Risk";
        if (uv <= 10) return "Very High UV Risk";
        return "Extreme UV Risk";
      },
      getUVColor(uv) {
        if (uv <= 2) return "blue";
        if (uv <= 5) return "yellow";
        if (uv <= 7) return "orange";
        return "red";
      }
    },
    mounted() {
      this.fetchUVData();
    }
  };
  </script>
  
  
  <style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('/images/sunbg.jpg') no-repeat center center/cover;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  .main-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 2;
    gap: 20px;
  }
  .uv-card,{
    background: rgba(0, 0, 0, 0.15);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    color: white;
    flex: 1;
    text-align: center;
  }
  .recommendation-input {
    background: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .recommendation-input label, .recommendation-input select, .recommendation-input button {
    font-size: 16px;
    padding: 10px;
  }
  .recommendation-text {
    font-size: 14px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.2);
    padding: 8px;
    border-radius: 5px;
    margin-top: 5px;
  }
  .source {
    font-size: 9px;
    opacity: 0.5;
    text-align: center;
  }
  </style>