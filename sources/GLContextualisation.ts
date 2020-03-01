import { GLResource } from './GLResource'
import { GLContext } from './GLContext'
import { Descriptor } from './Descriptor'

/**
* A resource that is the contextualisation of a descriptor.
*/
export class GLContextualisation<T extends Descriptor> extends GLResource {
  /**
  * The descriptor of this contextualisation.
  */
  public readonly descriptor : T

  /**
  * Timestamp of the last update of this contextualisation.
  */
  public timestamp : number

  /**
  * Create a contextualisation of a descriptor.
  *
  * @param descriptor - A descriptor to contextualise.
  * @param context - The context to associate.
  */
  public constructor (descriptor : T, context : GLContext) {
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
  public clone (context : GLContext) : GLContextualisation<T> {
    return new GLContextualisation(this.descriptor, context)
  }

  /**
  * @see GLResource.destroy
  */
  public destroy () : void {
    super.destroy()

    if (this.context.contextualisations.get(this.descriptor) === this) {
      this.context.contextualisations.delete(this.descriptor)
    }
  }

  /**
  * Update this contextualisation in regards of it's related descriptor.
  */
  public pull () : void {
    this.timestamp = Date.now()
  }
}
