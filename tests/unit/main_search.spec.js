import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import MainSearch from '@/components/MainSearch.vue'

describe('MainSearch.vue', () => {

  it('use centering style for horizontal rule', () => {
    const wrapper = shallowMount(MainSearch, {})
    const hr = wrapper.find('hr')

    expect(hr.exists()).to.be.true
    expect(hr.classes()).to.include('margin-centered')
  })
})
