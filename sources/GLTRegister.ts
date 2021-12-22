import { GLTIdentifiable } from "./GLTIdentifiable"
import { GLTIdentifier } from "./GLTIdentifier"
import { GLTSafeRegister } from "./GLTSafeRegister"
import { GLTUnsafeRegister } from "./GLTUnsafeRegister"

/**
 * 
 */
export interface GLTRegister<Element extends GLTIdentifiable> extends Iterable<Element> {
  /**
   * The number of pre-allocated elements of this register.
   */
  readonly capacity: number

  /**
   * The number of element in this register.
   */
  readonly size: number

  /**
   * @return An iterator over all identifiers in this register.
   */
  identifiers(): IterableIterator<GLTIdentifier>

  /**
   * @return An iterator over all elements in this register.
   */
  values(): IterableIterator<Element>

  /**
   * Reallocate this register.
   * 
   * @param capacity - The new capacity of this register.
   */
  reallocate(capacity: number): void

  /**
   * Add an identifiable element to this register.
   * 
   * If the given element does not have an identifier (i.e, has an identifier equal to GLTIdentifier.NULL_IDENTIFIER), 
   * this method will assign it to an available one and then return the allocated identifier. The identifiable element 
   * MUST update itself by self-assigning the returned identifier.
   * 
   * If the given element already has an identifier, this method will assign it to the requested one.
   * 
   * A call to this method will throw an error if the element to add declare an identifier that is already in use.
   * 
   * If this register is at full capacity, a call to this method will reallocate it.
   * 
   * @param element - An identifiable element to add.
   * 
   * @throws If an element with the same identifier was already registered.
   */
  add(element: Element): GLTIdentifier

  /**
   * Delete an element from this register.
   * 
   * If the parameter is an identifier, this method will delete the related element if it exists.
   * 
   * If the parameter is an identifiable element, this register will delete the related entry if and only
   * if the instances are both strictly equals.
   * 
   * @param identifiable - The identifier of the entry to delete, or the instance to delete.
   * 
   * @return The identifiable element that was deleted.
   */
  delete(identifiable: GLTIdentifier | Element): Element | undefined

  /**
   * Return an element of this register by using it's identifier.
   * 
   * @param identifier - The identifier of the element to get.
   * 
   * @return The element if exists, undefined otherwise.
   */
  get(identifier: GLTIdentifier): Element | undefined

  /**
   * Return an element of this register by using it's index.
   * 
   * @param identifier - The identifier of the element to get.
   * 
   * @return The element if exists, undefined otherwise.
   */
  nth(index: number): Element | undefined

  /**
   * Check if an element exists in this register.
   * 
   * If the parameter is an identifier, this method will check if the given identifier
   * is used.
   * 
   * If the parameter is an instance of identifiable element, this method will check if both
   * the identifier is used, and the registered instance is strictly equal to the given one.
   * 
   * @param identifiable - An identifier or an identifiable element to search for.
   * 
   * @return True if the requested element exists into this register, false otherwise.
   */
  has(identifiable: GLTIdentifier | Element): boolean

  /**
   * Empty this register.
   */
  clear(): void

  /**
   * @see Object.equals
   */
  equals(other: any): boolean
}

/**
 * 
 */
export namespace GLTRegister {
  /**
   * 
   */
  export function equals(left: GLTRegister<any>, right: GLTRegister<any>): boolean {
    if (left.size !== right.size) {
      return false
    }

    for (const element of left.values()) {
      if (!right.has(element)) {
        return false
      }
    }

    return true
  }

  /**
   * 
   */
  export const create: typeof GLTSafeRegister.create = GLTSafeRegister.create

  /**
   * 
   */
  export const safe: typeof GLTSafeRegister.create = GLTSafeRegister.create

  /**
   * 
   */
  export const unsafe: typeof GLTUnsafeRegister.create = GLTUnsafeRegister.create
}