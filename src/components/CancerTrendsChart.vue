<template>
  <div class="chart-container">
    <h3>Cancer Trends Over Time</h3>

    <div class="chart-wrapper">
      <canvas ref="cancerChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  data() {
    return {
      chartInstance: null,
      cancerData: [],
    };
  },
  async mounted() {
    await this.fetchData();
    this.$nextTick(() => {
      this.createChart();
    });
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch("https://onboardingbackend.onrender.com/cancer-data");
        const data = await response.json();
        this.cancerData = data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    createChart() {
      const canvas = this.$refs.cancerChart;
      if (!canvas) {
        console.error("Canvas element not found.");
        return;
      }

      const ctx = canvas.getContext("2d");

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Process Data (Fixed to Display One Static Cancer Type)
      const filteredData = this.cancerData.filter(
        (item) => item["Cancer group/site"] === "Melanoma of the skin"
      );

      const groupedData = {};
      filteredData.forEach((entry) => {
        const year = Number(entry["Year"]);
        const count = Number(entry["Count"]);

        if (!groupedData[year]) {
          groupedData[year] = { incidence: 0, mortality: 0 };
        }

        if (entry["Data type"] === "Incidence") {
          groupedData[year].incidence += count;
        } else if (entry["Data type"] === "Mortality") {
          groupedData[year].mortality += count;
        }
      });

      const years = Object.keys(groupedData).map(Number).sort((a, b) => a - b);
      const incidenceData = years.map((year) => groupedData[year].incidence);
      const mortalityData = years.map((year) => groupedData[year].mortality);

      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            { label: "Incidence", data: incidenceData, borderColor: "blue", borderWidth: 2, fill: false },
            { label: "Mortality", data: mortalityData, borderColor: "red", borderWidth: 2, fill: false },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true } },
          scales: {
            x: { title: { display: true, text: "Year" } },
            y: { title: { display: true, text: "Number of Cases" }, beginAtZero: true },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}
.chart-wrapper {
  width: 100%;
  max-width: 700px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
