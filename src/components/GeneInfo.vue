<template>
  <div class="child-component">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div v-if="computedRegion.gene != null">
            <h1 class="display-5"><i>{{gene_name}}</i></h1>
            <h6>{{full_gene_name}}</h6>
            <ul class="list-unstyled">
              <li class="list-item">
                Ensembl ID: <a v-bind:href="'http://www.ensembl.org/Homo_sapiens/geneview?gene=' + gene_id">{{gene_id}}</a>
              </li>
              <li class="list-item">
                Gene type: <span style="color:#85144b;">{{computedRegion.gene.gene_type}}</span>
              </li>
              <li class="list-item">
                Region: <a v-on:click="$emit('goto_region', chrom, start, stop)" href="#">{{chrom}}:{{start.toLocaleString()}}-{{stop.toLocaleString()}}</a></li>
              <li class="list-item">Total length: {{region_length}} bp</li>
              <li class="list-item">Exonic length: {{ computedRegion.gene.coding_regions.reduce((total, entry) => total + entry[1] - entry[0] + 1, 0).toLocaleString() }} bp</li>
              <li class="list-item">External resources:
                <span><a v-bind:href="'http://pheweb.sph.umich.edu/SAIGE-UKB/gene/' + gene_name">UK Biobank PheWeb</a></span>
                <span>, <a v-bind:href="'https://omim.org/entry/' + omim_accession">OMIM</a></span>
                <span>, <a v-bind:href="'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + gene_id">GeneCards</a></span>
                <span>, <a v-bind:href="ucsc_url">UCSC Browser</a></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GeneInfo",
    inject: {
      chrom: {default: 0},
      start: {default: 0},
      stop: {default: 1},
      gene_name: {default: ''},
      gene_id: {default: ''},
      gene_type: {default: ''},
      full_gene_name: {default: ''},
      coding_regions: {default: []},
      omim_accession: {default: ''} 
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
      ucsc_url() { 
        return ('https://genome.ucsc.edu/cgi-bin/hgTracks?db=GRCh38&position=' + 
          this.chrom + ':' + this.start + '-' + this.stop)
      }
    },
  }
</script>
