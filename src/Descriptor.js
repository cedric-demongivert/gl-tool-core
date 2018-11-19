import { GLContext } from './GLContext'
import { GLContextualisation } from './GLContextualisation'

/**
* Some engine object description.
*/
export class Descriptor {
  /**
  * Return a contextualisation of this descriptor.
  *
  * @param {WebGLRenderingContext|GLContext} context - A parent context.
  *
  * @return {GLContextualisation} The contextualisation of this descriptor for the given context.
  */
  contextualisation (context) {
    return GLContextualisation.of(context, this)
  }

  /**
  * Contextualise this descriptor and return the result.
  *
  * @param {WebGLRenderingContext|GLContext} context - A parent context.
  *
  * @return {GLContextualisation} A contextualisation of this descriptor.
  */
  contextualise (context) {
    return new GLContextualisation(context, this)
  }
}
