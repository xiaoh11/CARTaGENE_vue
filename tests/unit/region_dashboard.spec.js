import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import RegionDashboard from '@/components/RegionDashboard.vue'

describe('RegionDashboard components structure.', () => {
  const wrapper = shallowMount(RegionDashboard)

  it('has the bravovis div', () => {
    const bravoViz = wrapper.find('#bravoviz')
    expect(bravoViz.exists()).to.be.true
  })
})
