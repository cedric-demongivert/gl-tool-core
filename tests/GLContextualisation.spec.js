/** eslint-env jest */

import { GLContext, GLContextualisation } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('GLContextualisation', function () {
  describe('#constructor', function () {
    it('create a contextualisation of the given descriptor for the given context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = {}
      const contextualisation = new GLContextualisation(wrapper, descriptor)

      expect(contextualisation.context).toBe(wrapper)
      expect(contextualisation.descriptor).toBe(descriptor)
      expect(GLContextualisation.of(wrapper, descriptor)).toBe(contextualisation)
      expect([...GLContextualisation.all(descriptor)]).toEqual([ contextualisation ])
    })

    it('throw if the given descriptor was already contextualised', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = {}
      const contextualisation = new GLContextualisation(wrapper, descriptor)

      expect(_ => new GLContextualisation(wrapper, descriptor)).toThrow()
    })
  })

  describe('#of', function () {
    it('try to contextualise the given descriptor if the given was not already contextualised', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = {
        contextualise: jest.fn(context => new GLContextualisation(context, descriptor))
      }

      const contextualisation = GLContextualisation.of(wrapper, descriptor)

      expect(contextualisation.context).toBe(wrapper)
      expect(contextualisation.descriptor).toBe(descriptor)
      expect(GLContextualisation.of(wrapper, descriptor)).toBe(contextualisation)
      expect([...GLContextualisation.all(descriptor)]).toEqual([ contextualisation ])
      expect(descriptor.contextualise).toHaveBeenCalledWith(wrapper)
    })

    it('return the existing contextualisation if the descriptor was already contextualised', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = {}
      const contextualisation = new GLContextualisation(wrapper, descriptor)

      expect(GLContextualisation.of(wrapper, descriptor)).toBe(contextualisation)
    })
  })

  describe('#destroy', function () {
    it('destroy the contextualisation', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const descriptor = {
        contextualise: jest.fn(context => new GLContextualisation(context, descriptor))
      }
      const contextualisation = new GLContextualisation(wrapper, descriptor)

      contextualisation.destroy()

      expect([...GLContextualisation.all(descriptor)]).toEqual([ ])
      expect(GLContextualisation.of(wrapper, descriptor)).not.toBe(contextualisation)
    })
  })
})
