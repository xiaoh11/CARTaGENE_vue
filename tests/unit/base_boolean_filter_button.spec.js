import { expect } from 'chai'
import { config, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import clone from 'just-clone';
import {clickOutside} from '@/CustomDirectives'
import BaseBooleanFilterButton from '@/components/filters/BaseBooleanFilterButton.vue'

// Filter buttons rely on custom Vue directive to do show/hide.
config.global.directives = { 'click-outside': clickOutside }

const generateMembers = function(n){
  const nArr = Array.from(Array(n).keys())
  let membersObj = nArr.reduce(
    (acc,curr) => {
      acc['m'+curr]={title: 'Example', desc: 'Lorum ipsum'}; 
      return(acc)},
    {})
  return(membersObj)
}

/* 
 * Fixtures to compose into pFilters for testing 
*/
// leave vals for default
const filterGroupOne = {
  title: "Example Filter Group",
  members: {
    red: { 
      title: "Red", 
      desc: "Is red."
    },
    green: { 
      title: "Green", 
      desc: "Is green"
    }
  }
}

// specify some filter members as true by default
const filterGroupTwo = {
  title: "Quality Control Failures",
  members: {
    mainQC: { 
      title: "Main Quality Control", 
      desc: "Failed primary quality control"
    },
    secondary: { 
      title: "Secondary", 
      val: true,
      desc: "Failed Secondary quality control"
    },
    alice: { 
      title: "Project alICE", 
      vale: true,
      desc: "Failed QC for the fictional alICE project"
    }
  }
}

// generate a large group of members to be hidden in a collapseable element
const filterGroupHidden = {
  title: "Quality Control Failures",
  collapseable: true,
  members: generateMembers(25)
}

const exFilter = {
  gOne: filterGroupOne,
  gTwo: filterGroupTwo
}

const exCollapseFilter = {
  gOne:   filterGroupOne,
  gTwo:   filterGroupTwo,
  gHide: filterGroupHidden
}

describe('BaseBooleanFilterButton setup', () => {
  // Clone example filter so it can be mutated in tests.
  const wrapper = shallowMount(BaseBooleanFilterButton, {
    data() {
      return {pFilter: clone(exFilter)}
    }
  })

  it('defaults allTrue to false', () => {
    let groups = Object.values(wrapper.vm.pFilter)
    expect(groups.every( g => g.allTrue == false )).to.be.true
  })

  it('defaults collapseable to false', () => {
    let groups = Object.values(wrapper.vm.pFilter)
    expect(groups.every( g => g.collapseable == false )).to.be.true
  })

  it('defaults undefined member vals to false', () => {
    let groups = Object.values(wrapper.vm.pFilter)
    let allMembers = groups
      .map( g => g.members )
      .flatMap((m) => Object.values(m))

    expect(allMembers.every(m => m.val !== undefined)).to.be.true
  })

  it('clones eFilter from pFilter when created', () => {
    expect(wrapper.vm.eFilter).to.eql(wrapper.vm.pFilter)
  })

})

describe('BaseBooleanFilterButton rendering', () => {
  let wrapper = {}

  // Remount so these tests can mutate DOM
  beforeEach(function(){
    wrapper = shallowMount(BaseBooleanFilterButton, {
      data() {
        return {pFilter: clone(exFilter)}
      }
    })
  })

  it('shows/hides input form on click', () => {
    expect(wrapper.vm.showDropDown).to.be.false
    expect(wrapper.find('form').exists()).to.be.false

    wrapper.find('button').trigger('click')

    expect(wrapper.vm.showDropDown).to.be.true
    expect(wrapper.find('form').exists()).to.be.false
  })


  it('clones eFilter from pFilter on dropdown', async () => {
    wrapper.vm.eFilter.gOne.members.red.val = true
    expect(wrapper.vm.eFilter).to.not.eql(wrapper.vm.pFilter)

    wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.vm.eFilter).to.eql(wrapper.vm.pFilter)
  })

  it('renders groups from pFilter data', async () => {
    wrapper.find('button').trigger('click')
    await nextTick()

    let numGroups = Object.values(wrapper.vm.pFilter).length
    let numGroupItems = wrapper.findAll('form > li').length

    expect(numGroupItems).to.equal(numGroups)
  })

  it('renders members from pFilter data', async () => {
    wrapper.find('button').trigger('click')
    await nextTick()

    let groups = Object.values(wrapper.vm.pFilter)
    let numAllMembers = groups
      .map( g => g.members )
      .flatMap((m) => Object.values(m))
      .length

    let numAllListItems = wrapper.findAll('form li li').length
    expect(numAllListItems).to.equal(numAllMembers)
  })
})

describe('BaseBooleanFilterButton with collapseable groups', () => {
  let wrapper = {}

  // Remount so these tests can mutate DOM
  beforeEach(function(){
    wrapper = shallowMount(BaseBooleanFilterButton, {
      data() {
        return {pFilter: clone(exCollapseFilter)}
      }
    })
  })

  it('computes that there exists a collapseable group', () => {
    expect(wrapper.vm.isCollapseFiltSetPresent).to.be.true
  })

  it('computes an object of collaseable groups only', () => {
    const cfs = wrapper.vm.collapseFiltSet
    const groups = Object.values( cfs )

    expect(cfs).to.be.an('object')
    expect(groups.length).to.equal(1)
  })

  it('computes an object of non-collaseable groups only', () => {
    const fs = wrapper.vm.nonCollapseFiltSet
    const groups = Object.values( fs )

    expect(fs).to.be.an('object')
    expect(groups.length).to.equal(2)
  })

})
