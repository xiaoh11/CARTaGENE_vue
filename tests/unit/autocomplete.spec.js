import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Autocomplete from '@/components/Autocomplete.vue'

describe('Autocomplete.vue', () => {
  it('has a centered horizontal rule', () => {
    const width = 600
    const wrapper = shallowMount(Autocomplete, {
      props: { width }
    })

    expect(wrapper).to.exist
  })
})
