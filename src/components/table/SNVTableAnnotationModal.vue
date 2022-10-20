<template>
  <Teleport to="body">
    <div v-if="showModal" class="modal" id="modalAnnotations" role="dialog" style="z-index:99999;">
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
         <div class="modal-content">
           <div class="modal-header">
             <div class="bravo-modal-titlebox">
               <h5 class="modal-title">{{ title }}</h5>
               <h6 class="modal-title">{{ subtitle }}</h6>
             </div>
             <button  @click="$emit('closeModal')" class="close" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
            <div class="modal-body">
              <pre>ModalBody</pre>
            </div>
            <div class="modal-footer">
              <button @click="$emit('closeModal')" class="btn btn-sm btn-primary">Close</button>
            </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "SNVTableModalAnnotation",
  props: {
    showModal: {
      type: Boolean,
      default: function() {return false}
    },
    geneRowData: {
      type: Object,
      default: function() {return {}}
    }
  },
  emits: ['closeModal'],
  computed:{
    title() { return this.geneRowData.variant_id },
    subtitle() {return this.geneRowData.annotation.gene.name},
    consequences() {return this.extractConsequences(this.geneRowData)}
  },
  methods: {
    badge_class: function(consequenceKey) {
      return('badge badge-light ' + 'badge--' + consequenceKey)
    },
    extractConsequences: function(rowData) {
      // initialize consequences from gene annotation
      let conseqs = {}
      rowData.annotation.gene.consequence.forEach((c) => {conseqs[c] = []})

      // push copy of transcript data into each consequence lists it belongs to
      rowData.annotation.gene.transcripts.forEach((trx) => {
        let trxCpy = Object.assign({}, trx)
        delete trxCpy.consequence
        trx.consequence.forEach((c) => { conseqs[c].push(trxCpy) })
      })

      return conseqs
    }
  }
}
</script>
