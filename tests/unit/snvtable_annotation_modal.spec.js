import { expect } from 'chai'
import { mount, shallowMount } from '@vue/test-utils'
import SNVTableModalAnnotation from '@/components/table/SNVTableAnnotationModal.vue'

// Example row data from GeneSNVTable and RegionSNVTable
import geneRowData from '../fixtures/snv_table_gene_row.json'
import regionRowData from '../fixtures/snv_table_region_row.json'

/* Testing with teleport requires:
 *   NOT stubbing the Teleport component as shallowMount will do by default.  
 *   Querying document.body instead of wrapper's content as it's been teleported
 */
describe('SNV modal data', function() {
  let wrapper

  before(() => {
    document.body.innerHTML=""
    wrapper = mount(SNVTableModalAnnotation, {
      shallow: false,
      propsData: { 
        rowData: geneRowData, 
        showModal: true
      }
    })
  })

  it('uses variant_id as title', () => {
    let title = document.querySelector('h5.modal-title').innerHTML
    expect(title).to.equal(geneRowData.variant_id)
  })

  it('has an entry for each gene consequence', () => {
    let cons = wrapper.vm.consequences
    expect(cons).to.have.all.keys(geneRowData.annotation.gene.consequence)
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

describe('SNV modal row table data processing', () => { 
  let wrapper

  before(() => {
    document.body.innerHTML=""
    wrapper = mount(SNVTableModalAnnotation, {
      shallow: false,
      propsData: { 
        rowData: regionRowData, 
        showModal: true
      }
    })
  })

  it('uses variant_id as title', () => {
    let title = document.querySelector('h5.modal-title').innerHTML
    expect(title).to.equal(regionRowData.variant_id)
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

  it('has an entry for each region consequence', () => {
    let cons = wrapper.vm.consequences
    expect(cons).to.have.all.keys(regionRowData.annotation.region.consequence)
  })

})
