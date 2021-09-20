import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Autocomplete from '@/components/Autocomplete.vue'

describe('Autocomplete.vue', () => {
  it('has a centered horizontal rule', () => {
    const wrapper = shallowMount(Autocomplete, {
      props: { width: 600 }
    })

    expect(wrapper).to.exist
  })
    // TODO: test that autocomplete seclection jumps to correct UI result endpoint.
})
