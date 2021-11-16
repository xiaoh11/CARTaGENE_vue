<template>
  <div class="modal" id="modalAnnotations" role="dialog" data-backdrop="false" style="z-index:99999;">
    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">{{ title }}</h5>
           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>
          <div class="modal-body">
            <small>
              <div id="accordion">
                <div v-for="(c, index) in annotations" :key="c.consequence">
                  <span :class="badgeClass(c.consequence)">&#9632;</span>
                  <pre> debug {{index}} </pre>
                  
                  <!-- TODO: Compete content build from props

                  <a data-toggle="collapse" v-bind:href="'#collapse' + index">{{ $DOMAIN_DICTIONARY.consequence[c.consequence].text }}</a>
                  <div v-if="c.transcripts.length > 0" v-bind:id="'collapse' + index" v-bind:class="index == 0 ? 'collapse show' : 'collapse'" data-parent="#accordion">
                    <ul class="list-unstyled">
                      <li v-for="transcript in c.transcripts">
                        {{ transcript.gene_name }}: {{ transcript.transcript_name }}
                        <ul>
                          <li><span style="color: #85144b;">{{ transcript.biotype }}</span></li>
                          <li v-if="transcript.HGVSc">HGVSc: <b>{{ transcript.HGVSc }}</b></li>
                          <li v-if="transcript.HGVSp">HGVSp: <b>{{ transcript.HGVSp}}</b></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                -->
              </div>
            </small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-primary" data-dismiss="modal">Close</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SNVTableModalAnnotation",
  props: {
    title: {
      type: String,
      default: "Variant Id"
    },
    annotations: {
      type: Array,
      default: function() {return []}
    }
  },
  methods: {
    badge_class: function(consequenceKey) {
      return('badge badge-light ' + 'annoModal__badge--' + consequenceKey)
    }
  }
}
</script>

