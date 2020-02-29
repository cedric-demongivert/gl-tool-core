import { GLResource } from './GLResource'
import { GLContextualisation } from './GLContextualisation'
import { Descriptor } from './Descriptor'

/**
* @ignore
*/
const CONTEXTS : Set<GLContext> = new Set<GLContext>()

/**
* A gl-tool context.
*/
export class GLContext {
  /**
  * The underlying webgl rendering context of this gl-tool context.
  */
  public readonly context : WebGLRenderingContext

  /**
  * A set with all gl-tool resources associated to this context.
  */
  public readonly resources : Set<GLResource>

  /**
  * All contextualisations associated to this context.
  */
  public readonly contextualisations : Map<Descriptor, GLContextualisation>

  /**
  * A marker for released contexts.
  */
  private _destroyed : boolean

  /**
  * Wrap the given webgl rendering context into a gl-tool context.
  *
  * @param context - A webgl rendering context to wrap.
  */
  public constructor (context : WebGLRenderingContext) {
    this.context = context
    this.resources = new Set<GLResource>()
    this.contextualisations = new Map<Descriptor, GLContextualisation>()
    this._destroyed = false

    CONTEXTS.add(this)
  }

  /**
  * @Return True if this context was already released.
  */
  public get destroyed () : boolean {
    return this._destroyed
  }

  /**
  * Add a gl-tool resource to this context.
  *
  * The resource instance to register must not be already released and must have
  * been instantiated for this context.
  *
  * @param object - A gl-tool resource to add to this context.
  *
  * @throws If the given resource was already destroyed.
  * @throws If the given resource was not instantiated for this context.
  */
  public add (resource : GLResource) : void {
    if (this._destroyed) {
      throw new Error(
        'Unable to add the given gl-tool resource to this gl-tool context ' +
        'because this gl-tool context was already released.'
      )
    }

    if (!this.resources.has(resource)) {
      if (resource.destroyed ) {
        throw new Error(
          'Unable to add the given gl-tool resource to this context ' +
          'because the given gl-tool resource was already released.'
        )
      } else {
        if (resource.context === this) {
          this.resources.add(resource)
        } else {
          throw new Error(
            'Unable to add the given gl-tool resource to this context ' +
            'because the given gl-tool resource was instantiated for another ' +
            'gl-tool context.'
          )
        }
      }
    }
  }

  /**
  * @return A deep copy of this gl-context instance.
  */
  public clone () : GLContext {
    if (this._destroyed) {
      throw new Error(
        'Unable to clone this gl-tool context because this gl-tool context ' +
        'was already released.'
      )
    }

    const result : GLContext = new GLContext(this.context)

    for (const resource of this.resources) {
      resource.clone(result)
    }

    return result
  }

  /**
  * Remove a gl-tool resource from this context and destroy it.
  *
  * @param resource - An object instance to remove from this context and destroy.
  */
  public delete (resource : GLResource) : void {
    if (this._destroyed) {
      throw new Error(
        'Unable to delete the given resource from this gl-tool context ' +
        'because this gl-tool context was already released.'
      )
    }

    this.resources.delete(resource)

    if (resource.destroyed === false) {
      resource.destroy()
    }
  }

  /**
  * Release all resources associated to this context.
  */
  public clear () : void {
    if (this._destroyed) {
      throw new Error(
        'Unable to clear this gl-tool context because this gl-tool context ' +
        'was already released.'
      )
    }

    for (const resource of this.resources) {
      this.delete(resource)
    }
  }

  /**
  * Release all resources associated to this context.
  */
  public destroy () : void {
    this.clear()

    CONTEXTS.delete(this)

    this._destroyed = true
  }
}

export namespace GLContext {
  /**
  * @return An iterable with all existing GLContext instances.
  */
  export function all () : Iterable<GLContext> {
    return CONTEXTS
  }
}
