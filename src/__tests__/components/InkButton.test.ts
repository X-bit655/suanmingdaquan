import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InkButton from '@/components/ink/InkButton.vue'

describe('InkButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(InkButton, { slots: { default: '开始测算' } })
    expect(wrapper.text()).toContain('开始测算')
  })

  it('applies primary type class by default', () => {
    const wrapper = mount(InkButton)
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
  })

  it('applies secondary type class', () => {
    const wrapper = mount(InkButton, { props: { type: 'secondary' } })
    expect(wrapper.find('.btn-secondary').exists()).toBe(true)
  })

  it('applies ghost type class', () => {
    const wrapper = mount(InkButton, { props: { type: 'ghost' } })
    expect(wrapper.find('.btn-ghost').exists()).toBe(true)
  })

  it('applies block class', () => {
    const wrapper = mount(InkButton, { props: { block: true } })
    expect(wrapper.find('.block').exists()).toBe(true)
  })

  it('applies disabled class and attribute', () => {
    const wrapper = mount(InkButton, { props: { disabled: true } })
    expect(wrapper.find('.disabled').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows loading indicator when loading', () => {
    const wrapper = mount(InkButton, { props: { loading: true } })
    expect(wrapper.find('.btn-loading').exists()).toBe(true)
  })

  it('emits click event', async () => {
    const wrapper = mount(InkButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(InkButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(InkButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
