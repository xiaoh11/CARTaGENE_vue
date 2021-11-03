<template>
<div class="child-component">
  <div :style="enclosingStyle">
    <svg ref="coordsSvg" style="height: 20px; display: block;" :width="givenWidth">
      <g ref="xAxisContainer"></g>
    </svg>
  </div>
</div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "BpCoordBar",
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
      type: Number
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
    }
  },
  computed: {
    enclosingStyle: function(){
      return(`max-height: ${this.height}px; display: block; overflow-y: hidden; overflow-x: hidden;`)
    },
  },
  methods: {
    format_position_ticks: function(value) {
      return d3.format('~s')(value) + "bp";
    },
    position_ticks: function() {
      let ticks = [];
      let drawingWidth = this.givenWidth - this.givenMargins.left - this.givenMargins.right;
      for (let px = 0; px < drawingWidth; px += 100) {
        ticks.push(Math.floor(this.x_scale.invert(px)))
      }
      return ticks
    },
    init: function () {
      this.svg = d3.select(this.$refs.coordsSvg)
      this.x_axis_g = d3.select(this.$refs.xAxisContainer)

      this.x_axis = d3.axisBottom();
      this.x_scale = d3.scaleLinear();
    },
    draw: function () {
      this.x_axis_g.attr("transform", `translate(${this.givenMargins.left}, 0)`);
      this.x_scale.range(this.segmentBounds).domain(this.segmentRegions);
      this.x_axis.scale(this.x_scale).tickValues(this.position_ticks()).tickFormat(this.format_position_ticks);
      this.x_axis_g.call(this.x_axis);
    }
  },
  beforeCreate() {
    // initialize non reactive data
    this.height = 20;
    this.svg = null;
    this.x_axis = null;
    this.x_axis_g = null;
    this.x_scale = null;
  },
  created: function() {
  },
  mounted: function() {
    this.init();
    if ((this.segmentRegions.every(d => d != null)) && (this.segmentBounds.every(d => d != null))) {
      this.draw();
    }
  },
  watch: {
    givenWidth: function() {
      this.draw();
    }
  }
}
</script>

<style scoped>
.child-component {
  position: relative;
  min-height: 20px;
  margin-top: 5px;
}
</style>

