<template>
<div class="child-component">
  <button class="close-button" v-on:click="$emit('close')">
    <font-awesome-icon style="background-color: transparent;" :icon="closeIcon"></font-awesome-icon>
  </button>
  <div v-if="loading" class="d-flex align-items-center bravo-message">
    <div class="spinner-border spinner-border-sm text-primary ml-auto" role="status" aria-hidden="true"></div>
    <strong>&nbsp;Loading...</strong>
  </div>
  <div v-if="failed" class="bravo-message">Error while loading variants count</div>
  <div v-if="this.loaded && (this.variants >  0)" class="bravo-info-message">
    Displaying {{ this.variants.toLocaleString() }} variant(s)
  </div>
  <div v-if="this.loaded && (this.variants == 0)" class="bravo-info-message">
    No variants
  </div>
</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import * as d3 from "d3";

export default {
  name: "SnvDepth",
  inject: {
    chrom: {default: '11'},
    start: {default: 200000},
    stop:  {default: 201000}
  },
  props: {
    //formerly region.segments.plot
    segmentBounds: {
      type: Array,
      default: function(){return [0, 1000 ]}
    },
    //formerly region.segments.region
    segmentRegions: {
      type: Array,
      default: function(){return [100000, 101000]}
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
    gene_id: {
      type: String,
      default: null
    },
    filters: {
      type: Array,
      default: function(){return []}
    },
    includeIntrons: {
      type: Boolean,
      default: true
    },
    visibleVariants: {
      type: Object
    },
    hoveredVariant: {
      type: Object
    }
  },
  components: {
    FontAwesomeIcon,
  },
  data: function() {
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      loading: false,
      loaded: false,
      failed: false,
      variants: 0,
      closeIcon: faTimes
    }
  },
  methods: {
    load: function() {
      console.log('depth load')
      if ((this.chrom == null) || (this.start == null) || (this.stop == null)) {
        return;
      }

      let url = ""
      if (this.gene_id != null) {
        url = `${this.api}/variants/gene/snv/${this.gene_id}/histogram`;
      } else {
        url = `${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.stop}/histogram`;
      }
      console.log('url')

      this.clearDrawing();

      this.failed = false;
      this.loaded = false;
      this.loading = true;

      var timestamp = Date.now();
      this.timestamp = timestamp;
      axios
        .post(url, {
          filters: this.filters,
          introns: this.includeIntrons,
          windows: this.givenWidth - this.givenMargins.left - this.givenMargins.right
        })
        .then(response => {
          var payload = response.data;
          if (timestamp == this.timestamp) {
            this.histogram_window_size = payload.data["window-size"];
            this.histogram_data = payload.data.windows;
            this.variants = this.histogram_data.reduce((total, entry) => total + entry.count, 0);
            this.draw();
            this.drawHistogram();
            this.drawVariants();
          }
          this.loaded = true;
        })
        .catch(error => {
          console.log('Snv depth loading error: ' + error)
          this.loaded = false;
          this.failed = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    format_y_ticks: function(value) {
      return d3.format('d')(value) + "x";
    },
    initializeSVG: function () {
      this.svg = d3.select(this.$el)
        .append("svg")
          .style("display", "block")
          .attr("width", this.givenWidth)
          .attr("height", this.height + this.givenMargins.top + this.givenMargins.bottom);
      this.drawing_clip = this.svg
        .append("clipPath")
          .attr("id", "snv-clip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0);
      this.drawing = this.svg.append("g");

      this.histogram_g = this.drawing.append("g")
        .attr("clip-path", "url(#snv-clip)");
      this.variant_pointers_g = this.drawing.append("g");
      this.y_axis_g = this.drawing.append("g")
        .style("font-size", "9px");

      this.drawing.append("text")
        .attr("transform", `translate(${-this.givenMargins.left + 11},${(this.height - 10)/2}) rotate(-90)`)
        .style("font-size", "11px")
        .style("text-anchor", "middle")
        .text("Variants Count");

      this.x_scale = d3.scaleLinear();
      this.y_axis = d3.axisLeft();
      this.y_scale = d3.scaleLinear();
    },
    draw: function () {
      this.drawing.selectAll("text").attr("opacity", 1);
      this.svg.attr("width", this.givenWidth).attr("height", this.height + this.givenMargins.top + this.givenMargins.bottom);
      this.drawing.attr("transform", `translate(${this.givenMargins.left}, ${this.givenMargins.top})`);
      this.drawing_clip
        .attr("width", this.givenWidth - this.givenMargins.left - this.givenMargins.right)
        .attr("height", this.height);
      this.x_scale.range(this.segmentBounds).domain(this.segmentRegions);

      var max_count = d3.max(this.histogram_data, function(d) { return d.count; });
      this.y_scale.range([this.height - 10, 0]).domain([0, max_count]);
      this.y_axis.scale(this.y_scale).ticks(Math.min(max_count, 4)).tickFormat(d3.format(".0s"));
      this.y_axis_g.call(this.y_axis);
    },
    drawHistogram: function() {
      this.histogram_g.selectAll("rect").remove();
      this.histogram_g.selectAll("rect")
        .data(this.histogram_data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("width", d => this.x_scale(d.start + this.histogram_window_size) - this.x_scale(d.start))
        .attr("height", d => this.height - 10 - this.y_scale(d.count))
        .attr("transform", d => `translate(${this.x_scale(d.start)},${this.y_scale(d.count)})`)
        .attr("stroke-width", 1)
        .attr("stroke", "lightsteelblue")
        .attr("fill", "lightsteelblue");
    },
    drawVariants: function() {
      this.variant_pointers_g.selectAll("path").remove();
      if (this.visibleVariants.data != null) {
        this.variant_pointers_g.selectAll("path")
          .data(this.visibleVariants.data)
          .enter()
          .append("path")
          .attr("d", d3.symbol().size(40).type(d3.symbolTriangle))
          .attr("transform", d => `translate(${this.x_scale(d.pos)},${this.height - 4})`)
          .attr("stroke", "black")
          .attr("fill", "green")
          .attr("opacity", 0.2);
      }
    },
    clearDrawing: function() {
      this.y_axis_g.selectAll("*").remove();
      this.histogram_g.selectAll("rect").remove();
      this.variant_pointers_g.selectAll("path").remove();
      this.drawing.selectAll("text").attr("opacity", 0);
    }
  },
  beforeCreate: function() {
    // initialize non-reactive data
    this.timestamp = null;
    this.histogram_data = [];
    this.histogram_window_size = 0;
    this.height = 70;
    this.color = '#ffa37c';
    this.svg = null;
    this.drawing = null;
    this.histogram_g = null;
    this.variant_pointers_g = null;
    this.x_scale = null;
    this.y_axis = null;
    this.y_scale = null;
    this.y_axis_g = null;
  },
  created: function() {
  },
  mounted: function() {
    this.initializeSVG();
    this.load();
  },
  watch: {
    filters: function() {
      this.load();
    },
    visibleVariants: function() {
      this.drawVariants();
    }
  },
}
</script>

<style scoped>
.child-component {
  position: relative;
  /* border: 1px solid black; */
  min-height: 50px;
  margin-top: 5px;
}
.close-button {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 0px 4px 0px 4px;
  color: white;
  font-size: 12px;
  outline: none;
  background-color: #007bff;
  border: 1px solid #007bff;
  border-radius: 2px;
  box-shadow: none;
}
.close-button:hover {
  background-color: #0062cc;
  border-color: #0062cc;
}
.bravo-info-message {
  position: absolute;
  top: 0%;
  left: 50%;
  font-size: 11px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  background-color: white;
  opacity: 0.8;
}
.bravo-message {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  border: 1px solid gray;
  padding: 5px;
  background-color: white;
  opacity: 1.0;
  border-radius: 5%;
}
</style>
