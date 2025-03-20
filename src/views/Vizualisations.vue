<template>
  <div class="dashboard-container">
    
    <div class="vizHead">
      <h1>Beyond the Sun: Investigating Cancer Risks and UV Trends</h1>
    </div>
    <div class="chart-row">
      <div class="chart">
        
        <div class="tableau-embed" id="tableauMap"></div>
      </div>
      <div class="description">
        <h2>Cancer Cases Across Regions in Australia</h2>
        <p>
          This visualization represents the distribution of cancer cases across different regions in Australia.
          The size of the circles represents the number of cases, while colors indicate different cancer types.
          Users can filter case outcomes (Incidence, Mortality) to explore trends.
        </p>
      </div>
    </div>

    <!-- Cancer Trends Over the Years -->
    <div class="chart-row">
      <div class="chart">
        
        <div class="tableau-embed" id="tableauTrend"></div>
      </div>
      <div class="description">
        <h2>Cancer Trends Over the Years by Sex</h2>
        <p>
          This line chart illustrates the increase in cancer cases over the years, split by sex. It helps
          in identifying trends and disparities between males and females, enabling better insights into
          cancer prevalence over time.
        </p>
      </div>
    </div>

    <!-- UV Index Trends -->
    <div class="chart-row">
      <div class="chart">
        
        <div class="tableau-embed" id="tableauUV"></div>
      </div>
      <div class="description">
        <h2>How UV Levels Change Throughout the Day & Year</h2>
        <p>
          This heatmap shows the average UV index across different hours of the day and months of the year.
          Higher UV levels indicate greater sun exposure risks, helping users understand peak UV hours for
          better sun safety practices.
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  mounted() {
    this.loadTableau();
  },
  methods: {
    loadTableau() {
      if (!window.tableau) {
        const script = document.createElement("script");
        script.src = "https://public.tableau.com/javascripts/api/tableau-2.8.0.min.js";
        script.onload = () => this.initializeViz();
        document.head.appendChild(script);
      } else {
        this.initializeViz();
      }
    },
    initializeViz() {
      const options = {
        width: "100%",
        height: "500px",
      };

      new tableau.Viz(document.getElementById("tableauMap"), 
        "https://public.tableau.com/views/MapViz_17424638212680/Sheet1", options);

      new tableau.Viz(document.getElementById("tableauTrend"), 
        "https://public.tableau.com/views/MapViz_17424638212680/Sheet2", options);

      new tableau.Viz(document.getElementById("tableauUV"), 
        "https://public.tableau.com/views/MapViz_17424638212680/Sheet3", options);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background-color: #121212; /* Dark theme */
  color: #ffffff; /* Ensure text is visible */
}
.vizHead{
font-size: 30px;
justify-content: center;
}

.tableau-embed {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  background: #ffffff; /* Ensure it has a background */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.chart-row {
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 20px;
  align-items: center;
  padding: 10px;
}

.chart {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.description {
  
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
}

.description:hover {
  transform: scale(1.02);
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffffff;
}

p {
  font-size: 22px;
  color: #ffffff;
  line-height: 1.6;
}

</style>
