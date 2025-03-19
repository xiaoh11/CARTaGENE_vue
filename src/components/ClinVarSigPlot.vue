<template>
  <div class="child-component">
    <button class="close-button" v-on:click="emit('close')">
      <font-awesome-icon :icon="faTimes"></font-awesome-icon>
    </button>
    <div class="d-none d-md-flex">
      <p class="bravo-info-message" style="text-align: center;">Displaying ClinVar significance for {{ numVaraintCag }}/{{ numVariantClinvar }} variants from CaG/ClinVar</p>
    </div>
    <div class="d-flex d-md-none">
      <p class="bravo-info-message" style="text-align: center;">{{ numVaraintCag }}/{{ numVariantClinvar }} variants from CaG/ClinVar</p>
    </div>
  
    <div :style="yAxisTitleStyle" :id="'y-axis-title-' + chartContainer">
          Pathogenicity
    </div>
    <div ref="chartContainer" style="margin-top: 20px; padding-top: 10px;" class="d-flex"></div>
    <div id="tooltip" class="tooltip"></div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted, watch, computed } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import axios from 'axios';
  axios.defaults.withCredentials=true
  import * as d3 from "d3";
  

  const emit = defineEmits(['close']);

  const errorMessage = ref('')
  const api = process.env.VUE_APP_BRAVO_API_URL
  const geneId = inject('geneId', '');
  const ensemblId = inject('ensemblId', '');
  const chrom = inject('chrom', '11');
  const start = inject('start', 200000);
  const stop = inject('stop', 201000);
  const data = ref([])
  const numVariantClinvar = ref(null)
  const numVaraintCag = ref(null)
  const props = defineProps({
    segmentBounds: {
      type: Array,
    },
    //formerly region.segments.region
    segmentRegions: {
      type: Array,
    },
    //formerly dimensions.width
    givenWidth: {
      type: Number,
      default: 300
    },
    //formerly dimensions.margin
    givenMargins: {
      type: Object,
      default: function(){
        return({
          left:   40,
          right:  15,
          top:    12,
          bottom: 5
        })
      }
    },
    hoveredVarPosition: {
      type: Number,
      default: null
    },
  });

  const pathogenicityScores = {
    "Pathogenic (P)": 2,
    "Likely pathogenic (LP)": 1,
    "Uncertain significance (VUS)": 0,  
    "Likely benign (LB)": -1,
    "Benign (B)": -2,
    "Conflicting (C)": -3,
    "Others (O)": -4,
  };

  const fetchData = async () => {
    errorMessage.value = '';
    try {
      // console.log(ensemblId.value)
      const response = await axios.get(`${api}/variants/gene/snv/clinVargraph/${ensemblId.value}`); 
      // should return an Array of Array: [variant_info, record.id, clnsig, is_in_mongo]
      // console.log(response.data)
      data.value = response.data
      .filter(item => item.length === 4)
      .map(item => {
        let significance = item[2].replace(/_/g, ' ');
        let clinScore;

        if (significance.startsWith("Conflicting")) {
          clinScore = pathogenicityScores["Conflicting (C)"];
        } else if (significance.startsWith("Benign")) {
          clinScore = pathogenicityScores["Benign (B)"];
        } else if (significance.startsWith("Pathogenic")) {
          clinScore = pathogenicityScores["Pathogenic (P)"];
        } else if (significance.startsWith("Likely pathogenic")) {
          clinScore = pathogenicityScores["Likely pathogenic (LP)"];
        } else if (significance.startsWith("Likely benign")) {
          clinScore = pathogenicityScores["Likely benign (LB)"];
        } else if (significance.startsWith("Uncertain significance")) {
          clinScore = pathogenicityScores["Uncertain significance (VUS)"];
        } else {
          clinScore = pathogenicityScores["Others (O)"];  
        }

        return {
          variantId: item[0],
          recordId: item[1],
          position: parseInt(item[0].split('-')[1], 10),
          clinicalSignificance: significance,
          clinScore: clinScore,  
          isInMongo: item[3] === 1
        };
      });
      
      data.value = data.value.filter(d => 
        d.position >= props.segmentRegions[0] && d.position <= props.segmentRegions[1]
      );
      // console.log(data)
      numVariantClinvar.value = data.value.length;
      numVaraintCag.value = data.value.filter(d => d.isInMongo === true).length;
      // console.log(numVariantClinvar.value, numVaraintCag.value) 

    } catch (error) {
      console.error("There was an error fetching the sample data:", error);
      errorMessage.value = "Failed to load data. Please try again later.";
    }
  };

  

  // Lollipop plot by d3
  const colorScale = d3.scaleOrdinal()
  .domain([2, 1, 0, -1, -2, -3, -4])
  .range(["#d73027", "#fc8d59", "#fee08b", "#91cf60", "#1a9850", "#7570b3", "#cccccc"]); 

  const chartContainer = ref(null);
  const highlightLine = ref(null);

  const x = ref(null)
  const svg = ref(null)
  const yScale = ref(null)
  // let svg, yScale;

  // initialize the chart
  const initializeChart = () => {
    if (svg.value) return;
    const container = chartContainer.value;
    const height = 200;

    svg.value = d3.select(container)
      .append("svg")
      .attr("width", props.givenWidth)
      .attr("height", height + props.givenMargins.top + props.givenMargins.bottom + 100)
      .append("g")
      .attr("transform", `translate(${props.givenMargins.left}, ${props.givenMargins.top + 85})`);
    x.value = d3.scaleLinear()
      .range(props.segmentBounds)
      .domain(props.segmentRegions);
    // x = d3.scaleLinear()
    //   .domain(props.segmentRegions)
    //   .range([0, props.givenWidth - props.givenMargins.left - props.givenMargins.right]);

    yScale.value = d3.scaleLinear()
      .domain([2, -4])  
      .range([0, height]);
    svg.value.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);
    svg.value.append("g")
      .attr("class", "y-axis");
    
    // Add a vertical line at props.hoveredVarPosition
    highlightLine.value = svg.value.append("line")
      .attr("class", "highlight-line")
      .attr("y1", yScale.value.range()[0]) 
      .attr("y2", yScale.value.range()[1]) 
      .attr("stroke",  "#e77f00")
      .attr("stroke-width", 2)
      .attr("visibility", "hidden")
  }

  const updateChart = () => {
    if (!svg.value) return;
    d3.select(chartContainer.value).select("svg").attr("width", props.givenWidth);
    
    x.value = d3.scaleLinear()
      .range(props.segmentBounds) 
      .domain(props.segmentRegions);

    // svg.select(".x-axis")
    //   .transition()
    //   .duration(500)
    //   .call(d3.axisBottom(x).tickFormat(d3.format(".0f")).ticks(5));

    svg.value.select(".y-axis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale.value).ticks(7))
      .selectAll("text")
      .remove();
    
    const yAxisLabel = ["P", "LP", "VUS", "LB", "B", "C", "O"];

    const yLabel = svg.value.selectAll(".y-axis-label")
      .data(yAxisLabel)
      .enter() // D3 binding 
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -15)  
      .attr("y", (d, i) => i * yScale.value.range()[1]/6 + 3)  
      .attr("text-anchor", "middle") 
      .attr("font-size", "9px")  
      .text(d => d);  


    const lines = svg.value.selectAll(".lollipop-line")
      .data(data.value, d => d.position);
    
    lines.join(
      enter => enter.append("line")
        .attr("class", "lollipop-line")
        .attr("x1", d => x.value(d.position))
        .attr("x2", d => x.value(d.position))
        .attr("y1", yScale.value(0))  // 0 axis：Uncertain significance
        .attr("y2", d => yScale.value(d.clinScore))
        .attr("stroke", "gray")
        .attr("stroke-width", 1),
      update => update.transition().duration(100)
        .attr("x1", d => x.value(d.position))
        .attr("x2", d => x.value(d.position))
        .attr("y1", yScale.value(0))
        .attr("y2", d => yScale.value(d.clinScore)),
      exit => exit.remove()
    ); 
    // Add a horizontal line at y = 0
    svg.value.append("line")
      .attr("class", "zero-line") 
      .attr("x1", x.value.range()[0])  
      .attr("x2", x.value.range()[1])     
      .attr("y1", yScale.value(0)) 
      .attr("y2", yScale.value(0)) 
      .attr("stroke", "gray")
      .attr("stroke-width", .5)
      .attr("stroke-dasharray", "4 4");


    const circles = svg.value.selectAll(".lollipop-circle")
      .data(data.value, d => d.position);
    
    const tooltip = d3.select("#tooltip");
    
    circles.join(
      enter => enter.append("circle")
        .attr("class", "lollipop-circle")
        .attr("cx", d => x.value(d.position))
        .attr("cy", d => yScale.value(d.clinScore))  
        .attr("r", d => d.isInMongo ? 10 :4)
        .attr("fill", d => colorScale(d.clinScore))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", (event, d) => {
          const svgRect = d3.select(chartContainer.value).node().getBoundingClientRect();
          tooltip
            .style("opacity", 1)
            .html(`Position : ${d.position}<br>Pathogenicity : ${d.clinicalSignificance}<br>Is in database? : ${d.isInMongo}`)
            // .style("left", (event.pageX - 50) + "px")
            // .style("top", (event.pageY - 1200) + "px");
            .style("left", (event.clientX - svgRect.left + 10) + "px")
            .style("top", (event.clientY - svgRect.top - 20) + "px");
        })
        .on("mousemove", (event) => {
          const svgRect = d3.select(chartContainer.value).node().getBoundingClientRect();
          tooltip
            // .style("left", (event.pageX - 50) + "px")
            // .style("top", (event.pageY - 1200) + "px");
            .style("left", (event.clientX - svgRect.left + 10) + "px")
            .style("top", (event.clientY - svgRect.top - 20) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        }),
      update => update.transition().duration(100)
        .attr("cx", d => x.value(d.position))
        .attr("cy", d => yScale.value(d.clinScore)),
      exit => exit.remove()
    );
    // addLegend();
  };

  const addLegend = () => {
    if (!svg.value) return;

    const legendWidth = 500;  
    const legendHeight = 20;  
    const categories = colorScale.domain();  
    const pathogenicityCategories = Object.keys(pathogenicityScores).sort((a, b) => pathogenicityScores[b] - pathogenicityScores[a]);
    const numCategories = categories.length;
    const boxWidth = legendWidth / numCategories; 
    const legendCircle = {
      "CaG": 10,
      "ClinVar": 4
    }

    svg.value.select(".legend").remove();

    const legend = svg.value.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${props.givenWidth / 2.5 - legendWidth / 2}, -65)`); 

    legend.selectAll("rect")
      .data(categories)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * boxWidth)
      .attr("y", 0)
      .attr("width", boxWidth)
      .attr("height", legendHeight)
      .attr("fill", d => colorScale(d))
      .attr("stroke", "black");
    
    legend.selectAll("text")
      .data(pathogenicityCategories)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * boxWidth + boxWidth / 2) 
      .attr("y", (d, i) => (i % 2 === 0) ? legendHeight + 15 : legendHeight - 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d);
    
    const defs = svg.value.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "multi-color-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    const colors = ["#d73027", "#fc8d59", "#fee08b", "#91cf60", "#1a9850", "#7570b3", "#cccccc"];
    const numColors = colors.length;
    colors.forEach((color, index) => {
      gradient.append("stop")
        .attr("offset", `${(index / (numColors - 1)) * 100}%`)
        .attr("stop-color", color);
    });

    legend.selectAll("circle")
      .data(Object.keys(legendCircle))
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * boxWidth * 1.5 + legendWidth * 1.1)
      .attr("cy", legendHeight - 10)
      .attr("r", d => legendCircle[d])
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    legend.append("text")
      .attr("x", legendWidth * 1.1 + legendCircle["CaG"] + 5)
      .attr("y", legendHeight - 6)
      .attr("font-size", "12px")
      .text("CaG in ClinVar");
    legend.append("text")
      .attr("x", boxWidth * 1.5 + legendWidth * 1.1 + legendCircle["ClinVar"] + 5)
      .attr("y", legendHeight - 6)
      .attr("font-size", "12px")
      .text("ClinVar only");
    // legend.append("text")
    //   .attr("x", legendWidth / 1.2)
    //   .attr("y", -20)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "14px")
    //   .attr("font-weight", "bold")
    //   .text("Clinical Significance");
  };

  const yAxisTitleStyle = computed(() => {
    const leftPosition = props.givenMargins.left ;
    return {
      position: 'absolute',
      left: `${leftPosition}px`,
      top: '54%',
      transform: 'translate(-100%, -50%) rotate(-90deg)',
      whiteSpace: 'nowrap',
      'font-size': '11px',
      'text-align': 'center',
      'transform-origin': 'center',
    }
  })




  onMounted(async () => {
      await fetchData();
      initializeChart();
      updateChart();
      if (props.givenWidth < 600) {
        if (svg.value) {
          svg.value.select(".legend").remove();
        }
      } else {
        if (svg.value) {
          addLegend()
        }
      }

  });

  watch(
    data,  
    (newData) => {
      // console.log("Data changed, updating chart...");
      updateChart();
    },
    { deep: true } 
  );
  watch( () => props.givenWidth, (newValue) => {
    // console.log(newValue)
    updateChart();
    if (newValue < 600) {
      if (svg.value) {
        svg.value.select(".legend").remove();
      }
    } else {
      if (svg.value) {
        addLegend()
      }
    }
  });
  watch(() => props.segmentRegions, (newValue) => {
    // console.log(newValue)
    x.value.domain(newValue);
    updateChart();
  });
  watch(() => props.segmentBounds, (newValue) => {
    // console.log(newValue)
    x.value.range(newValue);
    updateChart();
  });
  watch(() => props.hoveredVarPosition, (newVal) => {
    if (!highlightLine.value) return;

    if (newVal == null) {
      highlightLine.value.style("visibility", "hidden");
    } else {
      highlightLine.value
        .attr("x1", x.value(newVal))
        .attr("x2", x.value(newVal))
        .style("visibility", "visible");
    }
  });
  

</script>

<style>
.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  pointer-events: none; 
  opacity: 0; 
}
</style>


