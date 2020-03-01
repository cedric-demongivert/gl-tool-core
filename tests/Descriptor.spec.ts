/** eslint-env jest */

import { Descriptor } from '../sources/Descriptor'
import { GLContext } from '../sources/GLContext'
import { GLContextualisation } from '../sources/GLContextualisation'

import { createWebGLContext } from './createWebGLContext'

describe('Descriptor', function () {
  describe('#commit', function () {
    it('is an alias of GLContextualisation.of', function () {
      const descriptor : Descriptor = new Descriptor()
      const contexts : GLContext[] = [
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext()),
        new GLContext(createWebGLContext())
      ]
      const contextualisations : GLContextualisation<Descriptor>[] = contexts.map(
        context => new GLContextualisation(descriptor, context)
      )

      const timestamps : number[] = contextualisations.map(
        contextualisation => contextualisation.timestamp
      )

      for (let index = 0; index < 80000; ++index) {}

      descriptor.commit()

      for (let index = 0, length = timestamps.length; index < length; ++index) {
        expect(
          contextualisations[index].timestamp
        ).toBeGreaterThan(timestamps[index])
      }
    })
  })
})
