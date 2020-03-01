/** eslint-env jest */

import { GLContext } from '../sources/GLContext'
import { GLResource } from '../sources/GLResource'
import { Descriptor } from '../sources/Descriptor'
import { GLContextualisation } from '../sources/GLContextualisation'
import { createWebGLContext } from './createWebGLContext'

describe('GLContext', function () {
  describe('#constructor', function () {
    it('wrap a given webgl context into a new GLContext instance', function () {
      const context : WebGLRenderingContext = createWebGLContext()
      const wrapper : GLContext = new GLContext(context)

      expect(wrapper.context).toBe(context)

      wrapper.destroy()
    })

    it('is empty by default', function () {
      const context : WebGLRenderingContext  = createWebGLContext()
      const wrapper : GLContext = new GLContext(context)

      expect(wrapper.resources.size).toBe(0)

      wrapper.destroy()
    })

    it('add the context to the set of all existing context', function () {
      const context : WebGLRenderingContext  = createWebGLContext()

      expect([...GLContext.all()]).toEqual([])

      const wrapper : GLContext = new GLContext(context)

      expect([...GLContext.all()]).toEqual([wrapper])

      wrapper.destroy()
    })
  })

  describe('#add', function () {
    it('allows to register a resource into this context', function () {
      const context : GLContext = new GLContext(createWebGLContext())

      expect(context.resources.size).toBe(0)

      const resource : GLResource = new GLResource(context)

      expect(context.resources.size).toBe(1)
      expect(context.resources).toEqual(new Set([resource]))
    })

    it('handle the addition of contextualisation', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = new Descriptor()

      expect(context.resources.size).toBe(0)
      expect(context.contextualisations.size).toBe(0)

      const contextualisation : GLContextualisation<Descriptor> = new GLContextualisation(descriptor, context)

      expect(context.resources.size).toBe(1)
      expect(context.resources).toEqual(new Set([contextualisation]))
      expect(context.contextualisations.size).toBe(1)
      expect(context.contextualisations.get(descriptor)).toBe(contextualisation)
    })

    it('throw an error if the object was already destroyed', function () {
      const context : GLContext = new GLContext(createWebGLContext())

      const resource : GLResource = new GLResource(context)
      resource.destroy()

      expect(() => context.add(resource)).toThrow()
    })

    it('throw an error if the object was instanciated for another context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const otherContext : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      expect(() => otherContext.add(resource)).toThrow()
    })

    it('throw an error if the context was already released', function () {
      const context : GLContext = new GLContext(createWebGLContext())

      context.destroy()

      expect(() => new GLResource(context)).toThrow()
    })

    it('do nothing if the object was already added', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      context.add(resource)
      context.add(resource)

      expect(context.resources.size).toBe(1)
      expect(context.resources).toEqual(new Set([resource]))
    })
  })

  describe('#delete', function () {
    it('allows to destroy a registered object of this context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      context.add(resource)

      expect(context.resources.size).toBe(1)
      expect(resource.destroyed).toBeFalsy()

      context.delete(resource)

      expect(context.resources.size).toBe(0)
      expect(resource.destroyed).toBeTruthy()
    })

    it('handle the deletion of contextualisation', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const descriptor : Descriptor = new Descriptor()
      const contextualisation : GLContextualisation<Descriptor> = new GLContextualisation(descriptor, context)

      expect(context.resources.size).toBe(1)
      expect(context.contextualisations.size).toBe(1)

      contextualisation.destroy()

      expect(context.resources.size).toBe(0)
      expect(context.contextualisations.size).toBe(0)
    })

    it('throw an error if the context was already released', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      context.destroy()

      expect(() => context.delete(resource)).toThrow()
    })

    it('does nothing if the object was already destroyed', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      context.delete(resource)
      context.delete(resource)

      expect(context.resources.size).toBe(0)
      expect(resource.destroyed).toBeTruthy()
    })
  })

  describe('#clear', function () {
    it('it destroy all registered objects of the context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resources : GLResource[] = [
        new GLResource(context),
        new GLResource(context),
        new GLResource(context),
        new GLResource(context)
      ]

      expect(context.resources.size).toBe(4)

      context.clear()

      expect(context.resources.size).toBe(0)

      for (const resource of resources) {
        expect(resource.destroyed).toBeTruthy()
      }
    })

    it('throw an error if the context was already released', function () {
      const context : GLContext = new GLContext(createWebGLContext())

      context.destroy()

      expect(() => context.clear()).toThrow()
    })
  })

  describe('#clear', function () {
    it('it destroy all registered objects of the context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resources : GLResource[] = [
        new GLResource(context),
        new GLResource(context),
        new GLResource(context),
        new GLResource(context)
      ]

      expect(context.resources.size).toBe(4)

      context.clear()

      expect(context.resources.size).toBe(0)

      for (const resource of resources) {
        expect(resource.destroyed).toBeTruthy()
      }
    })
  })
})
