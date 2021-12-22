/**
* Some resource description.
*/
export interface GLTDescriptor {
  /**
   * Copy a given descriptor.
   * 
   * @param toCopy - A descriptor to copy.
   */
  copy(toCopy: GLTDescriptor): void

  /**
   * Reset this descriptor to it's initial state.
   */
  clear(): void

  /**
   * @see Object.equals
   */
  equals(other: any): boolean
}

export namespace GLTDescriptor {
  /**
   * @see GLTDescriptor.clear
   */
  export function move(source: GLTDescriptor, destination: GLTDescriptor): GLTDescriptor {
    destination.copy(source)
    return destination
  }

  /**
   * @see GLTDescriptor.clear
   */
  export function clear(descriptor: GLTDescriptor): GLTDescriptor {
    descriptor.clear()
    return descriptor
  }

  /**
   * @see Object.equals
   */
  export function equals(left: undefined, right: null): false
  /**
   * @see Object.equals
   */
  export function equals(left: null, right: undefined): false
  /**
   * @see Object.equals
   */
  export function equals(left: null, right: null): true
  /**
   * @see Object.equals
   */
  export function equals(left: undefined, right: undefined): true
  /**
   * @see Object.equals
   */
  export function equals(left: GLTDescriptor, right: undefined): false
  /**
   * @see Object.equals
   */
  export function equals(left: GLTDescriptor, right: null): false
  /**
   * @see Object.equals
   */
  export function equals(left: null, right: GLTDescriptor): false
  /**
   * @see Object.equals
   */
  export function equals(left: undefined, right: GLTDescriptor): false
  /**
   * @see Object.equals
   */
  export function equals(left: GLTDescriptor, right: GLTDescriptor): boolean
  /**
   * @see Object.equals
   */
  export function equals(left: GLTDescriptor | undefined | null, right: GLTDescriptor | undefined | null): boolean
  export function equals(left: GLTDescriptor | undefined | null, right: GLTDescriptor | undefined | null): boolean {
    return left ? left.equals(right) : left === right
  }
}
