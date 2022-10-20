import { expect } from 'chai'
import { mount, shallowMount } from '@vue/test-utils'
import SNVTableModalAnnotation from '@/components/table/SNVTableAnnotationModal.vue'

let gene_row_data = { 
  "allele_count": 1, "allele_freq": 0.00011984699813183397, "allele_num": 8344,
  "variant_id": "11-5225653-G-A",
  "annotation": {
    "gene": {
      "consequence": [ "missense_variant", "3_prime_UTR_variant", "NMD_transcript_variant", "downstream_gene_variant" ],
      "hgvs": [ "p.Ala130Val", "c.*205C>T" ],
      "name": "ENSG00000244734",
      "transcripts": [
        { "HGVSc": "c.389C>T", "HGVSp": "p.Ala130Val",
          "biotype": "protein_coding", "consequence": [ "missense_variant" ],
          "name": "ENST00000335295"
        },
        {
          "biotype": "protein_coding", "consequence": [ "downstream_gene_variant" ],
          "name": "ENST00000380315"
        },
        {
          "biotype": "retained_intron",
          "consequence": [ "downstream_gene_variant" ],
          "name": "ENST00000475226"
        },
        {
          "biotype": "protein_coding", "consequence": [ "downstream_gene_variant" ],
          "name": "ENST00000485743"
        },
        {
          "HGVSc": "c.*205C>T", 
          "biotype": "nonsense_mediated_decay",
          "consequence": [ "3_prime_UTR_variant", "NMD_transcript_variant" ],
          "name": "ENST00000633227"
        },
        {
          "HGVSc": "c.389C>T", "HGVSp": "p.Ala130Val",
          "biotype": "protein_coding", "consequence": [ "missense_variant" ],
          "name": "ENST00000647020"
        }
      ]
    }
  }
}

/* Testing with teleport requires:
 *   NOT stubbing the Teleport component as shallowMount will do by default.  
 *   Querying document.body instead of wrapper's content as it's been teleported
 */
describe('SNV modal data', function() {
  let wrapper

  before(() => {
    wrapper = mount(SNVTableModalAnnotation, {
      shallow: false,
      propsData: { 
        geneRowData: gene_row_data, 
        showModal: true}
    })
  })

  it('uses variant_id as title', () => {
    let title = document.querySelector('h5.modal-title').innerHTML
    expect(title).to.equal(gene_row_data.variant_id)
  })

  it('uses gene name as subtitle', () => {
    let subtitle = document.querySelector('h6.modal-title').innerHTML
    expect(subtitle).to.equal(gene_row_data.annotation.gene.name)
  })

  it('has an entry for each gene consequence', () => {
    let cons = wrapper.vm.consequences
    expect(cons).to.have.all.keys(gene_row_data.annotation.gene.consequence)
  })

  it('has array of transcripts for each consequence', () => {
    let cons = wrapper.vm.consequences
    Object.values(cons).forEach((con_transcripts) => {
      expect(con_transcripts).to.be.an('array')
    })
  })

  it('has name and biotype for each transcript', () => {
    let cons = wrapper.vm.consequences
    Object.values(cons).forEach((con_transcripts) => {
      con_transcripts.forEach((trx) => {
        expect(trx).to.include.keys(['biotype','name'])
      })
    })
  })
})
