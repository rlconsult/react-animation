import Sortable, { SortableEvent, Options, MoveEvent } from "sortablejs";

import {
  ForwardRefExoticComponent,
  RefAttributes,
  ReactHTML,
  CSSProperties
} from "react";

import { ReactSortable } from "./react-sortable";

//@todo: remove dynamic types and create declarative types instead for readability of user.
// add these in docs as well
export interface ItemInterface {
  /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
  id: string | number;
  /** When true, the item is selected using MultiDrag */
  selected?: boolean;
  /** When true, the item is deemed "chosen", which basically just a mousedown event. */
  chosen?: boolean;
  /** When true, it will not be possible to pick this item up in the list. */
  filtered?: boolean;
  [property: string]: any;
}

export interface ReactSortableProps<T> extends ReactSortableOptions {
  /**
   * The list of items to use.
   */
  list: T[];
  /**
   * Sets the state for your list of items.
   */
  setList: (newState: T[], sortable: Sortable | null, store: Store) => void;
  /**
   * If parsing in a component WITHOUT a ref, an error will be thrown.
   *
   * To fix this, use the `forwardRef` component.
   *
   * @example
   * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button {...props} ref={ref} />)
   */
  tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML;
  style?: CSSProperties;
  className?: string;
  id?: string;
  /**
   * Parse the plugins you'd like to use in Sortable.
   */
  // @ts-ignore - pull request created for @types
  plugins?: Sortable.Plugin | Array<Sortable.Plugin>;
  /**
   * If this is provided, the function will replace the clone in place.
   *
   * When an is moved from `A` to `B` with `pull: 'clone'`,
   * the original element will be moved to `B`
   * and the new clone will be placed in `A`
   */
  clone?: (currentItem: T, evt: SortableEvent) => T;
}

/**
 * Holds the react component as a reference so we can access it's store.
 * 
 * Mainly used to access `props.list` within another components.
 */
export interface Store {
  dragging: null | ReactSortable<any>;
}

//
// TYPES FOR METHODS
//

// OPTIONS

/**
 * Change the `on[...]` methods in Sortable.Options,
 * so that they all have an extra arg that is `store: Store`
 */
export type ReactSortableOptions = Omit<Options, AllMethodNames> &
  Partial<
    Record<
      AllMethodsExceptMove,
      (evt: SortableEvent, sortable: Sortable | null, store: Store) => void
    >
  > & {
    /**
     * The default sortable behaviour has been changed.
     *
     * If the return value is void, then the defaults will kick in.
     * it saves the user trying to figure it out.
     * and they can just use onmove as a callback value
     */
    onMove?: (
      evt: MoveEvent,
      originalEvent: Event,
      sortable: Sortable | null,
      store: Store
    ) => boolean | -1 | 1 | void;
  };

// STRINGS

/** All method names starting with `on` in `Sortable.Options` */
export type AllMethodNames =
  | "onAdd"
  | "onChange"
  | "onChoose"
  | "onClone"
  | "onEnd"
  | "onFilter"
  | "onMove"
  | "onRemove"
  | "onSort"
  | "onSpill"
  | "onStart"
  | "onUnchoose"
  | "onUpdate"
  | "onSelect"
  | "onDeselect";

/** Method names that fire in `this`, when this is react-sortable */
export type HandledMethodNames =
  | "onAdd"
  | "onRemove"
  | "onUpdate"
  | "onStart"
  | "onEnd"
  | "onSpill"
  | "onSelect"
  | "onDeselect"
  | "onChoose"
  | "onUnchoose"

export type UnHandledMethodNames = Exclude<
  AllMethodsExceptMove,
  HandledMethodNames | "onMove"
>;

/**
 * Same as `SortableMethodKeys` type but with out the string `onMove`.
 */
export type AllMethodsExceptMove = Exclude<AllMethodNames, "onMove">;
