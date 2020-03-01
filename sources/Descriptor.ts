import { GLContext } from './GLContext'
import { GLContextualisation } from './GLContextualisation'

/**
* Some resource description.
*/
export class Descriptor {
  /**
  * Update all existing contextualisation of this descriptor.
  */
  public commit () : void {
    for (const context of GLContext.all()) {
      const contextualisation : GLContextualisation<Descriptor> = context.contextualisation(this)

      if (contextualisation) {
        contextualisation.pull()
      }
    }
  }
}
