/** eslint-env jest */

import { GLContext } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('GLContext', function () {
  describe('#constructor', function () {
    it('wrap a given webgl context into a new GLContext instance', function () {
      const context = createWebGLContext()
      const wrapper = new GLContext(context)

      expect(wrapper.context).toBe(context)
    })

    it('is empty by default', function () {
      const context = createWebGLContext()
      const wrapper = new GLContext(context)

      expect(wrapper.getObjects().size).toBe(0)
    })
  })

  describe('#of', function () {
    it('return the given wrapper if a wrapper is passed to this method', function () {
      const context = createWebGLContext()
      const wrapper = new GLContext(context)

      expect(GLContext.of(wrapper)).toBe(wrapper)
    })

    it('wrap a given context and return the result if the given context was not already wrapped', function () {
      const context = createWebGLContext()
      const wrapper = GLContext.of(context)

      expect(wrapper).toBeInstanceOf(GLContext)
      expect(wrapper.context).toBe(context)
    })

    it('return the wrapper if the given context was already wrapped', function () {
      const context = createWebGLContext()
      const wrapper = GLContext.of(context)

      expect(GLContext.of(context)).toBe(wrapper)
    })
  })

  describe('#link', function () {
    it('allows to register an object into this context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = { destroyed: false, context: wrapper }

      expect(wrapper.getObjects().size).toBe(0)

      wrapper.link(object)

      expect(wrapper.getObjects().size).toBe(1)
      expect(wrapper.getObjects()).toEqual(new Set([object]))
    })

    it('throw an error if the object was already destroyed', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = { destroyed: true, context: wrapper }

      expect(_ => wrapper.link(object)).toThrow()
    })

    it('throw an error if the object was instanciated for another context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const otherWrapper = GLContext.of(createWebGLContext())
      const object = { destroyed: false, context: otherWrapper }

      expect(_ => wrapper.link(object)).toThrow()
    })

    it('do nothing if the object was already linked', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = { destroyed: false, context: wrapper }

      wrapper.link(object)
      wrapper.link(object)

      expect(wrapper.getObjects().size).toBe(1)
      expect(wrapper.getObjects()).toEqual(new Set([object]))
    })
  })

  describe('#destroy', function () {
    it('allows to destroy a registered object of this context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = { context: wrapper, destroyed: false, destroy: jest.fn() }

      wrapper.link(object)
      wrapper.destroy(object)

      expect(wrapper.getObjects().size).toBe(0)
      expect(object.destroy).toHaveBeenCalled()
    })

    it('does nothing if the object was already destroyed', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = { context: wrapper, destroyed: true, destroy: jest.fn() }

      wrapper.destroy(object)

      expect(wrapper.getObjects().size).toBe(0)
      expect(object.destroy).not.toHaveBeenCalled()
    })
  })

  describe('#clear', function () {
    it('it destroy all registered objects of the context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const objects = [
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() }
      ]

      for (const object of objects) wrapper.link(object)
      wrapper.clear()

      expect(wrapper.getObjects().size).toBe(0)
      for (const object of objects) expect(object.destroy).toHaveBeenCalled()
    })
  })

  describe('#objects', function () {
    it('it iterate over registered objects of the context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const objects = [
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() },
        { context: wrapper, destroyed: false, destroy: jest.fn() }
      ]

      for (const object of objects) wrapper.link(object)

      expect(new Set(
        [... wrapper.objects()]
      )).toEqual(wrapper.getObjects())
    })
  })
})
