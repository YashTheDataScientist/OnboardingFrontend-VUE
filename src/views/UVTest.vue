<template>
    <div class="test-container">
      <h2>Test UV Index Fetch (Using Location API)</h2>
  
      <!-- Search Box -->
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Enter Suburb or Postcode" />
        <button @click="fetchLocation">Get UV Index</button>
      </div>
  
      <!-- Display Results -->
      <div v-if="locationData">
        <p><strong>Location:</strong> {{ searchQuery }}</p>
        <p><strong>Latitude:</strong> {{ locationData.lat }}</p>
        <p><strong>Longitude:</strong> {{ locationData.lon }}</p>
        <p><strong>UV Index:</strong> {{ uvIndex !== null ? uvIndex : "Fetching..." }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "",
        locationData: null,
        uvIndex: null
      };
    },
    methods: {
      async fetchLocation() {
        if (!this.searchQuery) {
          alert("Please enter a suburb or postcode!");
          return;
        }
  
        // Determine request payload (suburb or postcode)
        const isNumber = /^\d+$/.test(this.searchQuery);
        const requestBody = isNumber ? { postcode: Number(this.searchQuery) } : { locality: this.searchQuery };
  
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
  
          // Store location data
          this.locationData = {
            lat: locationResult.lat,
            lon: locationResult.long
          };
  
          // Fetch UV Index using the retrieved coordinates
          this.fetchUVIndex(locationResult.lat, locationResult.long);
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("Error fetching location data. Please try again.");
        }
      },
  
      async fetchUVIndex(lat, lon) {
        try {
          const uvUrl = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;
          const uvResponse = await fetch(uvUrl);
          const uvResult = await uvResponse.json();
  
          this.uvIndex = uvResult.now && uvResult.now.uvi !== undefined ? Math.round(uvResult.now.uvi) : "Unavailable";
        } catch (error) {
          console.error("Error fetching UV index:", error);
          this.uvIndex = "Error fetching data";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .test-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .search-box {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .search-box input {
    padding: 10px;
    width: 70%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .search-box button {
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .search-box button:hover {
    background: #0056b3;
  }
  
  p {
    font-size: 16px;
    margin: 8px 0;
  }
  </style>
  