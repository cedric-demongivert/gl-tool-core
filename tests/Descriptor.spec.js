/** eslint-env jest */

import { Descriptor, GLContext, GLContextualisation } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('GLObject', function () {
  describe('#contextualise', function () {
    it('instantiate a new GLContextualisation by default', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = new Descriptor()
      const contextualisation = descriptor.contextualise(wrapper)

      expect(contextualisation).toBeInstanceOf(GLContextualisation)
      expect(contextualisation.context).toBe(wrapper)
      expect(contextualisation.descriptor).toBe(descriptor)
    })
  })

  describe('#contextualisation', function () {
    it('is an alias of GLContextualisation.of', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = new Descriptor()
      const contextualisation = descriptor.contextualisation(wrapper)

      expect(contextualisation).toBeInstanceOf(GLContextualisation)
      expect(contextualisation.context).toBe(wrapper)
      expect(contextualisation.descriptor).toBe(descriptor)
    })
  })
})
