<template>
  <div class="container">
    <h2>Database Data</h2>

    <!-- Fetch Data Button -->
    <button @click="fetchData" :disabled="loading">
      {{ loading ? "Loading..." : "Fetch Data" }}
    </button>

    <!-- Add Data Input & Button -->
    <div class="input-group">
      <input v-model="newId" type="number" placeholder="Enter ID" />
      <input v-model="newName" type="text" placeholder="Enter Name" />
      <button @click="submitData" :disabled="loading || !newName || !newId">
        {{ loading ? "Adding..." : "Add Data" }}
      </button>
    </div>

    <!-- Show Error Message -->
    <p v-if="error" class="error-message">Error: {{ error }}</p>

    <!-- Show Data -->
    <ul v-if="database_data.length">
      <li v-for="item in database_data" :key="item.id">
        <strong>ID:</strong> {{ item.id }} - <strong>Name:</strong> {{ item.name }}
      </li>
    </ul>

    <!-- Show message when no data -->
    <p v-if="!database_data.length && !loading">No data available.</p>
  </div>
</template>

<script>
import { getData, addData } from "@/services/api"; // ✅ Use named imports

export default {
  data() {
    return {
      database_data: [], // Holds API response
      newId: "", // Holds input ID
      newName: "", // Holds input Name
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await getData(); // ✅ Call API function
        this.database_data = response.database_data; // Store response data
      } catch (err) {
        this.error = "Failed to fetch data. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    async submitData() {
      if (!this.newId || !this.newName.trim()) return; // Prevent empty submissions
      this.loading = true;
      this.error = null;

      try {
        await addData(this.newId, this.newName); // ✅ Send both ID and Name
        this.newId = ""; // Clear input
        this.newName = "";
        this.fetchData(); // Refresh data after adding
      } catch (err) {
        this.error = "Failed to add data. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin: 5px;
  transition: 0.3s;
}

button:hover {
  background: #0056b3;
}

input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-group {
  margin-top: 15px;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>
