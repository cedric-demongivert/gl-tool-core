import { GLResource } from './GLResource'
import { GLContext } from './GLContext'
import { Descriptor } from './Descriptor'

/**
* A resource that is the contextualisation of a descriptor.
*/
export class GLContextualisation extends GLResource {
  /**
  * The descriptor of this contextualisation.
  */
  public readonly descriptor : Descriptor

  /**
  * Timestamp of the last update of this contextualisation.
  */
  public timestamp : number

  /**
  * Create a contextualisation of a descriptor.
  *
  * @param {Descriptor} descriptor - A descriptor to contextualise.
  * @param {GLContext} context - The context to associate.
  */
  public constructor (descriptor : Descriptor, context : GLContext) {
    if (context.contextualisations.has(descriptor)) {
      throw new Error(
        'Unable to instantiate a contextualisation of the given descriptor ' +
        'for the given context because the given descriptor was already ' +
        'contextualised in the given context.'
      )
    }

    super(context)

    this.descriptor = descriptor
    this.timestamp = Date.now()

    context.contextualisations.set(this.descriptor, this)
  }

  /**
  * @see GLResource.clone
  */
  public clone (context : GLContext) : GLContextualisation {
    return new GLContextualisation(this.descriptor, context)
  }

  /**
  * Update this contextualisation in regards of it's related descriptor.
  */
  public pull () : void {
    this.timestamp = Date.now()
  }
}
