import { IdentifierSet, Pack } from "@cedric-demongivert/gl-tool-collection"
import { GLTIdentifiable } from "./GLTIdentifiable"
import { GLTIdentifier } from "./GLTIdentifier"

import { GLTRegister } from "./GLTRegister"

/**
 * 
 */
export class GLTSafeRegister<Element extends GLTIdentifiable> implements GLTRegister<Element> {
  /**
   * 
   */
  private readonly _identifiers: IdentifierSet

  /**
   * 
   */
  private readonly _elements: Pack<Element>

  /**
   * @see GLTRegister.capacity
   */
  public get capacity(): number {
    return this._identifiers.capacity
  }

  /**
   * @see GLTRegister.size
   */
  public get size(): number {
    return this._identifiers.size
  }

  /**
   * Allocate a new empty GLTSafeRegister with the requested capacity.
   * 
   * @param [capacity = 32] - The register to allocate.
   */
  public constructor(capacity: number = 32) {
    this._identifiers = IdentifierSet.allocate(capacity)
    this._elements = Pack.any(capacity)
  }

  /**
   * @see GLTRegister.identifiers
   */
  public * identifiers(): IterableIterator<GLTIdentifier> {
    yield* this._identifiers
  }

  /**
   * @see GLTRegister.values
   */
  public * values(): IterableIterator<Element> {
    yield* this._elements
  }

  /**
   * @see GLTRegister.reallocate
   */
  public reallocate(capacity: number): void {
    const elements: Pack<Element> = this._elements
    const identifiers: IdentifierSet = this._identifiers

    if (capacity < identifiers.capacity) {
      let removed: number = 0

      for (let index = 0, oldSize = identifiers.size; index < oldSize; ++index) {
        if (identifiers.get(index) < capacity) {
          elements.set(index - removed, elements.get(index))
        } else {
          removed += 1
        }
      }

      elements.size -= removed
    }

    elements.reallocate(capacity)
    identifiers.reallocate(capacity)
  }

  /**
   * @see GLTRegister.add
   */
  public add(element: Element): GLTIdentifier {
    const identifiers: IdentifierSet = this._identifiers
    const elements: Pack<Element> = this._elements

    if (element.identifier === GLTIdentifier.NULL_IDENTIFIER) {
      elements.push(element)
      return identifiers.next()
    }

    const index: number = identifiers.indexOf(element.identifier)

    if (index < 0) {
      identifiers.add(element.identifier)
      elements.push(element)
    } else {
      throw new Error(
        'Unable to register the given element identified as ' + element.identifier +
        ' because another element was already registered with the same identifier.'
      )
    }
  }

  /**
   * @see GLTRegister.delete
   */
  public delete(identifiable: GLTIdentifier | Element): Element | undefined {
    if (typeof identifiable === 'number') {
      return this.deleteByIdentifier(identifiable)
    } else {
      return this.deleteByValue(identifiable)
    }
  }

  /**
   * @see GLTRegister.deleteByIdentifier
   */
  public deleteByIdentifier(identifier: GLTIdentifier): Element | undefined {
    const identifiers: IdentifierSet = this._identifiers
    const elements: Pack<Element | undefined> = this._elements
    const index: number = identifiers.indexOf(identifier)

    if (index < 0) {
      return undefined
    }

    const deleted: Element = elements.get(index)

    identifiers.delete(identifier)
    elements.set(index, elements.pop())

    return deleted
  }

  /**
   * @see GLTRegister.deleteByValue
   */
  public deleteByValue(element: Element): Element | undefined {
    const identifiers: IdentifierSet = this._identifiers
    const elements: Pack<Element | undefined> = this._elements
    const index: number = identifiers.indexOf(element.identifier)

    if (index < 0 || elements.get(index) !== element) {
      return undefined
    }

    identifiers.delete(element.identifier)
    elements.set(index, elements.pop())

    return element
  }

  /**
   * @see GLTRegister.deleteNth
   */
  public deleteNth(index: number): Element | undefined {
    const identifiers: IdentifierSet = this._identifiers
    const elements: Pack<Element | undefined> = this._elements

    if (index < 0 || index > identifiers.size) {
      return undefined
    }

    const deleted: Element = elements.get(index)

    identifiers.delete(identifiers.get(index))
    elements.set(index, elements.pop())

    return deleted
  }

  /**
   * @see GLTRegister.get
   */
  public get(identifier: GLTIdentifier): Element | undefined {
    const identifiers: IdentifierSet = this._identifiers
    const index: number = identifiers.indexOf(identifier)

    if (index < 0) {
      return undefined
    }

    return this._elements.get(index)
  }

  /**
   * @see GLTRegister.nth
   */
  public nth(index: number): Element | undefined {
    const elements: Pack<Element | undefined> = this._elements

    if (index < 0 || index > elements.size) {
      return undefined
    }

    return elements.get(index)
  }

  /**
   * @see GLTRegister.has
   */
  public has(identifiable: GLTIdentifier | Element): boolean {
    if (typeof identifiable === 'number') {
      return this.hasIdentifier(identifiable)
    } else {
      return this.hasElement(identifiable)
    }
  }

  /**
   * @see GLTRegister.hasIdentifier
   */
  public hasIdentifier(identifier: number): boolean {
    return this._identifiers.has(identifier)
  }

  /**
   * @see GLTRegister.hasElement
   */
  public hasElement(element: Element): boolean {
    const index: number = this._identifiers.indexOf(element.identifier)
    return index < 0 || this._elements.get(index) === element
  }

  /**
   * @see GLTRegister.clear
   */
  public clear(): void {
    this._identifiers.clear()
    this._elements.clear()
  }

  /**
   * @see GLTRegister.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof GLTSafeRegister) {
      return GLTRegister.equals(this, other)
    }

    return false
  }

  /**
   * @see Symbol.Iterator
   */
  public *[Symbol.iterator](): IterableIterator<Element> {
    yield* this._elements
  }
}

/**
 * 
 */
export namespace GLTSafeRegister {
  /**
   * 
   */
  export function create<Element extends GLTIdentifiable>(capacity: number = 32): GLTSafeRegister<Element> {
    return new GLTSafeRegister(capacity)
  }
}