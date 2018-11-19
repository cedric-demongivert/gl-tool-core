/** eslint-env jest */

import { GLObject, GLContext } from '@library'
import { createWebGLContext } from './createWebGLContext'

describe('GLObject', function () {
  describe('#constructor', function () {
    it('create a new object for a given context and link the object to it', function () {
      const wrapper = GLContext.of(createWebGLContext())
      wrapper.link = jest.fn(wrapper.link)

      const object = new GLObject(wrapper)

      expect(object.context).toBe(wrapper)
      expect(wrapper.link).toHaveBeenCalledWith(object)
    })

    it('wrap the given context and link the object to it', function () {
      const context = createWebGLContext()

      const object = new GLObject(context)

      expect(object.context).toBe(GLContext.of(context))
      expect(GLContext.of(context).getObjects().has(object)).toBeTruthy()
    })

    it('can get the wrapper of the given context and link the object to it', function () {
      const context = createWebGLContext()
      const wrapper = GLContext.of(context)
      wrapper.link = jest.fn(wrapper.link)

      const object = new GLObject(context)

      expect(object.context).toBe(wrapper)
      expect(wrapper.link).toHaveBeenCalledWith(object)
    })
  })

  describe('#destroy', function () {
    it('destroy the object and detach it from its context', function () {
      const wrapper = GLContext.of(createWebGLContext())
      wrapper.destroy = jest.fn(wrapper.link)

      const object = new GLObject(wrapper)

      expect(object.destroyed).toBeFalsy()

      object.destroy()

      expect(object.destroyed).toBeTruthy()
      expect(wrapper.destroy).toHaveBeenCalledWith(object)
    })

    it('throw an error if the object was already destroyed', function () {
      const wrapper = GLContext.of(createWebGLContext())
      const object = new GLObject(wrapper)

      object.destroy()
      expect(_ => object.destroy()).toThrow()
    })
  })
})
