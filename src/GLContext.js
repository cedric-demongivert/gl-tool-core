/**
* Store weak references over all webgl context wrapper that runs into
* this application.
*/
const APPLICATION_CONTEXTS = new WeakMap()

/**
* An engine wrapper over a webgl rendering context.
*/
export class GLContext {
  /**
  * Return the wrapper of a given context, or create it if the context does not have been wrapped yet.
  *
  * @param {GLContext|WebGLRenderingContext} context - An engine wrapper or a webgl rendering context to wrap.
  *
  * @return {GLContext} The wrapper of the given webgl rendering context or the given engine wrapper.
  */
  static ['of'] (context) {
    if (context instanceof GLContext) {
      return context
    } else {
      if (!APPLICATION_CONTEXTS.has(context)) {
        APPLICATION_CONTEXTS.set(context, new GLContext(context))
      }

      return APPLICATION_CONTEXTS.get(context)
    }
  }

  /**
  * Create a new wrapper for a given webgl rendering context.
  *
  * @param {WebGLRenderingContext} context - A webgl rendering context to wrap.
  */
  constructor (context) {
    this._context = context
    this._objects = new Set()
  }

  /**
  * @return {WebGLRenderingContext} The underlying webgl context.
  */
  get context () {
    return this._context
  }

  /**
  * @return {Set<GLObject>} All objects attached to this context.
  */
  getObjects () {
    return new Set(this._objects)
  }

  /**
  * @return {Iterator<GLObject>} An iterator over all objects attached to this context.
  */
  * objects () {
    yield * this._objects
  }

  /**
  * Register an engine object instance into this wrapper.
  *
  * The object instance to register must not be already destroyed and must have
  * been instanciated for this context.
  *
  * @param {GLObject} object - An object to register into this context.
  *
  * @throws {InvalidParameterError} If the given object was already destroyed.
  * @throws {InvalidParameterError} If the given object was not instanciated for this context.
  */
  link (object) {
    if (!this._objects.has(object)) {
      if (object.destroyed == false && object.context == this) {
        this._objects.add(object)
      } else {
        throw new Error(
          [
            'Unnable to register the given object into this context ',
            'because the given GLObject instance ',
            object.destroyed ? 'was already destroyed.'
                             : 'was not instanciated for this context.'
          ].join('')
        )
      }
    }
  }

  /**
  * Remove an object from this context and destroy it.
  *
  * @param {GLObject} object - An object instance to unregister and destroy.
  */
  destroy (object) {
    if (this._objects.has(object)) {
      this._objects.delete(object)
      if (!object.destroyed) object.destroy()
    }
  }

  /**
  * Clear this context of all of its objects.
  * This operation release all allocated resources.
  */
  clear () {
    for (const object of this._objects) {
      this.destroy(object)
    }
  }
}
