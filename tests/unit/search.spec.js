import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import SearchBox from '@/components/SearchBox.vue'
import Autocomplete from '@/components/Autocomplete.vue'

describe('SearchBox.vue', () => {
  it('uses a form', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    const form = wrapper.find('form')

    expect(form.exists()).to.be.true
  })

  it('has an autocomplete input component', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })

    expect(wrapper.findComponent(Autocomplete).exists()).to.be.true
  })

  it('tickets an empty query with endpoint: notfound', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const empty_result = wrapper.vm.queryToResultTicket('')
    expect(empty_result.endpoint).to.equal('notfound')

    const ws_result = wrapper.vm.queryToResultTicket('    ')
    expect(ws_result.endpoint).to.equal('notfound')

    const comma_result = wrapper.vm.queryToResultTicket(',, ')
    expect(comma_result.endpoint).to.equal('notfound')
  })

  it('tickets a dbSNP reference query with endpoint: variant', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const rsid_result = wrapper.vm.queryToResultTicket('rs12345678')
    expect(rsid_result.variant_type).to.equal('snv')
    expect(rsid_result.endpoint).to.equal('variant')
  })

  it('tickets a range query with endpoint: region', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('region')
  })

  it('tickets a vcf variant query with endpoint: variant', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000-A-T')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('variant')
  })

  it('tickets a vcf variant query with endpoint: variant', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000-A-T')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('variant')
  })

  it('defaults to ticket query with endpoint: gene', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    
    const range_result = wrapper.vm.queryToResultTicket('HBBP1')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('gene')
  })


})
