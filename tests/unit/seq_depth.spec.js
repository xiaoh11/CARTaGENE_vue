import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import RegionDashboard from '@/components/SeqDepth.vue'

// Need to mock data loading before implementing tests on SeqDepth
describe.skip('SeqDepth structure.', () => {
  it('renders a svg node', () => {
    const wrapper = shallowMount(RegionDashboard)
    const svg = wrapper.find('svg')
    expect(svg.exists()).to.be.true
  })
})
