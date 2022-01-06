import { expect } from 'chai'
import { config, shallowMount } from '@vue/test-utils'
import QualityFilterButton from '@/components/filter/QualityFilterButton.vue'
import clone from 'just-clone';

// Filter buttons rely on custom Vue directive to do show/hide.
import {clickOutside} from '@/CustomDirectives'
config.global.directives = { 'click-outside': clickOutside }

// Example filter values with mix of true and false.
const exFilter = {
  gPassQC: {
    allTrue: true,
    members: { PASS: { val: true } }
  },
  gFailQC:{
    allTrue: false,
    members: { 
      SVM:   { val: false}, 
      DISC:  { val: true },
      EXHET: { val: true}
    }
  }
}

describe('QualityFilterButton filter conversion methods', () => {
  const wrapper = shallowMount(QualityFilterButton, {})

  it('filterGroupToArray yields array of mongo like filters', () => {
    const g1Expected = [ { field: 'filter', type: '=', value: 'PASS'} ]
    const g2Expected = [ 
      { field: 'filter', type: '=', value: 'DISC'},
      { field: 'filter', type: '=', value: 'EXHET'},
    ]

    const g1Result = wrapper.vm.filterGroupToArray(exFilter.gPassQC)
    const g2Result = wrapper.vm.filterGroupToArray(exFilter.gFailQC)

    expect(g1Result).to.eql(g1Expected)
    expect(g2Result).to.eql(g2Expected)
  })

  it('filterToArray parses both filter groups to single array', () => {
    const expected = [
      { field: 'filter', type: '=', value: 'PASS'},
      { field: 'filter', type: '=', value: 'DISC'},
      { field: 'filter', type: '=', value: 'EXHET'}
    ]

    const result = wrapper.vm.filterToArray(exFilter)
    expect(result).to.eql(expected)
  })
})

describe('QualityFilterButton filter changes', () => {

  it('emits FilterChange when filter changed', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    wrapper.setData({
      eFiltSet: exFilter
    })

    wrapper.vm.applyFilters()
    expect(wrapper.emitted()).to.have.property('filterChange')
  })

  it('does NOT emit FilterChange when filter unchanged', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    wrapper.setData({ eFiltSet: clone(wrapper.pFiltSet) })

    wrapper.vm.applyFilters()
    expect(wrapper.emitted()).to.be.empty
  })
})

describe('QualityFilterButton dropdown', () => {
  it('toggles showDropDown when button is clicked', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    const initialState = wrapper.vm.showDropDown

    wrapper.find('button').trigger('click')
    expect(wrapper.vm.showDropDown).to.equal(!initialState)

    wrapper.find('button').trigger('click')
    expect(wrapper.vm.showDropDown).to.equal(initialState)
  })
})
