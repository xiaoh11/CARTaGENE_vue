<template>
<div class="child-component">
  <button class="close-button" v-on:click="$emit('close')">
    <font-awesome-icon style="background-color:transparent;" :icon="closeIcon"></font-awesome-icon>
  </button>
  <div v-if="loading" class="d-flex align-items-center bravo-message">
    <div class="spinner-border spinner-border-sm text-primary ml-auto" role="status" aria-hidden="true"></div>
    <strong>&nbsp;Loading...</strong>
  </div>
  <div v-if="failed" class="bravo-message">Error while loading coverage data</div>
  <div v-if="loaded && (loaded_data_size == 0)" class="bravo-message">No coverage data for this region</div>
</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import * as d3 from "d3";

export default {
  name: "SeqDepth",
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
    hoveredVariant: {
      type: Object
    }
  },
  inject: {
    chrom: {default: '11'},
    start: {default: 200000},
    stop:  {default: 201000}
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
      loaded_data_size: 0,
      closeIcon: faTimes,
    }
  },
  methods: {
    load_cycle: function(url, size, next, chain) {
      axios
        .post(url, {
          size: size,
          next: next,
        })
        .then(response => {
          let payload = response.data;
          this.loaded_data_size += payload.data.length;
          let next_link = chain.then( () => {
            if (payload.data.length > 0) {
              // remove last element which is just a copy of preceding element
              this.coverage_stats.pop();

              this.coverage_stats.push(...payload.data); // ECMA6

              // add copy of the last window to mark an end
              this.coverage_stats.push(JSON.parse(JSON.stringify(payload.data[payload.data.length - 1])));
              this.coverage_stats[this.coverage_stats.length - 1].last = true;
              this.initializeCoverageSVG();
              this.draw();
            }
          });
          if (payload.next != null) {
            this.load_cycle(`${this.api}/coverage/${this.chrom}-${this.start}-${this.stop}`, size, payload.next, next_link);
          } else {
            this.loading = false;
            this.loaded = true;
          }
        })
        .catch(error => {
          console.log("Error loading depth:" + error)
          this.loaded = false;
          this.loading = false;
          this.failed = true;
        });
    },
    load: function() {
      this.failed = false;
      this.loaded = false;
      this.loading = true;
      this.coverage_stats = [];
      this.loaded_data_size = 0;
      this.load_cycle(`${this.api}/coverage/${this.chrom}-${this.start}-${this.stop}`, 10000, null, new Promise( resolve => resolve()));
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
          .attr("id", "depth-clip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0);
      this.drawing = this.svg.append("g");
      this.depth_g = this.drawing.append("g");
      this.y_axis_g = this.drawing.append("g")
        .style("font-size", "9px");
      this.drawing.append("text")
          .attr("transform", `translate(${-this.givenMargins.left + 11},${this.height/2}) rotate(-90)`)
          .style("font-size", "11px")
          .style("text-anchor", "middle")
          .text("Avg. Depth");
      this.x_scale = d3.scaleLinear();
      this.y_axis = d3.axisLeft();
      this.y_scale = d3.scaleLinear();
    },
    initializeCoverageSVG: function() {
      this.depth_g.selectAll("path")
        .data([this.coverage_stats])
        .enter()
        .append("path")
          .style("fill", this.color)
          .style("stroke-width", 0.1)
          .style("stroke", "black");
    },
    draw: function () {
      this.svg.attr("width", this.givenWidth).attr("height", this.height + this.givenMargins.top + this.givenMargins.bottom);
      this.drawing.attr("transform", `translate(${this.givenMargins.left}, ${this.givenMargins.top})`);
      this.drawing_clip
        .attr("width", this.givenWidth - this.givenMargins.left - this.givenMargins.right)
        .attr("height", this.height);
      this.x_scale.range(this.segmentBounds).domain(this.segmentRegions);
      this.y_scale.range([this.height, 0]).domain([0, d3.max(this.coverage_stats, function(d) { return d.mean; })]);
      this.y_axis.scale(this.y_scale).ticks(4).tickFormat(this.format_y_ticks);
      this.y_axis_g.call(this.y_axis);
      var area = d3.area()
        .x(  d  => { return d.last ? this.x_scale(d.end): this.x_scale(d.start); } )
        .y0( () => 0)
        .y1( () => 0)
        .y0( () => this.height )
        .y1( d  => this.y_scale(d.mean) )
        .curve(d3.curveStepAfter);
      this.drawing.selectAll("g>path:last-child")
        .attr("clip-path", "url(#depth-clip)")
        .attr("d", area);
    },
    highlight: function() {
      this.drawing.selectAll(".highlight_line").remove();
      if ((this.hoveredVariant.index != null) && (this.hoveredVariant.hovered)) {
        this.drawing.append("line")
          .attr("class", "highlight_line")
          .attr("x1", this.x_scale(this.hoveredVariant.data.pos))
          .attr("y1", 0)
          .attr("x2", this.x_scale(this.hoveredVariant.data.pos))
          .attr("y2", this.height)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round")
          .attr("stroke", "#e77f00");
      }
    }
  },
  beforeCreate() {
    // initialize non-reactive data
    this.height = 70;
    this.color = '#ffa37c';
    this.svg = null;
    this.drawing = null;
    this.drawing_g = null;
    this.x_scale = null;
    this.y_axis = null;
    this.y_scale = null;
    this.y_axis_g = null;
    this.coverage_stats = [];
  },
  mounted: function() {
    this.initializeSVG();
    if ((this.chrom != null) && (this.start != null) && (this.stop != null) &&
      (this.segmentRegions.every(d => d != null)) && (this.segmentBounds.every(d => d != null))) {
      this.load();
    }
  },
  load: function() {
    this.failed = false;
    this.loaded = false;
    this.loading = true;
    this.coverage_stats = [];
    this.loaded_data_size = 0;
    this.load_cycle(`${this.api}/coverage/${this.region.regionChrom}-${this.region.regionStart}-${this.region.regionStop}`,
      10000, null, new Promise( resolve => resolve()));
  },
  watch: {
    hoveredVariant: function() {
      if ((!this.loading) && (!this.failed) && (this.loaded_data_size > 0)) {
        this.highlight();
      }
    },
    givenWidth: function() {
      if ((!this.loading) && (!this.failed) && (this.loaded_data_size > 0)) {
        this.draw()
        this.highlight()
      }
    }
  }
}
</script>

<style scoped>
.child-component {
  position: relative;
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
