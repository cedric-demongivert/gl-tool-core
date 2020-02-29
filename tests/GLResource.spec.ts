/** eslint-env jest */

import { GLContext } from '../sources/GLContext'
import { GLResource } from '../sources/GLResource'
import { createWebGLContext } from './createWebGLContext'

describe('GLResource', function () {
  describe('#constructor', function () {
    it('create a new resource for a given context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      expect(resource.context).toBe(context)
      expect(context.resources).toEqual(new Set([resource]))
    })
  })

  describe('#destroy', function () {
    it('destroy the resource and detach it from its context', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      expect(resource.destroyed).toBeFalsy()
      expect(context.resources).toEqual(new Set([resource]))

      resource.destroy()

      expect(resource.destroyed).toBeTruthy()
      expect(context.resources).toEqual(new Set([]))
    })

    it('do nothing if the resource already destroyed', function () {
      const context : GLContext = new GLContext(createWebGLContext())
      const resource : GLResource = new GLResource(context)

      resource.destroy()
      resource.destroy()

      expect(resource.destroyed).toBeTruthy()
      expect(context.resources).toEqual(new Set([]))
    })
  })
})
