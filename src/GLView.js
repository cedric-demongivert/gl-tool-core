import { GLObject } from './GLObject'

export class GLView extends GLObject {
  /**
  * Create a new WebGLView
  *
  * @param {{document: Document, alpha: boolean, depth: boolean, stencil: boolean, antialias: boolean}} configuration - Options to use for construction.
  */
  constructor (configuration = {}) {
    const dom = configuration.document || document
    const element = dom.createElement('canvas')
    const context = GLView._getContext(element, Object.assign({
      alpha: true,
      depth: true,
      stencil: false,
      antialias: true
    }, configuration.options))

    super(context)

    this._element = element
    this._width = this._element.offsetWidth
    this._height = this._element.offsetHeight
  }

  /**
  * Extract a webgl context of a canvas.
  *
  * @param {DOMElement} canvas - Canvas to use for extraction.
  * @param {object} options - Options to pass to the getContext method.
  *
  * @return {WebGLRenderingContext} A webgl context.
  */
  static _getContext (canvas, options) {
    try {
      const context = canvas.getContext('webgl', options) ||
                      canvas.getContext('experimental-webgl', options)

      if (context && context instanceof window.WebGLRenderingContext) {
        return context
      } else {
        throw new Error([
          `Unnable to get a webgl context. Please check if your browser `,
          'support webgl or experimental-webgl.'
        ].join(''))
      }
    } catch (e) {
      throw new Error([
        `Unnable to get a webgl context. Please check if your browser `,
        'support webgl or experimental-webgl.'
      ].join(''))
    }
  }

  /**
  * @return {DOMELement} The view element.
  */
  get element () {
    return this._element
  }

  /**
  * @return {number} The width of the view in pixels.
  */
  get width () {
    return this._width
  }

  /**
  * @return {number} The height of the view in pixels.
  */
  get height () {
    return this._height
  }

  /**
  * @param {number} newWidth - The new width of the view in pixels.
  */
  set width (newWidth) {
    if (newWidth !== this._width) {
      this._element.width = newWidth
      this._width = newWidth
    }
  }

  /**
  * @param {number} newHeight - The new height of the view in pixels.
  */
  set height (newHeight) {
    if (newHeight !== this._height) {
      this._element.height = newHeight
      this._height = newHeight
    }
  }

  /**
  * Detach the view from its parent.
  */
  destroy () {
    this._element.parentNode.removeChild(this._element)
    super.destroy()
  }
}
