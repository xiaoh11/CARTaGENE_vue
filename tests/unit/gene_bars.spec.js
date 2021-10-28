import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import GeneBars from '@/components/GeneBars.vue'

// Need to mock data loading before implementing tests on GeneBars
describe.skip('SeqDepth structure.', () => {
  it('renders a svg node', () => {
    const wrapper = shallowMount(GeneBars)
    const svg = wrapper.find('svg')
    expect(svg.exists()).to.be.true
  })
})
