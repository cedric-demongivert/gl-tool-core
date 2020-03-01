import { GLContext } from './GLContext'
import { GLContextualisation } from './GLContextualisation'

/**
* Some resource description.
*/
export interface Descriptor {

}

export namespace Descriptor {
  /**
  * Update all existing contextualisation of the given descriptor.
  *
  * @param descriptor - A descriptor to commit.
  */
  export function commit<T extends Descriptor> (descriptor : T) : void {
    for (const context of GLContext.all()) {
      const contextualisation : GLContextualisation<T> = context.contextualisation(descriptor)

      if (contextualisation) {
        contextualisation.pull()
      }
    }
  }
}
