import { GLObject } from './GLObject'
import { GLContext } from './GLContext'

/**
* All contextualisations of this application keyed by context and descriptor.
**/
const APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT = new WeakMap()

/**
* All contextualisations of this application keyed by descriptor.
**/
const APPLICATION_CONTEXTUALISATIONS = new WeakMap()

/**
* An object that is the contextualisation of a descriptor.
*/
export class GLContextualisation extends GLObject {
  /**
  * Iterate over all contextualisation of a given descriptor.
  *
  * @param {Descriptor} descriptor - A descriptor instance.
  *
  * @return {Iterator<GLContextualisation>} An iterator that iterate over each contextualisation of a given descriptor.
  */
  static * all (descriptor) {
    yield * APPLICATION_CONTEXTUALISATIONS.get(descriptor)
  }

  /**
  * Return a the contextualisation of a descriptor for a given context.
  *
  * If the given descriptor was not contextualised yet, this method will
  * contextualise it with the given context and return the result.
  *
  * @param {WebGLRenderingContext|GLContext} context - A context to bound with the descriptor.
  * @param {Descriptor} descriptor - A descriptor instance to contextualise.
  *
  * @return {GLContextualisation} A contextualised instance of the given descriptor for the given context.
  */
  static ['of'] (context, descriptor) {
    const glcontext = GLContext.of(context)

    if (
      !APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.has(glcontext) ||
      !APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.get(glcontext)
                                                .has(descriptor)
    ) { descriptor.contextualise(glcontext) }

    return APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.get(glcontext)
                                                    .get(descriptor)
  }

  /**
  * Create a new contextualisation of a descriptor.
  *
  * @param {WebGLRenderingContext|GLContext} context - The context to associate.
  * @param {Descriptor} descriptor - A descriptor to contextualise.
  */
  constructor (context, descriptor) {
    if (
      APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.has(GLContext.of(context)) &&
      APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.get(GLContext.of(context)).has(descriptor)
    ) {
      throw new Error("Unable to contextualise an already contextualised descriptor.")
    }

    super(context)
    this._descriptor = descriptor

    if (!APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.has(this.context)) {
      APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.set(this.context, new WeakMap())
    }

    if (!APPLICATION_CONTEXTUALISATIONS.has(descriptor)) {
      APPLICATION_CONTEXTUALISATIONS.set(descriptor, new Set())
    }

    APPLICATION_CONTEXTUALISATIONS.get(descriptor).add(this)

    APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.get(this.context)
                                             .set(descriptor, this)
  }

  /**
  * Return the underlying descriptor instance.
  *
  * @return {Descriptor} The underlying descriptor instance.
  */
  get descriptor () {
    return this._descriptor
  }

  /**
  * @see GLObject#destroy
  */
  destroy () {
    APPLICATION_CONTEXTUALISATIONS_BY_CONTEXT.get(this.context)
                                             .delete(this._descriptor)

    APPLICATION_CONTEXTUALISATIONS.get(this._descriptor).delete(this)

    super.destroy()
  }
}
