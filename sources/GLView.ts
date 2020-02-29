/**
* @ignore
*/
const DEFAULT_WEBGL_RENDERING_CONTEXT_CONFIGURATION : object = {
  alpha: true,
  depth: true,
  stencil: false,
  antialias: true
}

/**
* A webgl view.
*/
export class GLView {
  /**
  * The canvas associated to this view.
  */
  public readonly element : HTMLCanvasElement

  /**
  * The rendering context of this view.
  */
  public readonly context : WebGLRenderingContext

  /**
  * Create a new WebGLView
  *
  * @param configuration - Options to use for construction.
  */
  public constructor (configuration : GLView.Configuration = { document }) {
    const document : Document = configuration.document

    this.element = document.createElement('canvas')
    this.context = GLView.createContext(
      this.element,
      Object.assign({}, DEFAULT_WEBGL_RENDERING_CONTEXT_CONFIGURATION, {
        alpha: configuration.alpha,
        depth: configuration.depth,
        stencil: configuration.stencil,
        antialias: configuration.antialias
      })
    )
  }

  /**
  * @return The width of the view in pixels.
  */
  public get width () : number {
    return this.element.offsetWidth
  }

  /**
  * @return The height of the view in pixels.
  */
  public  get height () : number {
    return this.element.offsetHeight
  }

  /**
  * @param newWidth - The new width of the view in pixels.
  */
  public set width (newWidth : number) {
    this.element.width = newWidth
  }

  /**
  * @param newHeight - The new height of the view in pixels.
  */
  public set height (newHeight : number) {
    this.element.height = newHeight
  }
}

export namespace GLView {
  export type Configuration = {
    document?  : Document,
    alpha?     : boolean,
    depth?     : boolean,
    stencil?   : boolean,
    antialias? : boolean
  }

  export type WebGLContextConfiguration = {
    alpha?     : boolean,
    depth?     : boolean,
    stencil?   : boolean,
    antialias? : boolean
  }

  /**
  * Instantiate and return a new WebGLRenderingContext from the given canvas.
  *
  * @param canvas  - Parent canvas of the context to instantiate.
  * @param options - Options to use for instantiating the given webgl context.
  *
  * @return A new WebGLRenderingContext
  */
  export function createContext (canvas : HTMLCanvasElement, options : WebGLContextConfiguration) : WebGLRenderingContext {
    let context : any

    try {
      const context : any = (
        canvas.getContext('webgl', options) ||
        canvas.getContext('experimental-webgl', options)
      )
    } catch (exception) {
      throw new Error(
        'Unnable to get a webgl context. Please check if your browser ' +
        'support webgl or experimental-webgl.'
      )
    }

    if (context && context instanceof WebGLRenderingContext) {
      return context
    }

    throw new Error(
      'Unnable to get a webgl context. Please check if your browser ' +
      'support webgl or experimental-webgl.'
    )
  }
}
