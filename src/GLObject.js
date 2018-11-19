import { GLContext } from './GLContext'

/**
* A common class for all objects associated with a webgl context.
*/
export class GLObject {
  /**
  * Create a new engine object for a given context.
  *
  * @param {WebGLRenderingContext|GLContext} context - A webgl context to associate with this object.
  */
  constructor (context) {
    this._context = GLContext.of(context)
    this._context.link(this)
  }

  /**
  * @return {GLContext} The context associated to this object.
  */
  get context () {
    return this._context
  }

  /**
  * @return {boolean} True if this object was destroyed and all of its resources was released.
  */
  get destroyed () {
    return this._context == null
  }

  /**
  * Destroy this object.
  *
  * @throws {Error} If this object instance was already destroyed.
  */
  destroy () {
    if (this._context != null) {
      const oldContext = this._context
      this._context = null
      oldContext.destroy(this)
    } else {
      throw new Error('Trying to destroy an already destroyed object.')
    }
  }
}
