import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import SearchBox from '@/components/SearchBox.vue'
import Autocomplete from '@/components/Autocomplete.vue'

describe('SearchBox.vue components structure.', () => {
  it('uses a form', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })
    const form = wrapper.find('form')

    expect(form.exists()).to.be.true
  })

  it('has an autocomplete input component', () => {
    const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })

    expect(wrapper.findComponent(Autocomplete).exists()).to.be.true
  })
})

describe('SearchBox.vue query parsing.', () => {

  // Instantiate component once only to access the methods
  const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })

  it('tickets an empty query with endpoint: notfound', () => {
    const empty_result = wrapper.vm.queryToResultTicket('')
    expect(empty_result.endpoint).to.equal('notfound')

    const ws_result = wrapper.vm.queryToResultTicket('    ')
    expect(ws_result.endpoint).to.equal('notfound')

    const comma_result = wrapper.vm.queryToResultTicket(',, ')
    expect(comma_result.endpoint).to.equal('notfound')
  })

  it('tickets a dbSNP reference query with endpoint: variant', () => {
    const rsid_result = wrapper.vm.queryToResultTicket('rs12345678')
    expect(rsid_result.variant_type).to.equal('snv')
    expect(rsid_result.endpoint).to.equal('variant')
  })

  it('tickets a range query with endpoint: region', () => {
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('region')
  })

  it('tickets a vcf variant query with endpoint: variant', () => {
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000-A-T')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('variant')
  })

  it('tickets a vcf variant query with endpoint: variant', () => {
    const range_result = wrapper.vm.queryToResultTicket('chr11:10,500,100-10,503,000-A-T')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('variant')
  })

  it('defaults to ticket query with endpoint: gene', () => {
    const range_result = wrapper.vm.queryToResultTicket('HBBP1')
    expect(range_result.variant_type).to.equal('snv')
    expect(range_result.endpoint).to.equal('gene')
  })
})

describe('SearchBox.vue query result routing', () => {
  /*
   * Cannot directly verify window.location.href is set as expected.
   * jsdom does not implment nor handle location changes 
   *   e.g.: window.location.href = 'http://example.com'
   *
   * Error: Not implemented: navigation (except hash changes)
   * at module.exports (.../node_modules/jsdom/lib/jsdom/browser/not-implemented.js:9:17)
   * at navigateFetch (.../node_modules/jsdom/lib/jsdom/living/window/navigation.js:77:3)
  */

  // Instantiate component once only to access the methods
  const wrapper = shallowMount(SearchBox, { props: { autofocus: true } })

  it('Uses endpoint as the base href', () => {
    const ticket = {endpoint: 'foo'}
    const href_result = wrapper.vm.resultTicketToHref(ticket)

    expect(href_result).to.equal('foo')
  })

  it('URL encodes and appends other ticket properties ', () => {
    const ticket = {endpoint: 'foo', geneName: 'duq', }
    const href_result = wrapper.vm.resultTicketToHref(ticket)

    expect(href_result).to.contain('foo?')
    expect(href_result).to.contain('geneName=duq')
  })

})

