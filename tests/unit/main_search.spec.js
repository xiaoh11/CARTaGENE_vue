import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import MainSearch from '@/components/MainSearch.vue'

describe('MainSearch.vue', () => {

  it('centers the horizontal rule form', () => {
    const wrapper = shallowMount(MainSearch, {})

    const hr = wrapper.find('hr')
    console.log(hr.attributes())
    expect(hr.exists()).to.be.true
  })
})
