import { GLTDescriptor } from './GLTDescriptor'

/**
 * A resource in a context.
 */
export interface GLTResource {
  /**
   * The context in which this resource is defined.
   */
  readonly context: WebGLRenderingContext

  /**
   * Release this resource from it's context.
   */
  destroy(): void
}

/**
 * 
 */
export namespace GLTResource {
  /**
   * @see GLTResource.destroy
   */
  export function destroy(resource: GLTResource): void {
    resource.destroy()
  }
}