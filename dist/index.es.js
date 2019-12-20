import { createElement, Children, cloneElement, createRef, Component } from 'react';
import Sortable$1 from 'sortablejs';
export { MultiDrag, Swap } from 'sortablejs';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * Removes the `node` from the DOM
 * @param node
 */
function removeNode(node) {
    if (node.parentElement !== null)
        node.parentElement.removeChild(node);
}
/**
 * Inserts the `newChild` node at the given index in a parent
 * @param parent The parent HTML Element.
 * @param newChild A HTML eement to add as a child of the parent.
 * @param index index of the parent to place the new child in.
 */
function insertNodeAt(parent, newChild, index) {
    var refChild = parent.children[index] || null;
    parent.insertBefore(newChild, refChild);
}
// todo:
// add `onSpilled` and other functions, if any, to this exclusion list
// they must also be handled by `ReactSortable.makeOptions`
/**
 * Removes the following group of properties from `props`,
 * leaving only `Sortable.Options` without any `on` methods.
 * @param props `ReactSortable.Props`
 */
function destructurePropsForOptions(props) {
    var 
    // react sortable props
    list = props.list, setList = props.setList, children = props.children, tag = props.tag, style = props.style, className = props.className, clone = props.clone, 
    // sortable options that have methods we want to overwrite
    onAdd = props.onAdd, onChange = props.onChange, onChoose = props.onChoose, onClone = props.onClone, onEnd = props.onEnd, onFilter = props.onFilter, onRemove = props.onRemove, onSort = props.onSort, onStart = props.onStart, onUnchoose = props.onUnchoose, onUpdate = props.onUpdate, onMove = props.onMove, onSpill = props.onSpill, onSelect = props.onSelect, onDeselect = props.onDeselect, options = __rest(props, ["list", "setList", "children", "tag", "style", "className", "clone", "onAdd", "onChange", "onChoose", "onClone", "onEnd", "onFilter", "onRemove", "onSort", "onStart", "onUnchoose", "onUpdate", "onMove", "onSpill", "onSelect", "onDeselect"]);
    return options;
}

/** Holds a global reference for which react element is being dragged */
var store = { dragging: null };
/**
 * React is built for synchornizing data with the browser.
 *
 * Data should be an object.
 */
var ReactSortable = /** @class */ (function (_super) {
    __extends(ReactSortable, _super);
    function ReactSortable(props) {
        var _this = _super.call(this, props) || this;
        /** @todo forward ref this component */
        _this.ref = createRef();
        var plugins = props.plugins;
        // mount plugins if any
        if (plugins) {
            if (Array.isArray(plugins))
                Sortable$1.mount.apply(Sortable$1, __spread(plugins));
            else
                Sortable$1.mount(plugins);
        }
        return _this;
    }
    ReactSortable.prototype.componentDidMount = function () {
        if (this.ref.current === null)
            return;
        var newOptions = this.makeOptions();
        Sortable$1.create(this.ref.current, newOptions);
    };
    ReactSortable.prototype.render = function () {
        var _a = this.props, tag = _a.tag, style = _a.style, className = _a.className, id = _a.id;
        var classicProps = { style: style, className: className, id: id };
        /** if no tag, default to a `div` element */
        var newTag = !tag || tag === null ? "div" : tag;
        return createElement(newTag, __assign({ 
            /** @todo find a way (perhaps with the callback) to allow AntD components to work */
            ref: this.ref }, classicProps), this.getChildren());
    };
    // dev provides the class names and the app will asign them do the dom properly
    ReactSortable.prototype.getChildren = function () {
        var _a = this.props, children = _a.children, dataIdAttr = _a.dataIdAttr, selectedClass = _a.selectedClass, chosenClass = _a.chosenClass, dragClass = _a.dragClass, fallbackClass = _a.fallbackClass, ghostClass = _a.ghostClass, swapClass = _a.swapClass;
        // if no children, don't do anything.
        if (!children || children == null)
            return null;
        var dataid = dataIdAttr || "data-id";
        return Children.map(children, function (child) {
            var _a;
            return cloneElement(child, (_a = {},
                _a[dataid] = child.key,
                _a));
        });
    };
    Object.defineProperty(ReactSortable.prototype, "sortable", {
        /** Appends the `sortable` property to this component */
        get: function () {
            var el = this.ref.current;
            if (el === null)
                return null;
            var key = Object.keys(el).find(function (k) { return k.includes("Sortable"); });
            if (!key)
                return null;
            //@ts-ignore - I know what I'm doing.
            return el[key];
        },
        enumerable: true,
        configurable: true
    });
    /** Converts all the props from `ReactSortable` into the `options` object that `Sortable.create(el, [options])` can use. */
    ReactSortable.prototype.makeOptions = function () {
        var _this = this;
        var DOMHandlers = [
            "onAdd",
            "onUpdate",
            "onRemove",
            "onStart",
            "onEnd",
            "onSpill",
            "onClone"
        ];
        var NonDOMHandlers = [
            "onUnchoose",
            "onChoose",
            "onFilter",
            "onSort",
            "onChange"
        ];
        var newOptions = destructurePropsForOptions(this.props);
        DOMHandlers.forEach(function (name) { return (newOptions[name] = _this.prepareOnHandlerPropAndDOM(name)); });
        NonDOMHandlers.forEach(function (name) { return (newOptions[name] = _this.prepareOnHandlerProp(name)); });
        /** onMove has 2 arguments and needs to be handled seperately. */
        var onMove = function (evt, originalEvt) {
            var onMove = _this.props.onMove;
            var defaultValue = evt.willInsertAfter || -1;
            if (!onMove)
                return defaultValue;
            return onMove(evt, originalEvt, _this.sortable, store) || defaultValue;
        };
        return __assign(__assign({}, newOptions), { onMove: onMove });
    };
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop & an `on[Handler]` ReactSortable method.  */
    ReactSortable.prototype.prepareOnHandlerPropAndDOM = function (evtName) {
        var _this = this;
        return function (evt) {
            // call the component prop
            _this.callOnHandlerProp(evt, evtName);
            // calls state change
            //@ts-ignore - until @types multidrag item is in
            _this[evtName](evt);
        };
    };
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop */
    ReactSortable.prototype.prepareOnHandlerProp = function (evtName) {
        var _this = this;
        return function (evt) {
            // call the component prop
            _this.callOnHandlerProp(evt, evtName);
        };
    };
    /** Calls the `props.on[Handler]` function */
    ReactSortable.prototype.callOnHandlerProp = function (evt, evtName) {
        var propEvent = this.props[evtName];
        if (propEvent)
            propEvent(evt, this.sortable, store);
    };
    // SORTABLE DOM HANDLING
    /** Called when an element is dropped into the list from another list */
    ReactSortable.prototype.onAdd = function (evt) {
        var _a = this.props, list = _a.list, setList = _a.setList;
        removeNode(evt.item);
        var newState = __spread(list);
        var newItem = store.dragging.props.list[evt.oldIndex];
        newState.splice(evt.newIndex, 0, newItem);
        setList(newState, this.sortable, store);
    };
    /** Called when an element is removed from the list into another list */
    ReactSortable.prototype.onRemove = function (evt) {
        var item = evt.item, from = evt.from, oldIndex = evt.oldIndex, clone = evt.clone, pullMode = evt.pullMode;
        insertNodeAt(from, item, oldIndex);
        var _a = this.props, list = _a.list, setList = _a.setList;
        var newState = __spread(list);
        if (pullMode === "clone") {
            removeNode(clone);
            var _b = __read(newState.splice(oldIndex, 1), 1), oldItem = _b[0];
            var newItem = this.props.clone(oldItem, evt);
            newState.splice(oldIndex, 0, newItem);
            setList(newState, this.sortable, store);
            return;
        }
        newState.splice(oldIndex, 1);
        setList(newState, this.sortable, store);
    };
    /** Called when sorting is changed within the same list */
    ReactSortable.prototype.onUpdate = function (evt) {
        var mode = (function () {
            if (evt.oldIndicies.length > 0)
                return "multidrag";
            if (evt.swapItem)
                return "swap";
            return "normal";
        })();
        switch (mode) {
            case "normal": {
                removeNode(evt.item);
                insertNodeAt(evt.from, evt.item, evt.oldIndex);
                var _a = this.props, list = _a.list, setList = _a.setList;
                var newState = __spread(list);
                var _b = __read(newState.splice(evt.oldIndex, 1), 1), oldItem = _b[0];
                newState.splice(evt.newIndex, 0, oldItem);
                return setList(newState, this.sortable, store);
            }
            case "swap": {
                // item that was dragged
                removeNode(evt.item);
                insertNodeAt(evt.from, evt.item, evt.oldIndex);
                // item that was landed on for the swap
                removeNode(evt.swapItem);
                insertNodeAt(evt.from, evt.swapItem, evt.newIndex);
                var _c = this.props, list = _c.list, setList = _c.setList;
                var newState_1 = __spread(list);
                var customs = [
                    {
                        element: evt.item,
                        oldIndex: evt.oldIndex,
                        newIndex: evt.newIndex
                    },
                    {
                        element: evt.swapItem,
                        oldIndex: evt.newIndex,
                        newIndex: evt.oldIndex
                    }
                ]
                    .map(function (curr) { return (__assign(__assign({}, curr), { item: newState_1[curr.oldIndex] })); })
                    .sort(function (a, b) { return a.oldIndex - b.oldIndex; });
                // DOM element management
                customs.forEach(function (curr) { return removeNode(curr.element); });
                customs.forEach(function (curr) {
                    return insertNodeAt(evt.from, curr.element, curr.oldIndex);
                });
                customs.reverse().forEach(function (curr) { return newState_1.splice(curr.oldIndex, 1); });
                customs.forEach(function (curr) { return newState_1.splice(curr.newIndex, 0, curr.item); });
                return setList(newState_1, this.sortable, store);
            }
            case "multidrag": {
                var newOldIndices = evt.oldIndicies.map(function (curr, index) { return ({
                    element: curr.multiDragElement,
                    oldIndex: curr.index,
                    newIndex: evt.newIndicies[index].index
                }); });
                // DOM element management
                newOldIndices.forEach(function (curr) { return removeNode(curr.element); });
                newOldIndices.forEach(function (curr) {
                    return insertNodeAt(evt.from, curr.element, curr.oldIndex);
                });
                var _d = this.props, list = _d.list, setList = _d.setList;
                var newState_2 = __spread(list);
                newOldIndices
                    // remove old items in state, starting from the end.
                    .reverse()
                    .map(function (curr) { return (__assign(__assign({}, curr), { item: newState_2.splice(curr.oldIndex, 1).pop() })); })
                    // insert new items, starting from the front.
                    .reverse()
                    .forEach(function (curr) {
                    newState_2.splice(curr.newIndex, 0, curr.item);
                });
                return setList(newState_2, this.sortable, store);
            }
        }
    };
    /** Called when the dragging starts */
    ReactSortable.prototype.onStart = function (evt) {
        store.dragging = this;
    };
    /** Called when the dragging ends */
    ReactSortable.prototype.onEnd = function (evt) {
        store.dragging = null;
    };
    /** Called when the `onSpill` plugin is activated */
    ReactSortable.prototype.onSpill = function (evt) {
        var _a = this.props, removeOnSpill = _a.removeOnSpill, revertOnSpill = _a.revertOnSpill;
        if (removeOnSpill && !revertOnSpill)
            removeNode(evt.item);
    };
    /** Called when a clone is made. It replaces an element in with a function */
    ReactSortable.prototype.onClone = function (evt) {
        // are we in the same list? if so, do nothing
    };
    /** @todo */
    ReactSortable.prototype.onSelect = function (evt) {
        var oldIndex = evt.oldIndex, newIndex = evt.newIndex;
        // append the class name the classes of the item
        // do it on the item?
        // a seperate state?
    };
    /** @todo */
    ReactSortable.prototype.onDeselect = function (evt) {
        // remove the clast name of the child
    };
    ReactSortable.defaultProps = {
        clone: function (item) { return item; },
        selectedClass: "sortable-selected"
    };
    return ReactSortable;
}(Component));

var Sortable = Sortable$1;

export { ReactSortable, Sortable };
