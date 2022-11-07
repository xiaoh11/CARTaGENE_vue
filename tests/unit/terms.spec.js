import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import App from '@/pages/terms/Terms.vue'

describe('Terms page for anonymous user.', () => {
  const wrapper = shallowMount(App)

  it('hides the agreement button', () => {
    const agreeBtn = wrapper.find('#agreeBtn')
    expect(agreeBtn.exists()).to.be.false
  })

  it('hides agreement message', () => {
    const agreeMessage = wrapper.find('#agreeMsg')
    expect(agreeMessage.exists()).to.be.false
  })
})

describe('Terms page for authorized but not terms agreed user.', () => {
  const wrapper = shallowMount(App, {
    global: { 
      provide: { 
        user: 'foo@example.com',
        agreedToTerms: false
      } 
    } 
  })

  it('shows the agreement button', () => {
    const agreeBtn = wrapper.find('#agreeBtn')
    expect(agreeBtn.exists()).to.be.true
  })
})

describe('Terms page for authorized and terms agreed user.', () => {
  const wrapper = shallowMount(App, {
    global: { 
      provide: { 
        user: 'foo@example.com',
        agreedToTerms: true
      } 
    } 
  })

  it('hides the agreement button', () => {
    const agreeBtn = wrapper.find('#agreeBtn')
    expect(agreeBtn.exists()).to.be.false
  })

  it('shows agreement message', () => {
    const agreeMessage = wrapper.find('#agreeMsg')
    expect(agreeMessage.exists()).to.be.true
  })
})
