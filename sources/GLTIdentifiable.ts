import { GLTIdentifier } from "./GLTIdentifier"
import { GLTRegister } from "./GLTRegister"

/**
 * 
 */
export interface GLTIdentifiable {
  /**
   * 
   */
  readonly identifier: GLTIdentifier
}

/**
 * 
 */
export namespace GLTIdentifiable {
  /**
   * 
   */
  export function create(register: GLTRegister<GLTIdentifiable>): GLTIdentifiable {
    const identifiable: any = { identifier: GLTIdentifier.NULL_IDENTIFIER }
    identifiable.identifier = register.add(identifiable)
    Object.freeze(identifiable)
    return identifiable
  }

  /**
   * 
   */
  export function identifier(identifiable: GLTIdentifiable | GLTIdentifier): GLTIdentifier
  /**
   * 
   */
  export function identifier(identifiable: undefined): undefined
  /**
   * 
   */
  export function identifier(identifiable: GLTIdentifiable | GLTIdentifier | undefined): GLTIdentifier | undefined
  export function identifier(identifiable: GLTIdentifiable | GLTIdentifier | undefined): GLTIdentifier | undefined {
    return typeof identifiable === 'number' ? identifiable : identifiable == undefined ? undefined : identifiable.identifier
  }
}