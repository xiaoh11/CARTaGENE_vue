import { expect } from 'chai'
import { config, shallowMount } from '@vue/test-utils'
import QualityFilterButton from '@/components/filters/QualityFilterButton.vue'
import clone from 'just-clone';

// Filter buttons rely on custom Vue directive to do show/hide.
import {clickOutside} from '@/CustomDirectives'
config.global.directives = { 'click-outside': clickOutside }

describe('QualityFilterButton.vue filter conversion methods', () => {
  const wrapper = shallowMount(QualityFilterButton, {})

  it('filterGroupToArray yields array of mongo like filters', () => {
    const filterGroup = {FOO: true, BAR: false, BAZ: true, DUQ: true}
    const expected = [
      { field: 'filter', type: '=', value: 'FOO'},
      { field: 'filter', type: '=', value: 'BAZ'},
      { field: 'filter', type: '=', value: 'DUQ'}
    ]
    const result = wrapper.vm.filterGroupToArray(filterGroup)
    expect(result).to.eql(expected)
  })

  it('filterToArray parses both filter groups to single array', () => {
    const filter = { groupPassQC: {FOO: true},
                     groupFailQC: {BAR: false, BAZ: true, DUQ: true}
    }
    const expected = [
      { field: 'filter', type: '=', value: 'FOO'},
      { field: 'filter', type: '=', value: 'BAZ'},
      { field: 'filter', type: '=', value: 'DUQ'}
    ]

    const result = wrapper.vm.filterToArray(filter)
    expect(result).to.eql(expected)
  })
})

describe('QualityFilterButton.vue emit filter changes', () => {

  it('Apply emits FilterChange when filter changed', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    wrapper.setData({
      eFilter: {
        allPassQC: false,
        groupPassQC: { PASS: true },
        allFailQC: false,
        groupFailQC:{ SVM: false, DISC: false, EXHET: false }
      }
    })

    wrapper.vm.applyFilters()
    expect(wrapper.emitted()).to.have.property('filterChange')
  })

  it('Apply does NOT emit FilterChange when filter unchanged', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    wrapper.setData({ eFilter: clone(wrapper.pFilter) })

    wrapper.vm.applyFilters()
    expect(wrapper.emitted()).to.be.empty
  })
})

describe('QualityFilterButton.vue UI behavior', () => {
  it('clicking the button toggles showDropDown', () => {
    const wrapper = shallowMount(QualityFilterButton, {})

    const initialState = wrapper.vm.showDropDown

    wrapper.find('button').trigger('click')
    expect(wrapper.vm.showDropDown).to.equal(!initialState)

    wrapper.find('button').trigger('click')
    expect(wrapper.vm.showDropDown).to.equal(initialState)
  })
})
