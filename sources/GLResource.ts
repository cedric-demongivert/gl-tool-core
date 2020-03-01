import { GLContext } from './GLContext'

/**
* A common class for all resources associated with a gl-tool context.
*/
export class GLResource {
  /**
  * The parent gl-tool context of this resource.
  */
  public readonly context : GLContext

  /**
  * The parent gl-tool context of this resource.
  */
  public readonly webgl : WebGLRenderingContext

  /**
  * Marker for released resources.
  */
  private _destroyed : boolean

  /**
  * Create a new engine object for a given context.
  *
  * @param {GLContext} context - A webgl context to associate with this object.
  */
  public constructor (context : GLContext) {
    this.context = context
    this.context.add(this)
    this.webgl = this.context.context

    this._destroyed = false
  }

  /**
  * Create a copy of this resource for the given context.
  *
  * @param context - A destination rendering context for the copy.
  *
  * @return A deep-copy of this resource into the given context.
  */
  public clone (context : GLContext) : GLResource {
    if (this._destroyed) {
      throw new Error(
        'Unable to clone this resource for the given context because this ' +
        'resource was already released.'
      )
    }

    return new GLResource(context)
  }

  /**
  * @Return True if this resource was already released.
  */
  public get destroyed () : boolean {
    return this._destroyed
  }

  /**
  * Release this resource from memory.
  */
  public destroy () : void {
    this._destroyed = true
    this.context.delete(this)
  }
}
