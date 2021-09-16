import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import SearchBox from '@/components/SearchBox.vue'
import Autocomplete from '@/components/Autocomplete.vue'

describe('SearchBox.vue', () => {
  it('uses a form', () => {
    const autofocus = true
    const wrapper = shallowMount(SearchBox, {
      props: { autofocus }
    })
    const form = wrapper.find('form')
    expect(form.exists()).to.be.true
  })

  it('has an autocomplete input component', () => {
    const autofocus = true
    const wrapper = shallowMount(SearchBox, {
      props: { autofocus }
    })
    expect(wrapper.findComponent(Autocomplete).exists()).to.be.true
  })
})
