import { GLTEmpty } from "./GLTEmpty"

/**
* A webgl view.
*/
export class GLTView {
  /**
  * The canvas associated to this view.
  */
  public readonly canvas: HTMLCanvasElement

  /**
  * The rendering context of this view.
  */
  public readonly context: WebGLRenderingContext

  /**
  * Create a new WebGLView
  *
  * @param [canvas = window.document.createElement('canvas')] - The canvas to use.
  * @param [configuration = GLTEmpty.OBJECT] - Options to use for construction.
  */
  public constructor(canvas: HTMLCanvasElement = window.document.createElement('canvas'), configuration: GLView.WebGLContextConfiguration = GLTEmpty.OBJECT) {
    this.canvas = canvas
    this.context = GLView.createContext(canvas, configuration)
  }

  /**
  * @return The width of the view in pixels.
  */
  public get width(): number {
    return this.canvas.offsetWidth
  }

  /**
  * @return The height of the view in pixels.
  */
  public get height(): number {
    return this.canvas.offsetHeight
  }

  /**
  * @param newWidth - The new width of the view in pixels.
  */
  public set width(newWidth: number) {
    this.canvas.width = newWidth
  }

  /**
  * @param newHeight - The new height of the view in pixels.
  */
  public set height(newHeight: number) {
    this.canvas.height = newHeight
  }
}

export namespace GLView {
  /**
   * 
   */
  export type WebGLContextConfiguration = {
    alpha?: boolean,
    depth?: boolean,
    stencil?: boolean,
    antialias?: boolean
  }

  /**
   * 
   */
  export const DEFAULT_WEBGL_RENDERING_CONTEXT_CONFIGURATION: Readonly<WebGLContextConfiguration> = Object.freeze({
    alpha: true,
    depth: true,
    stencil: false,
    antialias: true
  })

  /**
   * 
   */
  const WEBGL_RENDERING_CONTEXT_CONFIGURATION: WebGLContextConfiguration = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false
  }

  /**
  * Instantiate and return a new WebGLRenderingContext from the given canvas.
  *
  * @param canvas  - Parent canvas of the context to instantiate.
  * @param options - Options to use for instantiating the given webgl context.
  *
  * @return A new WebGLRenderingContext
  */
  export function createContext(canvas: HTMLCanvasElement, options: WebGLContextConfiguration): WebGLRenderingContext {
    let context: any

    const mergedOptions: WebGLContextConfiguration = Object.assign(
      WEBGL_RENDERING_CONTEXT_CONFIGURATION,
      DEFAULT_WEBGL_RENDERING_CONTEXT_CONFIGURATION,
      options
    )

    try {
      context = (
        canvas.getContext('webgl', mergedOptions) ||
        canvas.getContext('experimental-webgl', mergedOptions)
      )
    } catch (exception) {
      throw new Error(
        'Unnable to get a webgl context : ' + exception.message + '. ' +
        'Please check if your browser support webgl or experimental-webgl.'
      )
    }

    if (context) { return context }

    throw new Error(
      'Unnable to get a webgl context. Please check if your browser ' +
      'support webgl or experimental-webgl.'
    )
  }
}
