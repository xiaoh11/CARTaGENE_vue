<template>
  <div class="child-component">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1 class="display-5">{{region_title}}</h1>
          <ul class="list-unstyled">
            <li class="list-item">Region length: {{region_length.toLocaleString()}} bp</li>
            <li class="list-item">External resources: 
              <span><a v-bind:href="ext_url">UCSC Browser</a></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RegionInfo",
    inject: {
      chrom: {default: 0},
      start: {default: 0},
      stop: {default: 1}
    },
    computed: {
      region_length() { 
        return ((this.stop - this.start + 1).toLocaleString())
      },
      region_title() { 
        return (this.chrom + ':' + this.start.toLocaleString() + 
          '-' + this.stop.toLocaleString()) 
      },
      region_position() { 
        return (this.chrom + ':' + this.start + '-' + this.stop) 
      },
      ext_url() { 
        return ('https://genome.ucsc.edu/cgi-bin/hgTracks?db=GRCh38&position=' + 
          this.chrom + ':' + this.start + '-' + this.stop)
      }
    },
  }
</script>
