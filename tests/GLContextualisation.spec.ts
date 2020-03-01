/** eslint-env jest */

import { GLContext } from '../sources/GLContext'
import { GLContextualisation } from '../sources/GLContextualisation'
import { Descriptor } from '../sources/Descriptor'
import { createWebGLContext } from './createWebGLContext'

describe('GLContextualisation', function () {
  describe('#constructor', function () {
    it('create a contextualisation of the given descriptor for the given context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = {} as Descriptor
      const contextualisation : GLContextualisation<Descriptor> = new GLContextualisation(descriptor, context)

      expect(contextualisation.context).toBe(context)
      expect(contextualisation.descriptor).toBe(descriptor)
      expect(context.contextualisations.size).toBe(1)
      expect(context.contextualisations.get(descriptor)).toBe(contextualisation)
    })

    it('throw if the given descriptor was already contextualised', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = {} as Descriptor
      new GLContextualisation(descriptor, context)

      expect(() => new GLContextualisation(descriptor, context)).toThrow()
    })
  })

  describe('#destroy', function () {
    it('destroy the contextualisation', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = {} as Descriptor
      const contextualisation : GLContextualisation<Descriptor> = new GLContextualisation(descriptor, context)

      expect(contextualisation.destroyed).toBeFalsy()
      expect(context.contextualisations.size).toBe(1)

      contextualisation.destroy()

      expect(contextualisation.destroyed).toBeTruthy()
      expect(context.contextualisations.size).toBe(0)
    })
  })

  describe('#pull', function () {
    it('update the contextualisation timestamp', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = {} as Descriptor
      const contextualisation : GLContextualisation<Descriptor> = new GLContextualisation(descriptor, context)
      const timestamp : number = contextualisation.timestamp

      for (let index = 0; index < 80000; ++index) {}

      contextualisation.pull()

      expect(contextualisation.timestamp).toBeGreaterThan(timestamp)
    })
  })
})
