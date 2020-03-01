/** eslint-env jest */

import { Descriptor } from '../sources/Descriptor'
import { GLContext } from '../sources/GLContext'
import { GLContextualisation } from '../sources/GLContextualisation'

import { createWebGLContext } from './createWebGLContext'

describe('Descriptor', function () {
  describe('#commit', function () {
    it('update all existing contextualisation of the given descriptor', function () {
      const descriptor : Descriptor = {} as Descriptor

      const contexts : GLContext[] = [
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext())
      ]

      const contextualisations : GLContextualisation<Descriptor>[] = contexts.map(
        context => new GLContextualisation(descriptor, context)
      )

      Descriptor.commit(descriptor)

      for (let index = 0, length = contexts.length; index < length; ++index) {
        expect(contextualisations[index].synchronized).toBeFalsy()
      }
    })
  })

  describe('#push', function () {
    it('update all existing contextualisation of the given descriptor', function () {
      const descriptor : Descriptor = {} as Descriptor

      const contexts : GLContext[] = [
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext())
      ]

      const contextualisations : GLContextualisation<Descriptor>[] = contexts.map(
        context => new GLContextualisation(descriptor, context)
      )

      Descriptor.commit(descriptor)
      Descriptor.push(descriptor)

      for (let index = 0, length = contexts.length; index < length; ++index) {
        expect(contextualisations[index].synchronized).toBeTruthy()
      }
    })
  })
})
