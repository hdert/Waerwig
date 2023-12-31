
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire7e2d"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire7e2d"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("eS6uK", function(module, exports) {




/*!
  * Bootstrap base-component.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("93XC1")), (parcelRequire("8TXdu")), (parcelRequire("aWkXD")), (parcelRequire("gIBQD")));
})(module.exports, function(Data, EventHandler, Config, index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const VERSION = "5.3.2";
    /**
   * Class definition
   */ class BaseComponent extends Config {
        constructor(element, config){
            super();
            element = index_js.getElement(element);
            if (!element) return;
            this._element = element;
            this._config = this._getConfig(config);
            Data.set(this._element, this.constructor.DATA_KEY, this);
        }
        // Public
        dispose() {
            Data.remove(this._element, this.constructor.DATA_KEY);
            EventHandler.off(this._element, this.constructor.EVENT_KEY);
            for (const propertyName of Object.getOwnPropertyNames(this))this[propertyName] = null;
        }
        _queueCallback(callback, element, isAnimated = true) {
            index_js.executeAfterTransition(callback, element, isAnimated);
        }
        _getConfig(config) {
            config = this._mergeConfigObj(config, this._element);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
        }
        // Static
        static getInstance(element) {
            return Data.get(index_js.getElement(element), this.DATA_KEY);
        }
        static getOrCreateInstance(element, config = {}) {
            return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
        }
        static get VERSION() {
            return VERSION;
        }
        static get DATA_KEY() {
            return `bs.${this.NAME}`;
        }
        static get EVENT_KEY() {
            return `.${this.DATA_KEY}`;
        }
        static eventName(name) {
            return `${name}${this.EVENT_KEY}`;
        }
    }
    return BaseComponent;
});

});
parcelRegister("93XC1", function(module, exports) {
/*!
  * Bootstrap data.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const elementMap = new Map();
    const data = {
        set (element, key, instance) {
            if (!elementMap.has(element)) elementMap.set(element, new Map());
            const instanceMap = elementMap.get(element);
            // make it clear we only want one instance per element
            // can be removed later when multiple key/instances are fine to be used
            if (!instanceMap.has(key) && instanceMap.size !== 0) {
                // eslint-disable-next-line no-console
                console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
                return;
            }
            instanceMap.set(key, instance);
        },
        get (element, key) {
            if (elementMap.has(element)) return elementMap.get(element).get(key) || null;
            return null;
        },
        remove (element, key) {
            if (!elementMap.has(element)) return;
            const instanceMap = elementMap.get(element);
            instanceMap.delete(key);
            // free up element references if there are no instances left for an element
            if (instanceMap.size === 0) elementMap.delete(element);
        }
    };
    return data;
});

});

parcelRegister("8TXdu", function(module, exports) {

/*!
  * Bootstrap event-handler.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("gIBQD")));
})(module.exports, function(index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
    let uidEvent = 1;
    const customEvents = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    const nativeEvents = new Set([
        "click",
        "dblclick",
        "mouseup",
        "mousedown",
        "contextmenu",
        "mousewheel",
        "DOMMouseScroll",
        "mouseover",
        "mouseout",
        "mousemove",
        "selectstart",
        "selectend",
        "keydown",
        "keypress",
        "keyup",
        "orientationchange",
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
        "pointerdown",
        "pointermove",
        "pointerup",
        "pointerleave",
        "pointercancel",
        "gesturestart",
        "gesturechange",
        "gestureend",
        "focus",
        "blur",
        "change",
        "reset",
        "select",
        "submit",
        "focusin",
        "focusout",
        "load",
        "unload",
        "beforeunload",
        "resize",
        "move",
        "DOMContentLoaded",
        "readystatechange",
        "error",
        "abort",
        "scroll"
    ]);
    /**
   * Private methods
   */ function makeEventUid(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
    function getElementEvents(element) {
        const uid = makeEventUid(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
    }
    function bootstrapHandler(element, fn) {
        return function handler(event) {
            hydrateObj(event, {
                delegateTarget: element
            });
            if (handler.oneOff) EventHandler.off(element, event.type, fn);
            return fn.apply(element, [
                event
            ]);
        };
    }
    function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event) {
            const domElements = element.querySelectorAll(selector);
            for(let { target: target } = event; target && target !== this; target = target.parentNode)for (const domElement of domElements){
                if (domElement !== target) continue;
                hydrateObj(event, {
                    delegateTarget: target
                });
                if (handler.oneOff) EventHandler.off(element, event.type, selector, fn);
                return fn.apply(target, [
                    event
                ]);
            }
        };
    }
    function findHandler(events, callable, delegationSelector = null) {
        return Object.values(events).find((event)=>event.callable === callable && event.delegationSelector === delegationSelector);
    }
    function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
        const isDelegated = typeof handler === "string";
        // TODO: tooltip passes `false` instead of selector, so we need to check
        const callable = isDelegated ? delegationFunction : handler || delegationFunction;
        let typeEvent = getTypeEvent(originalTypeEvent);
        if (!nativeEvents.has(typeEvent)) typeEvent = originalTypeEvent;
        return [
            isDelegated,
            callable,
            typeEvent
        ];
    }
    function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
        if (typeof originalTypeEvent !== "string" || !element) return;
        let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
        // this prevents the handler from being dispatched the same way as mouseover or mouseout does
        if (originalTypeEvent in customEvents) {
            const wrapFunction = (fn)=>{
                return function(event) {
                    if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) return fn.call(this, event);
                };
            };
            callable = wrapFunction(callable);
        }
        const events = getElementEvents(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
        if (previousFunction) {
            previousFunction.oneOff = previousFunction.oneOff && oneOff;
            return;
        }
        const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
        const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
        fn.delegationSelector = isDelegated ? handler : null;
        fn.callable = callable;
        fn.oneOff = oneOff;
        fn.uidEvent = uid;
        handlers[uid] = fn;
        element.addEventListener(typeEvent, fn, isDelegated);
    }
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) return;
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
    }
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        for (const [handlerKey, event] of Object.entries(storeElementEvent))if (handlerKey.includes(namespace)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
    function getTypeEvent(event) {
        // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
        event = event.replace(stripNameRegex, "");
        return customEvents[event] || event;
    }
    const EventHandler = {
        on (element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, false);
        },
        one (element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, true);
        },
        off (element, originalTypeEvent, handler, delegationFunction) {
            if (typeof originalTypeEvent !== "string" || !element) return;
            const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
            const inNamespace = typeEvent !== originalTypeEvent;
            const events = getElementEvents(element);
            const storeElementEvent = events[typeEvent] || {};
            const isNamespace = originalTypeEvent.startsWith(".");
            if (typeof callable !== "undefined") {
                // Simplest case: handler is passed, remove that listener ONLY.
                if (!Object.keys(storeElementEvent).length) return;
                removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
                return;
            }
            if (isNamespace) for (const elementEvent of Object.keys(events))removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            for (const [keyHandlers, event] of Object.entries(storeElementEvent)){
                const handlerKey = keyHandlers.replace(stripUidRegex, "");
                if (!inNamespace || originalTypeEvent.includes(handlerKey)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
        },
        trigger (element, event, args) {
            if (typeof event !== "string" || !element) return null;
            const $ = index_js.getjQuery();
            const typeEvent = getTypeEvent(event);
            const inNamespace = event !== typeEvent;
            let jQueryEvent = null;
            let bubbles = true;
            let nativeDispatch = true;
            let defaultPrevented = false;
            if (inNamespace && $) {
                jQueryEvent = $.Event(event, args);
                $(element).trigger(jQueryEvent);
                bubbles = !jQueryEvent.isPropagationStopped();
                nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
                defaultPrevented = jQueryEvent.isDefaultPrevented();
            }
            const evt = hydrateObj(new Event(event, {
                bubbles: bubbles,
                cancelable: true
            }), args);
            if (defaultPrevented) evt.preventDefault();
            if (nativeDispatch) element.dispatchEvent(evt);
            if (evt.defaultPrevented && jQueryEvent) jQueryEvent.preventDefault();
            return evt;
        }
    };
    function hydrateObj(obj, meta = {}) {
        for (const [key, value] of Object.entries(meta))try {
            obj[key] = value;
        } catch (_unused) {
            Object.defineProperty(obj, key, {
                configurable: true,
                get () {
                    return value;
                }
            });
        }
        return obj;
    }
    return EventHandler;
});

});
parcelRegister("gIBQD", function(module, exports) {
/*!
  * Bootstrap index.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    factory(module.exports);
})(module.exports, function(exports1) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = "transitionend";
    /**
   * Properly escape IDs selectors to handle weird IDs
   * @param {string} selector
   * @returns {string}
   */ const parseSelector = (selector)=>{
        if (selector && window.CSS && window.CSS.escape) // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
        selector = selector.replace(/#([^\s"#']+)/g, (match, id)=>`#${CSS.escape(id)}`);
        return selector;
    };
    // Shout-out Angus Croll (https://goo.gl/pxwQGp)
    const toType = (object)=>{
        if (object === null || object === undefined) return `${object}`;
        return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    /**
   * Public Util API
   */ const getUID = (prefix)=>{
        do prefix += Math.floor(Math.random() * MAX_UID);
        while (document.getElementById(prefix));
        return prefix;
    };
    const getTransitionDurationFromElement = (element)=>{
        if (!element) return 0;
        // Get transition-duration of the element
        let { transitionDuration: transitionDuration, transitionDelay: transitionDelay } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay);
        // Return 0 if element or transition duration is not found
        if (!floatTransitionDuration && !floatTransitionDelay) return 0;
        // If multiple durations are defined, take the first
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
    const triggerTransitionEnd = (element)=>{
        element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = (object)=>{
        if (!object || typeof object !== "object") return false;
        if (typeof object.jquery !== "undefined") object = object[0];
        return typeof object.nodeType !== "undefined";
    };
    const getElement = (object)=>{
        // it's a jQuery object or a node element
        if (isElement(object)) return object.jquery ? object[0] : object;
        if (typeof object === "string" && object.length > 0) return document.querySelector(parseSelector(object));
        return null;
    };
    const isVisible = (element)=>{
        if (!isElement(element) || element.getClientRects().length === 0) return false;
        const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
        // Handle `details` element as its content may falsie appear visible when it is closed
        const closedDetails = element.closest("details:not([open])");
        if (!closedDetails) return elementIsVisible;
        if (closedDetails !== element) {
            const summary = element.closest("summary");
            if (summary && summary.parentNode !== closedDetails) return false;
            if (summary === null) return false;
        }
        return elementIsVisible;
    };
    const isDisabled = (element)=>{
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
        if (element.classList.contains("disabled")) return true;
        if (typeof element.disabled !== "undefined") return element.disabled;
        return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
    };
    const findShadowRoot = (element)=>{
        if (!document.documentElement.attachShadow) return null;
        // Can find the shadow root otherwise it'll return the document
        if (typeof element.getRootNode === "function") {
            const root = element.getRootNode();
            return root instanceof ShadowRoot ? root : null;
        }
        if (element instanceof ShadowRoot) return element;
        // when we don't find a shadow root
        if (!element.parentNode) return null;
        return findShadowRoot(element.parentNode);
    };
    const noop = ()=>{};
    /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */ const reflow = (element)=>{
        element.offsetHeight; // eslint-disable-line no-unused-expressions
    };
    const getjQuery = ()=>{
        if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) return window.jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback)=>{
        if (document.readyState === "loading") {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener("DOMContentLoaded", ()=>{
                for (const callback of DOMContentLoadedCallbacks)callback();
            });
            DOMContentLoadedCallbacks.push(callback);
        } else callback();
    };
    const isRTL = ()=>document.documentElement.dir === "rtl";
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    const execute = (possibleCallback, args = [], defaultValue = possibleCallback)=>{
        return typeof possibleCallback === "function" ? possibleCallback(...args) : defaultValue;
    };
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true)=>{
        if (!waitForTransition) {
            execute(callback);
            return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({ target: target })=>{
            if (target !== transitionElement) return;
            called = true;
            transitionElement.removeEventListener(TRANSITION_END, handler);
            execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(()=>{
            if (!called) triggerTransitionEnd(transitionElement);
        }, emulatedDuration);
    };
    /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */ const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed)=>{
        const listLength = list.length;
        let index = list.indexOf(activeElement);
        // if the element does not exist in the list return an element
        // depending on the direction and if cycle is allowed
        if (index === -1) return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) index = (index + listLength) % listLength;
        return list[Math.max(0, Math.min(index, listLength - 1))];
    };
    exports1.defineJQueryPlugin = defineJQueryPlugin;
    exports1.execute = execute;
    exports1.executeAfterTransition = executeAfterTransition;
    exports1.findShadowRoot = findShadowRoot;
    exports1.getElement = getElement;
    exports1.getNextActiveElement = getNextActiveElement;
    exports1.getTransitionDurationFromElement = getTransitionDurationFromElement;
    exports1.getUID = getUID;
    exports1.getjQuery = getjQuery;
    exports1.isDisabled = isDisabled;
    exports1.isElement = isElement;
    exports1.isRTL = isRTL;
    exports1.isVisible = isVisible;
    exports1.noop = noop;
    exports1.onDOMContentLoaded = onDOMContentLoaded;
    exports1.parseSelector = parseSelector;
    exports1.reflow = reflow;
    exports1.toType = toType;
    exports1.triggerTransitionEnd = triggerTransitionEnd;
    Object.defineProperty(exports1, Symbol.toStringTag, {
        value: "Module"
    });
});

});


parcelRegister("aWkXD", function(module, exports) {


/*!
  * Bootstrap config.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("dSqna")), (parcelRequire("gIBQD")));
})(module.exports, function(Manipulator, index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap util/config.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Class definition
   */ class Config {
        // Getters
        static get Default() {
            return {};
        }
        static get DefaultType() {
            return {};
        }
        static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!');
        }
        _getConfig(config) {
            config = this._mergeConfigObj(config);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
        }
        _configAfterMerge(config) {
            return config;
        }
        _mergeConfigObj(config, element) {
            const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {}; // try to parse
            return {
                ...this.constructor.Default,
                ...typeof jsonConfig === "object" ? jsonConfig : {},
                ...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
                ...typeof config === "object" ? config : {}
            };
        }
        _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
            for (const [property, expectedTypes] of Object.entries(configTypes)){
                const value = config[property];
                const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
                if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
            }
        }
    }
    return Config;
});

});
parcelRegister("dSqna", function(module, exports) {
/*!
  * Bootstrap manipulator.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ function normalizeData(value) {
        if (value === "true") return true;
        if (value === "false") return false;
        if (value === Number(value).toString()) return Number(value);
        if (value === "" || value === "null") return null;
        if (typeof value !== "string") return value;
        try {
            return JSON.parse(decodeURIComponent(value));
        } catch (_unused) {
            return value;
        }
    }
    function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, (chr)=>`-${chr.toLowerCase()}`);
    }
    const Manipulator = {
        setDataAttribute (element, key, value) {
            element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute (element, key) {
            element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes (element) {
            if (!element) return {};
            const attributes = {};
            const bsKeys = Object.keys(element.dataset).filter((key)=>key.startsWith("bs") && !key.startsWith("bsConfig"));
            for (const key of bsKeys){
                let pureKey = key.replace(/^bs/, "");
                pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
                attributes[pureKey] = normalizeData(element.dataset[key]);
            }
            return attributes;
        },
        getDataAttribute (element, key) {
            return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        }
    };
    return Manipulator;
});

});



parcelRegister("aCidq", function(module, exports) {







/*!
  * Bootstrap tooltip.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("9sODO")), (parcelRequire("eS6uK")), (parcelRequire("8TXdu")), (parcelRequire("dSqna")), (parcelRequire("gIBQD")), (parcelRequire("f04Wu")), (parcelRequire("fuTre")));
})(module.exports, function(Popper, BaseComponent, EventHandler, Manipulator, index_js, sanitizer_js, TemplateFactory) {
    "use strict";
    function _interopNamespaceDefault(e) {
        const n = Object.create(null, {
            [Symbol.toStringTag]: {
                value: "Module"
            }
        });
        if (e) {
            for(const k in e)if (k !== "default") {
                const d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: ()=>e[k]
                });
            }
        }
        n.default = e;
        return Object.freeze(n);
    }
    const Popper__namespace = /*#__PURE__*/ _interopNamespaceDefault(Popper);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const NAME = "tooltip";
    const DISALLOWED_ATTRIBUTES = new Set([
        "sanitize",
        "allowList",
        "sanitizeFn"
    ]);
    const CLASS_NAME_FADE = "fade";
    const CLASS_NAME_MODAL = "modal";
    const CLASS_NAME_SHOW = "show";
    const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
    const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    const EVENT_MODAL_HIDE = "hide.bs.modal";
    const TRIGGER_HOVER = "hover";
    const TRIGGER_FOCUS = "focus";
    const TRIGGER_CLICK = "click";
    const TRIGGER_MANUAL = "manual";
    const EVENT_HIDE = "hide";
    const EVENT_HIDDEN = "hidden";
    const EVENT_SHOW = "show";
    const EVENT_SHOWN = "shown";
    const EVENT_INSERTED = "inserted";
    const EVENT_CLICK = "click";
    const EVENT_FOCUSIN = "focusin";
    const EVENT_FOCUSOUT = "focusout";
    const EVENT_MOUSEENTER = "mouseenter";
    const EVENT_MOUSELEAVE = "mouseleave";
    const AttachmentMap = {
        AUTO: "auto",
        TOP: "top",
        RIGHT: index_js.isRTL() ? "left" : "right",
        BOTTOM: "bottom",
        LEFT: index_js.isRTL() ? "right" : "left"
    };
    const Default = {
        allowList: sanitizer_js.DefaultAllowlist,
        animation: true,
        boundary: "clippingParents",
        container: false,
        customClass: "",
        delay: 0,
        fallbackPlacements: [
            "top",
            "right",
            "bottom",
            "left"
        ],
        html: false,
        offset: [
            0,
            6
        ],
        placement: "top",
        popperConfig: null,
        sanitize: true,
        sanitizeFn: null,
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        title: "",
        trigger: "hover focus"
    };
    const DefaultType = {
        allowList: "object",
        animation: "boolean",
        boundary: "(string|element)",
        container: "(string|element|boolean)",
        customClass: "(string|function)",
        delay: "(number|object)",
        fallbackPlacements: "array",
        html: "boolean",
        offset: "(array|string|function)",
        placement: "(string|function)",
        popperConfig: "(null|object|function)",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        selector: "(string|boolean)",
        template: "string",
        title: "(string|element|function)",
        trigger: "string"
    };
    /**
   * Class definition
   */ class Tooltip extends BaseComponent {
        constructor(element, config){
            if (typeof Popper__namespace === "undefined") throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
            super(element, config);
            // Private
            this._isEnabled = true;
            this._timeout = 0;
            this._isHovered = null;
            this._activeTrigger = {};
            this._popper = null;
            this._templateFactory = null;
            this._newContent = null;
            // Protected
            this.tip = null;
            this._setListeners();
            if (!this._config.selector) this._fixTitle();
        }
        // Getters
        static get Default() {
            return Default;
        }
        static get DefaultType() {
            return DefaultType;
        }
        static get NAME() {
            return NAME;
        }
        // Public
        enable() {
            this._isEnabled = true;
        }
        disable() {
            this._isEnabled = false;
        }
        toggleEnabled() {
            this._isEnabled = !this._isEnabled;
        }
        toggle() {
            if (!this._isEnabled) return;
            this._activeTrigger.click = !this._activeTrigger.click;
            if (this._isShown()) {
                this._leave();
                return;
            }
            this._enter();
        }
        dispose() {
            clearTimeout(this._timeout);
            EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
            if (this._element.getAttribute("data-bs-original-title")) this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title"));
            this._disposePopper();
            super.dispose();
        }
        show() {
            if (this._element.style.display === "none") throw new Error("Please use show on visible elements");
            if (!(this._isWithContent() && this._isEnabled)) return;
            const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW));
            const shadowRoot = index_js.findShadowRoot(this._element);
            const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
            if (showEvent.defaultPrevented || !isInTheDom) return;
            // TODO: v6 remove this or make it optional
            this._disposePopper();
            const tip = this._getTipElement();
            this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
            const { container: container } = this._config;
            if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
                container.append(tip);
                EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
            }
            this._popper = this._createPopper(tip);
            tip.classList.add(CLASS_NAME_SHOW);
            // If this is a touch-enabled device we add extra
            // empty mouseover listeners to the body's immediate children;
            // only needed because of broken event delegation on iOS
            // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
            if ("ontouchstart" in document.documentElement) for (const element of [].concat(...document.body.children))EventHandler.on(element, "mouseover", index_js.noop);
            const complete = ()=>{
                EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN));
                if (this._isHovered === false) this._leave();
                this._isHovered = false;
            };
            this._queueCallback(complete, this.tip, this._isAnimated());
        }
        hide() {
            if (!this._isShown()) return;
            const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE));
            if (hideEvent.defaultPrevented) return;
            const tip = this._getTipElement();
            tip.classList.remove(CLASS_NAME_SHOW);
            // If this is a touch-enabled device we remove the extra
            // empty mouseover listeners we added for iOS support
            if ("ontouchstart" in document.documentElement) for (const element of [].concat(...document.body.children))EventHandler.off(element, "mouseover", index_js.noop);
            this._activeTrigger[TRIGGER_CLICK] = false;
            this._activeTrigger[TRIGGER_FOCUS] = false;
            this._activeTrigger[TRIGGER_HOVER] = false;
            this._isHovered = null; // it is a trick to support manual triggering
            const complete = ()=>{
                if (this._isWithActiveTrigger()) return;
                if (!this._isHovered) this._disposePopper();
                this._element.removeAttribute("aria-describedby");
                EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN));
            };
            this._queueCallback(complete, this.tip, this._isAnimated());
        }
        update() {
            if (this._popper) this._popper.update();
        }
        // Protected
        _isWithContent() {
            return Boolean(this._getTitle());
        }
        _getTipElement() {
            if (!this.tip) this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
            return this.tip;
        }
        _createTipElement(content) {
            const tip = this._getTemplateFactory(content).toHtml();
            // TODO: remove this check in v6
            if (!tip) return null;
            tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
            // TODO: v6 the following can be achieved with CSS only
            tip.classList.add(`bs-${this.constructor.NAME}-auto`);
            const tipId = index_js.getUID(this.constructor.NAME).toString();
            tip.setAttribute("id", tipId);
            if (this._isAnimated()) tip.classList.add(CLASS_NAME_FADE);
            return tip;
        }
        setContent(content) {
            this._newContent = content;
            if (this._isShown()) {
                this._disposePopper();
                this.show();
            }
        }
        _getTemplateFactory(content) {
            if (this._templateFactory) this._templateFactory.changeContent(content);
            else this._templateFactory = new TemplateFactory({
                ...this._config,
                content: // the `content` var has to be after `this._config`
                // to override config.content in case of popover
                content,
                extraClass: this._resolvePossibleFunction(this._config.customClass)
            });
            return this._templateFactory;
        }
        _getContentForTemplate() {
            return {
                [SELECTOR_TOOLTIP_INNER]: this._getTitle()
            };
        }
        _getTitle() {
            return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
        }
        // Private
        _initializeOnDelegatedTarget(event) {
            return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
        }
        _isAnimated() {
            return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE);
        }
        _isShown() {
            return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW);
        }
        _createPopper(tip) {
            const placement = index_js.execute(this._config.placement, [
                this,
                tip,
                this._element
            ]);
            const attachment = AttachmentMap[placement.toUpperCase()];
            return Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
        _getOffset() {
            const { offset: offset } = this._config;
            if (typeof offset === "string") return offset.split(",").map((value)=>Number.parseInt(value, 10));
            if (typeof offset === "function") return (popperData)=>offset(popperData, this._element);
            return offset;
        }
        _resolvePossibleFunction(arg) {
            return index_js.execute(arg, [
                this._element
            ]);
        }
        _getPopperConfig(attachment) {
            const defaultBsPopperConfig = {
                placement: attachment,
                modifiers: [
                    {
                        name: "flip",
                        options: {
                            fallbackPlacements: this._config.fallbackPlacements
                        }
                    },
                    {
                        name: "offset",
                        options: {
                            offset: this._getOffset()
                        }
                    },
                    {
                        name: "preventOverflow",
                        options: {
                            boundary: this._config.boundary
                        }
                    },
                    {
                        name: "arrow",
                        options: {
                            element: `.${this.constructor.NAME}-arrow`
                        }
                    },
                    {
                        name: "preSetPlacement",
                        enabled: true,
                        phase: "beforeMain",
                        fn: (data)=>{
                            // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
                            // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
                            this._getTipElement().setAttribute("data-popper-placement", data.state.placement);
                        }
                    }
                ]
            };
            return {
                ...defaultBsPopperConfig,
                ...index_js.execute(this._config.popperConfig, [
                    defaultBsPopperConfig
                ])
            };
        }
        _setListeners() {
            const triggers = this._config.trigger.split(" ");
            for (const trigger of triggers){
                if (trigger === "click") EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK), this._config.selector, (event)=>{
                    const context = this._initializeOnDelegatedTarget(event);
                    context.toggle();
                });
                else if (trigger !== TRIGGER_MANUAL) {
                    const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN);
                    const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT);
                    EventHandler.on(this._element, eventIn, this._config.selector, (event)=>{
                        const context = this._initializeOnDelegatedTarget(event);
                        context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
                        context._enter();
                    });
                    EventHandler.on(this._element, eventOut, this._config.selector, (event)=>{
                        const context = this._initializeOnDelegatedTarget(event);
                        context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
                        context._leave();
                    });
                }
            }
            this._hideModalHandler = ()=>{
                if (this._element) this.hide();
            };
            EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
        }
        _fixTitle() {
            const title = this._element.getAttribute("title");
            if (!title) return;
            if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) this._element.setAttribute("aria-label", title);
            this._element.setAttribute("data-bs-original-title", title); // DO NOT USE IT. Is only for backwards compatibility
            this._element.removeAttribute("title");
        }
        _enter() {
            if (this._isShown() || this._isHovered) {
                this._isHovered = true;
                return;
            }
            this._isHovered = true;
            this._setTimeout(()=>{
                if (this._isHovered) this.show();
            }, this._config.delay.show);
        }
        _leave() {
            if (this._isWithActiveTrigger()) return;
            this._isHovered = false;
            this._setTimeout(()=>{
                if (!this._isHovered) this.hide();
            }, this._config.delay.hide);
        }
        _setTimeout(handler, timeout) {
            clearTimeout(this._timeout);
            this._timeout = setTimeout(handler, timeout);
        }
        _isWithActiveTrigger() {
            return Object.values(this._activeTrigger).includes(true);
        }
        _getConfig(config) {
            const dataAttributes = Manipulator.getDataAttributes(this._element);
            for (const dataAttribute of Object.keys(dataAttributes))if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) delete dataAttributes[dataAttribute];
            config = {
                ...dataAttributes,
                ...typeof config === "object" && config ? config : {}
            };
            config = this._mergeConfigObj(config);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
        }
        _configAfterMerge(config) {
            config.container = config.container === false ? document.body : index_js.getElement(config.container);
            if (typeof config.delay === "number") config.delay = {
                show: config.delay,
                hide: config.delay
            };
            if (typeof config.title === "number") config.title = config.title.toString();
            if (typeof config.content === "number") config.content = config.content.toString();
            return config;
        }
        _getDelegateConfig() {
            const config = {};
            for (const [key, value] of Object.entries(this._config))if (this.constructor.Default[key] !== value) config[key] = value;
            config.selector = false;
            config.trigger = "manual";
            // In the future can be replaced with:
            // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
            // `Object.fromEntries(keysWithDifferentValues)`
            return config;
        }
        _disposePopper() {
            if (this._popper) {
                this._popper.destroy();
                this._popper = null;
            }
            if (this.tip) {
                this.tip.remove();
                this.tip = null;
            }
        }
        // Static
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Tooltip.getOrCreateInstance(this, config);
                if (typeof config !== "string") return;
                if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
                data[config]();
            });
        }
    }
    /**
   * jQuery
   */ index_js.defineJQueryPlugin(Tooltip);
    return Tooltip;
});

});
parcelRegister("9sODO", function(module, exports) {

$parcel$export(module.exports, "popperGenerator", () => (parcelRequire("8yRgr")).popperGenerator);
$parcel$export(module.exports, "detectOverflow", () => (parcelRequire("fq1Ka")).default);
$parcel$export(module.exports, "createPopperBase", () => (parcelRequire("8yRgr")).createPopper);
$parcel$export(module.exports, "createPopper", () => (parcelRequire("e2LKo")).createPopper);
$parcel$export(module.exports, "createPopperLite", () => (parcelRequire("aIwMe")).createPopper);

var $3ZIUY = parcelRequire("3ZIUY");

var $jqodc = parcelRequire("jqodc");

var $8yRgr = parcelRequire("8yRgr");
var $fq1Ka = parcelRequire("fq1Ka");

var $e2LKo = parcelRequire("e2LKo");

var $aIwMe = parcelRequire("aIwMe");
$parcel$exportWildcard(module.exports, $3ZIUY);
$parcel$exportWildcard(module.exports, $jqodc);

});
parcelRegister("3ZIUY", function(module, exports) {

$parcel$export(module.exports, "top", () => $2e89e95ac593bfb0$export$1e95b668f3b82d);
$parcel$export(module.exports, "bottom", () => $2e89e95ac593bfb0$export$40e543e69a8b3fbb);
$parcel$export(module.exports, "right", () => $2e89e95ac593bfb0$export$79ffe56a765070d2);
$parcel$export(module.exports, "left", () => $2e89e95ac593bfb0$export$eabcd2c8791e7bf4);
$parcel$export(module.exports, "auto", () => $2e89e95ac593bfb0$export$dfb5619354ba860);
$parcel$export(module.exports, "basePlacements", () => $2e89e95ac593bfb0$export$aec2ce47c367b8c3);
$parcel$export(module.exports, "start", () => $2e89e95ac593bfb0$export$b3571188c770cc5a);
$parcel$export(module.exports, "end", () => $2e89e95ac593bfb0$export$bd5df0f255a350f8);
$parcel$export(module.exports, "clippingParents", () => $2e89e95ac593bfb0$export$390fd549c5303b4d);
$parcel$export(module.exports, "viewport", () => $2e89e95ac593bfb0$export$d7b7311ec04a3e8f);
$parcel$export(module.exports, "popper", () => $2e89e95ac593bfb0$export$ae5ab1c730825774);
$parcel$export(module.exports, "reference", () => $2e89e95ac593bfb0$export$ca50aac9f3ba507f);
$parcel$export(module.exports, "variationPlacements", () => $2e89e95ac593bfb0$export$368f9a87e87fa4e1);
$parcel$export(module.exports, "placements", () => $2e89e95ac593bfb0$export$803cd8101b6c182b);
$parcel$export(module.exports, "beforeRead", () => $2e89e95ac593bfb0$export$421679a7c3d56e);
$parcel$export(module.exports, "read", () => $2e89e95ac593bfb0$export$aafa59e2e03f2942);
$parcel$export(module.exports, "afterRead", () => $2e89e95ac593bfb0$export$6964f6c886723980);
$parcel$export(module.exports, "beforeMain", () => $2e89e95ac593bfb0$export$c65e99957a05207c);
$parcel$export(module.exports, "main", () => $2e89e95ac593bfb0$export$f22da7240b7add18);
$parcel$export(module.exports, "afterMain", () => $2e89e95ac593bfb0$export$bab79516f2d662fe);
$parcel$export(module.exports, "beforeWrite", () => $2e89e95ac593bfb0$export$8d4d2d70e7d46032);
$parcel$export(module.exports, "write", () => $2e89e95ac593bfb0$export$68d8715fc104d294);
$parcel$export(module.exports, "afterWrite", () => $2e89e95ac593bfb0$export$70a6e5159acce2e6);
$parcel$export(module.exports, "modifierPhases", () => $2e89e95ac593bfb0$export$d087d3878fdf71d5);
var $2e89e95ac593bfb0$export$1e95b668f3b82d = "top";
var $2e89e95ac593bfb0$export$40e543e69a8b3fbb = "bottom";
var $2e89e95ac593bfb0$export$79ffe56a765070d2 = "right";
var $2e89e95ac593bfb0$export$eabcd2c8791e7bf4 = "left";
var $2e89e95ac593bfb0$export$dfb5619354ba860 = "auto";
var $2e89e95ac593bfb0$export$aec2ce47c367b8c3 = [
    $2e89e95ac593bfb0$export$1e95b668f3b82d,
    $2e89e95ac593bfb0$export$40e543e69a8b3fbb,
    $2e89e95ac593bfb0$export$79ffe56a765070d2,
    $2e89e95ac593bfb0$export$eabcd2c8791e7bf4
];
var $2e89e95ac593bfb0$export$b3571188c770cc5a = "start";
var $2e89e95ac593bfb0$export$bd5df0f255a350f8 = "end";
var $2e89e95ac593bfb0$export$390fd549c5303b4d = "clippingParents";
var $2e89e95ac593bfb0$export$d7b7311ec04a3e8f = "viewport";
var $2e89e95ac593bfb0$export$ae5ab1c730825774 = "popper";
var $2e89e95ac593bfb0$export$ca50aac9f3ba507f = "reference";
var $2e89e95ac593bfb0$export$368f9a87e87fa4e1 = /*#__PURE__*/ $2e89e95ac593bfb0$export$aec2ce47c367b8c3.reduce(function(acc, placement) {
    return acc.concat([
        placement + "-" + $2e89e95ac593bfb0$export$b3571188c770cc5a,
        placement + "-" + $2e89e95ac593bfb0$export$bd5df0f255a350f8
    ]);
}, []);
var $2e89e95ac593bfb0$export$803cd8101b6c182b = /*#__PURE__*/ [].concat($2e89e95ac593bfb0$export$aec2ce47c367b8c3, [
    $2e89e95ac593bfb0$export$dfb5619354ba860
]).reduce(function(acc, placement) {
    return acc.concat([
        placement,
        placement + "-" + $2e89e95ac593bfb0$export$b3571188c770cc5a,
        placement + "-" + $2e89e95ac593bfb0$export$bd5df0f255a350f8
    ]);
}, []); // modifiers that need to read the DOM
var $2e89e95ac593bfb0$export$421679a7c3d56e = "beforeRead";
var $2e89e95ac593bfb0$export$aafa59e2e03f2942 = "read";
var $2e89e95ac593bfb0$export$6964f6c886723980 = "afterRead"; // pure-logic modifiers
var $2e89e95ac593bfb0$export$c65e99957a05207c = "beforeMain";
var $2e89e95ac593bfb0$export$f22da7240b7add18 = "main";
var $2e89e95ac593bfb0$export$bab79516f2d662fe = "afterMain"; // modifier with the purpose to write to the DOM (or write into a framework state)
var $2e89e95ac593bfb0$export$8d4d2d70e7d46032 = "beforeWrite";
var $2e89e95ac593bfb0$export$68d8715fc104d294 = "write";
var $2e89e95ac593bfb0$export$70a6e5159acce2e6 = "afterWrite";
var $2e89e95ac593bfb0$export$d087d3878fdf71d5 = [
    $2e89e95ac593bfb0$export$421679a7c3d56e,
    $2e89e95ac593bfb0$export$aafa59e2e03f2942,
    $2e89e95ac593bfb0$export$6964f6c886723980,
    $2e89e95ac593bfb0$export$c65e99957a05207c,
    $2e89e95ac593bfb0$export$f22da7240b7add18,
    $2e89e95ac593bfb0$export$bab79516f2d662fe,
    $2e89e95ac593bfb0$export$8d4d2d70e7d46032,
    $2e89e95ac593bfb0$export$68d8715fc104d294,
    $2e89e95ac593bfb0$export$70a6e5159acce2e6
];

});

parcelRegister("jqodc", function(module, exports) {

$parcel$export(module.exports, "applyStyles", () => (parcelRequire("g8OEA")).default);
$parcel$export(module.exports, "arrow", () => (parcelRequire("7b3sC")).default);
$parcel$export(module.exports, "computeStyles", () => (parcelRequire("3daoF")).default);
$parcel$export(module.exports, "eventListeners", () => (parcelRequire("jZBtg")).default);
$parcel$export(module.exports, "flip", () => (parcelRequire("45jb7")).default);
$parcel$export(module.exports, "hide", () => (parcelRequire("iZmmk")).default);
$parcel$export(module.exports, "offset", () => (parcelRequire("e0EP7")).default);
$parcel$export(module.exports, "popperOffsets", () => (parcelRequire("i4AAK")).default);
$parcel$export(module.exports, "preventOverflow", () => (parcelRequire("lDwp4")).default);

var $g8OEA = parcelRequire("g8OEA");

var $7b3sC = parcelRequire("7b3sC");

var $3daoF = parcelRequire("3daoF");

var $jZBtg = parcelRequire("jZBtg");

var $45jb7 = parcelRequire("45jb7");

var $iZmmk = parcelRequire("iZmmk");

var $e0EP7 = parcelRequire("e0EP7");

var $i4AAK = parcelRequire("i4AAK");

var $lDwp4 = parcelRequire("lDwp4");

});
parcelRegister("g8OEA", function(module, exports) {

$parcel$export(module.exports, "default", () => $bc04af748f55319c$export$2e2bcd8739ae039);

var $eyTVg = parcelRequire("eyTVg");

var $d6xDx = parcelRequire("d6xDx");
// and applies them to the HTMLElements such as popper and arrow
function $bc04af748f55319c$var$applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements
        if (!(0, $d6xDx.isHTMLElement)(element) || !(0, $eyTVg.default)(element)) return;
         // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(name) {
            var value = attributes[name];
            if (value === false) element.removeAttribute(name);
            else element.setAttribute(name, value === true ? "" : value);
        });
    });
}
function $bc04af748f55319c$var$effect(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
        popper: {
            position: state.options.strategy,
            left: "0",
            top: "0",
            margin: "0"
        },
        arrow: {
            position: "absolute"
        },
        reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
    return function() {
        Object.keys(state.elements).forEach(function(name) {
            var element = state.elements[name];
            var attributes = state.attributes[name] || {};
            var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them
            var style = styleProperties.reduce(function(style, property) {
                style[property] = "";
                return style;
            }, {}); // arrow is optional + virtual elements
            if (!(0, $d6xDx.isHTMLElement)(element) || !(0, $eyTVg.default)(element)) return;
            Object.assign(element.style, style);
            Object.keys(attributes).forEach(function(attribute) {
                element.removeAttribute(attribute);
            });
        });
    };
} // eslint-disable-next-line import/no-unused-modules
var $bc04af748f55319c$export$2e2bcd8739ae039 = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: $bc04af748f55319c$var$applyStyles,
    effect: $bc04af748f55319c$var$effect,
    requires: [
        "computeStyles"
    ]
};

});
parcelRegister("eyTVg", function(module, exports) {

$parcel$export(module.exports, "default", () => $a99f9ebca3ba2730$export$2e2bcd8739ae039);
function $a99f9ebca3ba2730$export$2e2bcd8739ae039(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
}

});

parcelRegister("d6xDx", function(module, exports) {

$parcel$export(module.exports, "isElement", () => $98a5ed6e9cc93b6b$export$45a5e7f76e0caa8d);
$parcel$export(module.exports, "isHTMLElement", () => $98a5ed6e9cc93b6b$export$1b3bfaa9684536aa);
$parcel$export(module.exports, "isShadowRoot", () => $98a5ed6e9cc93b6b$export$af51f0f06c0f328a);

var $4bJEZ = parcelRequire("4bJEZ");
function $98a5ed6e9cc93b6b$export$45a5e7f76e0caa8d(node) {
    var OwnElement = (0, $4bJEZ.default)(node).Element;
    return node instanceof OwnElement || node instanceof Element;
}
function $98a5ed6e9cc93b6b$export$1b3bfaa9684536aa(node) {
    var OwnElement = (0, $4bJEZ.default)(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
}
function $98a5ed6e9cc93b6b$export$af51f0f06c0f328a(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === "undefined") return false;
    var OwnElement = (0, $4bJEZ.default)(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
}

});
parcelRegister("4bJEZ", function(module, exports) {

$parcel$export(module.exports, "default", () => $30cb9ba4921cb24c$export$2e2bcd8739ae039);
function $30cb9ba4921cb24c$export$2e2bcd8739ae039(node) {
    if (node == null) return window;
    if (node.toString() !== "[object Window]") {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
}

});



parcelRegister("7b3sC", function(module, exports) {

$parcel$export(module.exports, "default", () => $539c3eb46bc0c50d$export$2e2bcd8739ae039);

var $eJ303 = parcelRequire("eJ303");

var $jNRCw = parcelRequire("jNRCw");

var $ellK5 = parcelRequire("ellK5");

var $kefRd = parcelRequire("kefRd");

var $wPDJ2 = parcelRequire("wPDJ2");

var $9N2WV = parcelRequire("9N2WV");

var $2bVTQ = parcelRequire("2bVTQ");

var $3a0dK = parcelRequire("3a0dK");

var $3ZIUY = parcelRequire("3ZIUY");
var $539c3eb46bc0c50d$var$toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
        placement: state.placement
    })) : padding;
    return (0, $2bVTQ.default)(typeof padding !== "number" ? padding : (0, $3a0dK.default)(padding, (0, $3ZIUY.basePlacements)));
};
function $539c3eb46bc0c50d$var$arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = (0, $eJ303.default)(state.placement);
    var axis = (0, $wPDJ2.default)(basePlacement);
    var isVertical = [
        (0, $3ZIUY.left),
        (0, $3ZIUY.right)
    ].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets) return;
    var paddingObject = $539c3eb46bc0c50d$var$toPaddingObject(options.padding, state);
    var arrowRect = (0, $jNRCw.default)(arrowElement);
    var minProp = axis === "y" ? (0, $3ZIUY.top) : (0, $3ZIUY.left);
    var maxProp = axis === "y" ? (0, $3ZIUY.bottom) : (0, $3ZIUY.right);
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = (0, $kefRd.default)(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds
    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = (0, $9N2WV.within)(min, center, max); // Prevents breaking syntax highlighting...
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function $539c3eb46bc0c50d$var$effect(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) return;
     // CSS selector
    if (typeof arrowElement === "string") {
        arrowElement = state.elements.popper.querySelector(arrowElement);
        if (!arrowElement) return;
    }
    if (!(0, $ellK5.default)(state.elements.popper, arrowElement)) return;
    state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules
var $539c3eb46bc0c50d$export$2e2bcd8739ae039 = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: $539c3eb46bc0c50d$var$arrow,
    effect: $539c3eb46bc0c50d$var$effect,
    requires: [
        "popperOffsets"
    ],
    requiresIfExists: [
        "preventOverflow"
    ]
};

});
parcelRegister("eJ303", function(module, exports) {

$parcel$export(module.exports, "default", () => $ab879862a948a1f3$export$2e2bcd8739ae039);

function $ab879862a948a1f3$export$2e2bcd8739ae039(placement) {
    return placement.split("-")[0];
}

});

parcelRegister("jNRCw", function(module, exports) {

$parcel$export(module.exports, "default", () => $e6ac2fccfcb26231$export$2e2bcd8739ae039);

var $fBOtw = parcelRequire("fBOtw");
function $e6ac2fccfcb26231$export$2e2bcd8739ae039(element) {
    var clientRect = (0, $fBOtw.default)(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
    if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
    return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
    };
}

});
parcelRegister("fBOtw", function(module, exports) {

$parcel$export(module.exports, "default", () => $b5d1770c17971102$export$2e2bcd8739ae039);

var $d6xDx = parcelRequire("d6xDx");

var $iABBo = parcelRequire("iABBo");

var $4bJEZ = parcelRequire("4bJEZ");

var $efR9v = parcelRequire("efR9v");
function $b5d1770c17971102$export$2e2bcd8739ae039(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) includeScale = false;
    if (isFixedStrategy === void 0) isFixedStrategy = false;
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && (0, $d6xDx.isHTMLElement)(element)) {
        scaleX = element.offsetWidth > 0 ? (0, $iABBo.round)(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? (0, $iABBo.round)(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = (0, $d6xDx.isElement)(element) ? (0, $4bJEZ.default)(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !(0, $efR9v.default)() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
    };
}

});
parcelRegister("iABBo", function(module, exports) {

$parcel$export(module.exports, "max", () => $d888c1c5c6139f87$export$8960430cfd85939f);
$parcel$export(module.exports, "min", () => $d888c1c5c6139f87$export$96ec731ed4dcb222);
$parcel$export(module.exports, "round", () => $d888c1c5c6139f87$export$2077e0241d6afd3c);
var $d888c1c5c6139f87$export$8960430cfd85939f = Math.max;
var $d888c1c5c6139f87$export$96ec731ed4dcb222 = Math.min;
var $d888c1c5c6139f87$export$2077e0241d6afd3c = Math.round;

});

parcelRegister("efR9v", function(module, exports) {

$parcel$export(module.exports, "default", () => $a60bb2598aca78b6$export$2e2bcd8739ae039);

var $d5oVj = parcelRequire("d5oVj");
function $a60bb2598aca78b6$export$2e2bcd8739ae039() {
    return !/^((?!chrome|android).)*safari/i.test((0, $d5oVj.default)());
}

});
parcelRegister("d5oVj", function(module, exports) {

$parcel$export(module.exports, "default", () => $986f133e6bcd73d6$export$2e2bcd8739ae039);
function $986f133e6bcd73d6$export$2e2bcd8739ae039() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map(function(item) {
        return item.brand + "/" + item.version;
    }).join(" ");
    return navigator.userAgent;
}

});




parcelRegister("ellK5", function(module, exports) {

$parcel$export(module.exports, "default", () => $a713e46d1a16fece$export$2e2bcd8739ae039);

var $d6xDx = parcelRequire("d6xDx");
function $a713e46d1a16fece$export$2e2bcd8739ae039(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method
    if (parent.contains(child)) return true;
    else if (rootNode && (0, $d6xDx.isShadowRoot)(rootNode)) {
        var next = child;
        do {
            if (next && parent.isSameNode(next)) return true;
             // $FlowFixMe[prop-missing]: need a better way to handle this...
            next = next.parentNode || next.host;
        }while (next);
    } // Give up, the result is false
    return false;
}

});

parcelRegister("kefRd", function(module, exports) {

$parcel$export(module.exports, "default", () => $eba16a63ee488722$export$2e2bcd8739ae039);

var $4bJEZ = parcelRequire("4bJEZ");

var $eyTVg = parcelRequire("eyTVg");

var $cNC5V = parcelRequire("cNC5V");

var $d6xDx = parcelRequire("d6xDx");

var $1mZNr = parcelRequire("1mZNr");

var $88D2t = parcelRequire("88D2t");

var $d5oVj = parcelRequire("d5oVj");
function $eba16a63ee488722$var$getTrueOffsetParent(element) {
    if (!(0, $d6xDx.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
    (0, $cNC5V.default)(element).position === "fixed") return null;
    return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block
function $eba16a63ee488722$var$getContainingBlock(element) {
    var isFirefox = /firefox/i.test((0, $d5oVj.default)());
    var isIE = /Trident/i.test((0, $d5oVj.default)());
    if (isIE && (0, $d6xDx.isHTMLElement)(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = (0, $cNC5V.default)(element);
        if (elementCss.position === "fixed") return null;
    }
    var currentNode = (0, $88D2t.default)(element);
    if ((0, $d6xDx.isShadowRoot)(currentNode)) currentNode = currentNode.host;
    while((0, $d6xDx.isHTMLElement)(currentNode) && [
        "html",
        "body"
    ].indexOf((0, $eyTVg.default)(currentNode)) < 0){
        var css = (0, $cNC5V.default)(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
        if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || [
            "transform",
            "perspective"
        ].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode;
        else currentNode = currentNode.parentNode;
    }
    return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
function $eba16a63ee488722$export$2e2bcd8739ae039(element) {
    var window = (0, $4bJEZ.default)(element);
    var offsetParent = $eba16a63ee488722$var$getTrueOffsetParent(element);
    while(offsetParent && (0, $1mZNr.default)(offsetParent) && (0, $cNC5V.default)(offsetParent).position === "static")offsetParent = $eba16a63ee488722$var$getTrueOffsetParent(offsetParent);
    if (offsetParent && ((0, $eyTVg.default)(offsetParent) === "html" || (0, $eyTVg.default)(offsetParent) === "body" && (0, $cNC5V.default)(offsetParent).position === "static")) return window;
    return offsetParent || $eba16a63ee488722$var$getContainingBlock(element) || window;
}

});
parcelRegister("cNC5V", function(module, exports) {

$parcel$export(module.exports, "default", () => $95179c71c901ae5b$export$2e2bcd8739ae039);

var $4bJEZ = parcelRequire("4bJEZ");
function $95179c71c901ae5b$export$2e2bcd8739ae039(element) {
    return (0, $4bJEZ.default)(element).getComputedStyle(element);
}

});

parcelRegister("1mZNr", function(module, exports) {

$parcel$export(module.exports, "default", () => $0ff7c807099d5305$export$2e2bcd8739ae039);

var $eyTVg = parcelRequire("eyTVg");
function $0ff7c807099d5305$export$2e2bcd8739ae039(element) {
    return [
        "table",
        "td",
        "th"
    ].indexOf((0, $eyTVg.default)(element)) >= 0;
}

});

parcelRegister("88D2t", function(module, exports) {

$parcel$export(module.exports, "default", () => $5ecd5a6819f6d2de$export$2e2bcd8739ae039);

var $eyTVg = parcelRequire("eyTVg");

var $rbFoR = parcelRequire("rbFoR");

var $d6xDx = parcelRequire("d6xDx");
function $5ecd5a6819f6d2de$export$2e2bcd8739ae039(element) {
    if ((0, $eyTVg.default)(element) === "html") return element;
    return(// $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ((0, $d6xDx.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0, $rbFoR.default)(element) // fallback
    );
}

});
parcelRegister("rbFoR", function(module, exports) {

$parcel$export(module.exports, "default", () => $051b9280bc9384db$export$2e2bcd8739ae039);

var $d6xDx = parcelRequire("d6xDx");
function $051b9280bc9384db$export$2e2bcd8739ae039(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return (((0, $d6xDx.isElement)(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}

});



parcelRegister("wPDJ2", function(module, exports) {

$parcel$export(module.exports, "default", () => $062b0bd957edc577$export$2e2bcd8739ae039);
function $062b0bd957edc577$export$2e2bcd8739ae039(placement) {
    return [
        "top",
        "bottom"
    ].indexOf(placement) >= 0 ? "x" : "y";
}

});

parcelRegister("9N2WV", function(module, exports) {

$parcel$export(module.exports, "within", () => $720afa5761e0363d$export$f28d906d67a997f3);
$parcel$export(module.exports, "withinMaxClamp", () => $720afa5761e0363d$export$86c8af6d3ef0b4a);

var $iABBo = parcelRequire("iABBo");
function $720afa5761e0363d$export$f28d906d67a997f3(min, value, max) {
    return (0, $iABBo.max)(min, (0, $iABBo.min)(value, max));
}
function $720afa5761e0363d$export$86c8af6d3ef0b4a(min, value, max) {
    var v = $720afa5761e0363d$export$f28d906d67a997f3(min, value, max);
    return v > max ? max : v;
}

});

parcelRegister("2bVTQ", function(module, exports) {

$parcel$export(module.exports, "default", () => $198985865496074e$export$2e2bcd8739ae039);

var $hZOmC = parcelRequire("hZOmC");
function $198985865496074e$export$2e2bcd8739ae039(paddingObject) {
    return Object.assign({}, (0, $hZOmC.default)(), paddingObject);
}

});
parcelRegister("hZOmC", function(module, exports) {

$parcel$export(module.exports, "default", () => $d19f335b8f35ec35$export$2e2bcd8739ae039);
function $d19f335b8f35ec35$export$2e2bcd8739ae039() {
    return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
}

});


parcelRegister("3a0dK", function(module, exports) {

$parcel$export(module.exports, "default", () => $24d27a140f178159$export$2e2bcd8739ae039);
function $24d27a140f178159$export$2e2bcd8739ae039(value, keys) {
    return keys.reduce(function(hashMap, key) {
        hashMap[key] = value;
        return hashMap;
    }, {});
}

});


parcelRegister("3daoF", function(module, exports) {

$parcel$export(module.exports, "default", () => $256aa699194dfe79$export$2e2bcd8739ae039);

var $3ZIUY = parcelRequire("3ZIUY");

var $kefRd = parcelRequire("kefRd");

var $4bJEZ = parcelRequire("4bJEZ");

var $rbFoR = parcelRequire("rbFoR");

var $cNC5V = parcelRequire("cNC5V");

var $eJ303 = parcelRequire("eJ303");

var $ekVLF = parcelRequire("ekVLF");

var $iABBo = parcelRequire("iABBo");
var $256aa699194dfe79$var$unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.
function $256aa699194dfe79$var$roundOffsetsByDPR(_ref, win) {
    var x = _ref.x, y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
        x: (0, $iABBo.round)(x * dpr) / dpr || 0,
        y: (0, $iABBo.round)(y * dpr) / dpr || 0
    };
}
function $256aa699194dfe79$export$378fa78a8fea596f(_ref2) {
    var _Object$assign2;
    var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
        x: x,
        y: y
    }) : {
        x: x,
        y: y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = (0, $3ZIUY.left);
    var sideY = (0, $3ZIUY.top);
    var win = window;
    if (adaptive) {
        var offsetParent = (0, $kefRd.default)(popper);
        var heightProp = "clientHeight";
        var widthProp = "clientWidth";
        if (offsetParent === (0, $4bJEZ.default)(popper)) {
            offsetParent = (0, $rbFoR.default)(popper);
            if ((0, $cNC5V.default)(offsetParent).position !== "static" && position === "absolute") {
                heightProp = "scrollHeight";
                widthProp = "scrollWidth";
            }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
        offsetParent;
        if (placement === (0, $3ZIUY.top) || (placement === (0, $3ZIUY.left) || placement === (0, $3ZIUY.right)) && variation === (0, $3ZIUY.end)) {
            sideY = (0, $3ZIUY.bottom);
            var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
            y -= offsetY - popperRect.height;
            y *= gpuAcceleration ? 1 : -1;
        }
        if (placement === (0, $3ZIUY.left) || (placement === (0, $3ZIUY.top) || placement === (0, $3ZIUY.bottom)) && variation === (0, $3ZIUY.end)) {
            sideX = (0, $3ZIUY.right);
            var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
            x -= offsetX - popperRect.width;
            x *= gpuAcceleration ? 1 : -1;
        }
    }
    var commonStyles = Object.assign({
        position: position
    }, adaptive && $256aa699194dfe79$var$unsetSides);
    var _ref4 = roundOffsets === true ? $256aa699194dfe79$var$roundOffsetsByDPR({
        x: x,
        y: y
    }, (0, $4bJEZ.default)(popper)) : {
        x: x,
        y: y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
        var _Object$assign;
        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function $256aa699194dfe79$var$computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
        placement: (0, $eJ303.default)(state.placement),
        variation: (0, $ekVLF.default)(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, $256aa699194dfe79$export$378fa78a8fea596f(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
    })));
    if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, $256aa699194dfe79$export$378fa78a8fea596f(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets: roundOffsets
    })));
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
        "data-popper-placement": state.placement
    });
} // eslint-disable-next-line import/no-unused-modules
var $256aa699194dfe79$export$2e2bcd8739ae039 = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: $256aa699194dfe79$var$computeStyles,
    data: {}
};

});
parcelRegister("ekVLF", function(module, exports) {

$parcel$export(module.exports, "default", () => $a6ffbe6b3b795e7b$export$2e2bcd8739ae039);
function $a6ffbe6b3b795e7b$export$2e2bcd8739ae039(placement) {
    return placement.split("-")[1];
}

});


parcelRegister("jZBtg", function(module, exports) {

$parcel$export(module.exports, "default", () => $e8e0c7c69245c49b$export$2e2bcd8739ae039);

var $4bJEZ = parcelRequire("4bJEZ");
var $e8e0c7c69245c49b$var$passive = {
    passive: true
};
function $e8e0c7c69245c49b$var$effect(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window = (0, $4bJEZ.default)(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, $e8e0c7c69245c49b$var$passive);
    });
    if (resize) window.addEventListener("resize", instance.update, $e8e0c7c69245c49b$var$passive);
    return function() {
        if (scroll) scrollParents.forEach(function(scrollParent) {
            scrollParent.removeEventListener("scroll", instance.update, $e8e0c7c69245c49b$var$passive);
        });
        if (resize) window.removeEventListener("resize", instance.update, $e8e0c7c69245c49b$var$passive);
    };
} // eslint-disable-next-line import/no-unused-modules
var $e8e0c7c69245c49b$export$2e2bcd8739ae039 = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {},
    effect: $e8e0c7c69245c49b$var$effect,
    data: {}
};

});

parcelRegister("45jb7", function(module, exports) {

$parcel$export(module.exports, "default", () => $2f96817885d7e372$export$2e2bcd8739ae039);

var $6Bsng = parcelRequire("6Bsng");

var $eJ303 = parcelRequire("eJ303");

var $aPSRh = parcelRequire("aPSRh");

var $fq1Ka = parcelRequire("fq1Ka");

var $2hM5X = parcelRequire("2hM5X");

var $3ZIUY = parcelRequire("3ZIUY");

var $ekVLF = parcelRequire("ekVLF");
function $2f96817885d7e372$var$getExpandedFallbackPlacements(placement) {
    if ((0, $eJ303.default)(placement) === (0, $3ZIUY.auto)) return [];
    var oppositePlacement = (0, $6Bsng.default)(placement);
    return [
        (0, $aPSRh.default)(placement),
        oppositePlacement,
        (0, $aPSRh.default)(oppositePlacement)
    ];
}
function $2f96817885d7e372$var$flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) return;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = (0, $eJ303.default)(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [
        (0, $6Bsng.default)(preferredPlacement)
    ] : $2f96817885d7e372$var$getExpandedFallbackPlacements(preferredPlacement));
    var placements = [
        preferredPlacement
    ].concat(fallbackPlacements).reduce(function(acc, placement) {
        return acc.concat((0, $eJ303.default)(placement) === (0, $3ZIUY.auto) ? (0, $2hM5X.default)(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            padding: padding,
            flipVariations: flipVariations,
            allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];
    for(var i = 0; i < placements.length; i++){
        var placement = placements[i];
        var _basePlacement = (0, $eJ303.default)(placement);
        var isStartVariation = (0, $ekVLF.default)(placement) === (0, $3ZIUY.start);
        var isVertical = [
            (0, $3ZIUY.top),
            (0, $3ZIUY.bottom)
        ].indexOf(_basePlacement) >= 0;
        var len = isVertical ? "width" : "height";
        var overflow = (0, $fq1Ka.default)(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            altBoundary: altBoundary,
            padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? (0, $3ZIUY.right) : (0, $3ZIUY.left) : isStartVariation ? (0, $3ZIUY.bottom) : (0, $3ZIUY.top);
        if (referenceRect[len] > popperRect[len]) mainVariationSide = (0, $6Bsng.default)(mainVariationSide);
        var altVariationSide = (0, $6Bsng.default)(mainVariationSide);
        var checks = [];
        if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
        if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        if (checks.every(function(check) {
            return check;
        })) {
            firstFittingPlacement = placement;
            makeFallbackChecks = false;
            break;
        }
        checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;
        var _loop = function _loop(_i) {
            var fittingPlacement = placements.find(function(placement) {
                var checks = checksMap.get(placement);
                if (checks) return checks.slice(0, _i).every(function(check) {
                    return check;
                });
            });
            if (fittingPlacement) {
                firstFittingPlacement = fittingPlacement;
                return "break";
            }
        };
        for(var _i = numberOfChecks; _i > 0; _i--){
            var _ret = _loop(_i);
            if (_ret === "break") break;
        }
    }
    if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
    }
} // eslint-disable-next-line import/no-unused-modules
var $2f96817885d7e372$export$2e2bcd8739ae039 = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: $2f96817885d7e372$var$flip,
    requiresIfExists: [
        "offset"
    ],
    data: {
        _skip: false
    }
};

});
parcelRegister("6Bsng", function(module, exports) {

$parcel$export(module.exports, "default", () => $4cec354ece277182$export$2e2bcd8739ae039);
var $4cec354ece277182$var$hash = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
};
function $4cec354ece277182$export$2e2bcd8739ae039(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
        return $4cec354ece277182$var$hash[matched];
    });
}

});

parcelRegister("aPSRh", function(module, exports) {

$parcel$export(module.exports, "default", () => $7e39388afe8fd057$export$2e2bcd8739ae039);
var $7e39388afe8fd057$var$hash = {
    start: "end",
    end: "start"
};
function $7e39388afe8fd057$export$2e2bcd8739ae039(placement) {
    return placement.replace(/start|end/g, function(matched) {
        return $7e39388afe8fd057$var$hash[matched];
    });
}

});

parcelRegister("fq1Ka", function(module, exports) {

$parcel$export(module.exports, "default", () => $b39aa2f9306db321$export$2e2bcd8739ae039);

var $5CpG0 = parcelRequire("5CpG0");

var $rbFoR = parcelRequire("rbFoR");

var $fBOtw = parcelRequire("fBOtw");

var $7rVZ1 = parcelRequire("7rVZ1");

var $cNoUv = parcelRequire("cNoUv");

var $3ZIUY = parcelRequire("3ZIUY");

var $d6xDx = parcelRequire("d6xDx");

var $2bVTQ = parcelRequire("2bVTQ");

var $3a0dK = parcelRequire("3a0dK");
function $b39aa2f9306db321$export$2e2bcd8739ae039(state, options) {
    if (options === void 0) options = {};
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? (0, $3ZIUY.clippingParents) : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? (0, $3ZIUY.viewport) : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? (0, $3ZIUY.popper) : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = (0, $2bVTQ.default)(typeof padding !== "number" ? padding : (0, $3a0dK.default)(padding, (0, $3ZIUY.basePlacements)));
    var altContext = elementContext === (0, $3ZIUY.popper) ? (0, $3ZIUY.reference) : (0, $3ZIUY.popper);
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = (0, $5CpG0.default)((0, $d6xDx.isElement)(element) ? element : element.contextElement || (0, $rbFoR.default)(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = (0, $fBOtw.default)(state.elements.reference);
    var popperOffsets = (0, $7rVZ1.default)({
        reference: referenceClientRect,
        element: popperRect,
        strategy: "absolute",
        placement: placement
    });
    var popperClientRect = (0, $cNoUv.default)(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === (0, $3ZIUY.popper) ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect
    var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element
    if (elementContext === (0, $3ZIUY.popper) && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function(key) {
            var multiply = [
                (0, $3ZIUY.right),
                (0, $3ZIUY.bottom)
            ].indexOf(key) >= 0 ? 1 : -1;
            var axis = [
                (0, $3ZIUY.top),
                (0, $3ZIUY.bottom)
            ].indexOf(key) >= 0 ? "y" : "x";
            overflowOffsets[key] += offset[axis] * multiply;
        });
    }
    return overflowOffsets;
}

});
parcelRegister("5CpG0", function(module, exports) {

$parcel$export(module.exports, "default", () => $41746b27f6218672$export$2e2bcd8739ae039);

var $3ZIUY = parcelRequire("3ZIUY");

var $4MNDv = parcelRequire("4MNDv");

var $9kHsx = parcelRequire("9kHsx");

var $9tSP8 = parcelRequire("9tSP8");

var $kefRd = parcelRequire("kefRd");

var $rbFoR = parcelRequire("rbFoR");

var $cNC5V = parcelRequire("cNC5V");

var $d6xDx = parcelRequire("d6xDx");

var $fBOtw = parcelRequire("fBOtw");

var $88D2t = parcelRequire("88D2t");

var $ellK5 = parcelRequire("ellK5");

var $eyTVg = parcelRequire("eyTVg");

var $cNoUv = parcelRequire("cNoUv");

var $iABBo = parcelRequire("iABBo");
function $41746b27f6218672$var$getInnerBoundingClientRect(element, strategy) {
    var rect = (0, $fBOtw.default)(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
}
function $41746b27f6218672$var$getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === (0, $3ZIUY.viewport) ? (0, $cNoUv.default)((0, $4MNDv.default)(element, strategy)) : (0, $d6xDx.isElement)(clippingParent) ? $41746b27f6218672$var$getInnerBoundingClientRect(clippingParent, strategy) : (0, $cNoUv.default)((0, $9kHsx.default)((0, $rbFoR.default)(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function $41746b27f6218672$var$getClippingParents(element) {
    var clippingParents = (0, $9tSP8.default)((0, $88D2t.default)(element));
    var canEscapeClipping = [
        "absolute",
        "fixed"
    ].indexOf((0, $cNC5V.default)(element).position) >= 0;
    var clipperElement = canEscapeClipping && (0, $d6xDx.isHTMLElement)(element) ? (0, $kefRd.default)(element) : element;
    if (!(0, $d6xDx.isElement)(clipperElement)) return [];
     // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414
    return clippingParents.filter(function(clippingParent) {
        return (0, $d6xDx.isElement)(clippingParent) && (0, $ellK5.default)(clippingParent, clipperElement) && (0, $eyTVg.default)(clippingParent) !== "body";
    });
} // Gets the maximum area that the element is visible in due to any number of
function $41746b27f6218672$export$2e2bcd8739ae039(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === "clippingParents" ? $41746b27f6218672$var$getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [
        rootBoundary
    ]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function(accRect, clippingParent) {
        var rect = $41746b27f6218672$var$getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = (0, $iABBo.max)(rect.top, accRect.top);
        accRect.right = (0, $iABBo.min)(rect.right, accRect.right);
        accRect.bottom = (0, $iABBo.min)(rect.bottom, accRect.bottom);
        accRect.left = (0, $iABBo.max)(rect.left, accRect.left);
        return accRect;
    }, $41746b27f6218672$var$getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
}

});
parcelRegister("4MNDv", function(module, exports) {

$parcel$export(module.exports, "default", () => $37c225d49e918c6b$export$2e2bcd8739ae039);

var $4bJEZ = parcelRequire("4bJEZ");

var $rbFoR = parcelRequire("rbFoR");

var $bjNq5 = parcelRequire("bjNq5");

var $efR9v = parcelRequire("efR9v");
function $37c225d49e918c6b$export$2e2bcd8739ae039(element, strategy) {
    var win = (0, $4bJEZ.default)(element);
    var html = (0, $rbFoR.default)(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;
    if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = (0, $efR9v.default)();
        if (layoutViewport || !layoutViewport && strategy === "fixed") {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
        }
    }
    return {
        width: width,
        height: height,
        x: x + (0, $bjNq5.default)(element),
        y: y
    };
}

});
parcelRegister("bjNq5", function(module, exports) {

$parcel$export(module.exports, "default", () => $83d7cdd03a66c6bd$export$2e2bcd8739ae039);

var $fBOtw = parcelRequire("fBOtw");

var $rbFoR = parcelRequire("rbFoR");

var $8ZJoe = parcelRequire("8ZJoe");
function $83d7cdd03a66c6bd$export$2e2bcd8739ae039(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return (0, $fBOtw.default)((0, $rbFoR.default)(element)).left + (0, $8ZJoe.default)(element).scrollLeft;
}

});
parcelRegister("8ZJoe", function(module, exports) {

$parcel$export(module.exports, "default", () => $68c73aba05e12bb4$export$2e2bcd8739ae039);

var $4bJEZ = parcelRequire("4bJEZ");
function $68c73aba05e12bb4$export$2e2bcd8739ae039(node) {
    var win = (0, $4bJEZ.default)(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
    };
}

});



parcelRegister("9kHsx", function(module, exports) {

$parcel$export(module.exports, "default", () => $6cb7b16a24759d72$export$2e2bcd8739ae039);

var $rbFoR = parcelRequire("rbFoR");

var $cNC5V = parcelRequire("cNC5V");

var $bjNq5 = parcelRequire("bjNq5");

var $8ZJoe = parcelRequire("8ZJoe");

var $iABBo = parcelRequire("iABBo");
function $6cb7b16a24759d72$export$2e2bcd8739ae039(element) {
    var _element$ownerDocumen;
    var html = (0, $rbFoR.default)(element);
    var winScroll = (0, $8ZJoe.default)(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = (0, $iABBo.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = (0, $iABBo.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + (0, $bjNq5.default)(element);
    var y = -winScroll.scrollTop;
    if ((0, $cNC5V.default)(body || html).direction === "rtl") x += (0, $iABBo.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
    return {
        width: width,
        height: height,
        x: x,
        y: y
    };
}

});

parcelRegister("9tSP8", function(module, exports) {

$parcel$export(module.exports, "default", () => $6e71595481654e2c$export$2e2bcd8739ae039);

var $5Jtdk = parcelRequire("5Jtdk");

var $88D2t = parcelRequire("88D2t");

var $4bJEZ = parcelRequire("4bJEZ");

var $aHPzD = parcelRequire("aHPzD");
function $6e71595481654e2c$export$2e2bcd8739ae039(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) list = [];
    var scrollParent = (0, $5Jtdk.default)(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = (0, $4bJEZ.default)(scrollParent);
    var target = isBody ? [
        win
    ].concat(win.visualViewport || [], (0, $aHPzD.default)(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : updatedList.concat($6e71595481654e2c$export$2e2bcd8739ae039((0, $88D2t.default)(target)));
}

});
parcelRegister("5Jtdk", function(module, exports) {

$parcel$export(module.exports, "default", () => $42c7d101bf7d5a5d$export$2e2bcd8739ae039);

var $88D2t = parcelRequire("88D2t");

var $aHPzD = parcelRequire("aHPzD");

var $eyTVg = parcelRequire("eyTVg");

var $d6xDx = parcelRequire("d6xDx");
function $42c7d101bf7d5a5d$export$2e2bcd8739ae039(node) {
    if ([
        "html",
        "body",
        "#document"
    ].indexOf((0, $eyTVg.default)(node)) >= 0) // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
    if ((0, $d6xDx.isHTMLElement)(node) && (0, $aHPzD.default)(node)) return node;
    return $42c7d101bf7d5a5d$export$2e2bcd8739ae039((0, $88D2t.default)(node));
}

});
parcelRegister("aHPzD", function(module, exports) {

$parcel$export(module.exports, "default", () => $7cb5ecfccce08936$export$2e2bcd8739ae039);

var $cNC5V = parcelRequire("cNC5V");
function $7cb5ecfccce08936$export$2e2bcd8739ae039(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = (0, $cNC5V.default)(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

});



parcelRegister("cNoUv", function(module, exports) {

$parcel$export(module.exports, "default", () => $950d624f2d59e88c$export$2e2bcd8739ae039);
function $950d624f2d59e88c$export$2e2bcd8739ae039(rect) {
    return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
    });
}

});


parcelRegister("7rVZ1", function(module, exports) {

$parcel$export(module.exports, "default", () => $56c8084ae97fa384$export$2e2bcd8739ae039);

var $eJ303 = parcelRequire("eJ303");

var $ekVLF = parcelRequire("ekVLF");

var $wPDJ2 = parcelRequire("wPDJ2");

var $3ZIUY = parcelRequire("3ZIUY");
function $56c8084ae97fa384$export$2e2bcd8739ae039(_ref) {
    var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? (0, $eJ303.default)(placement) : null;
    var variation = placement ? (0, $ekVLF.default)(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;
    switch(basePlacement){
        case 0, $3ZIUY.top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;
        case 0, $3ZIUY.bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;
        case 0, $3ZIUY.right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;
        case 0, $3ZIUY.left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;
        default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
    }
    var mainAxis = basePlacement ? (0, $wPDJ2.default)(basePlacement) : null;
    if (mainAxis != null) {
        var len = mainAxis === "y" ? "height" : "width";
        switch(variation){
            case 0, $3ZIUY.start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;
            case 0, $3ZIUY.end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;
            default:
        }
    }
    return offsets;
}

});


parcelRegister("2hM5X", function(module, exports) {

$parcel$export(module.exports, "default", () => $1aa279fa58755a4a$export$2e2bcd8739ae039);

var $ekVLF = parcelRequire("ekVLF");

var $3ZIUY = parcelRequire("3ZIUY");

var $fq1Ka = parcelRequire("fq1Ka");

var $eJ303 = parcelRequire("eJ303");
function $1aa279fa58755a4a$export$2e2bcd8739ae039(state, options) {
    if (options === void 0) options = {};
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? (0, $3ZIUY.placements) : _options$allowedAutoP;
    var variation = (0, $ekVLF.default)(placement);
    var placements = variation ? flipVariations ? (0, $3ZIUY.variationPlacements) : (0, $3ZIUY.variationPlacements).filter(function(placement) {
        return (0, $ekVLF.default)(placement) === variation;
    }) : (0, $3ZIUY.basePlacements);
    var allowedPlacements = placements.filter(function(placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
    });
    if (allowedPlacements.length === 0) allowedPlacements = placements;
     // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...
    var overflows = allowedPlacements.reduce(function(acc, placement) {
        acc[placement] = (0, $fq1Ka.default)(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            padding: padding
        })[(0, $eJ303.default)(placement)];
        return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b) {
        return overflows[a] - overflows[b];
    });
}

});


parcelRegister("iZmmk", function(module, exports) {

$parcel$export(module.exports, "default", () => $dd2f448e6dbb0944$export$2e2bcd8739ae039);

var $3ZIUY = parcelRequire("3ZIUY");

var $fq1Ka = parcelRequire("fq1Ka");
function $dd2f448e6dbb0944$var$getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) preventedOffsets = {
        x: 0,
        y: 0
    };
    return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
    };
}
function $dd2f448e6dbb0944$var$isAnySideFullyClipped(overflow) {
    return [
        (0, $3ZIUY.top),
        (0, $3ZIUY.right),
        (0, $3ZIUY.bottom),
        (0, $3ZIUY.left)
    ].some(function(side) {
        return overflow[side] >= 0;
    });
}
function $dd2f448e6dbb0944$var$hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = (0, $fq1Ka.default)(state, {
        elementContext: "reference"
    });
    var popperAltOverflow = (0, $fq1Ka.default)(state, {
        altBoundary: true
    });
    var referenceClippingOffsets = $dd2f448e6dbb0944$var$getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = $dd2f448e6dbb0944$var$getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = $dd2f448e6dbb0944$var$isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = $dd2f448e6dbb0944$var$isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
        "data-popper-reference-hidden": isReferenceHidden,
        "data-popper-escaped": hasPopperEscaped
    });
} // eslint-disable-next-line import/no-unused-modules
var $dd2f448e6dbb0944$export$2e2bcd8739ae039 = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: [
        "preventOverflow"
    ],
    fn: $dd2f448e6dbb0944$var$hide
};

});

parcelRegister("e0EP7", function(module, exports) {

$parcel$export(module.exports, "default", () => $a330bb739738cf18$export$2e2bcd8739ae039);

var $eJ303 = parcelRequire("eJ303");

var $3ZIUY = parcelRequire("3ZIUY");
function $a330bb739738cf18$export$7fa02d8595b015ed(placement, rects, offset) {
    var basePlacement = (0, $eJ303.default)(placement);
    var invertDistance = [
        (0, $3ZIUY.left),
        (0, $3ZIUY.top)
    ].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, {
        placement: placement
    })) : offset, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [
        (0, $3ZIUY.left),
        (0, $3ZIUY.right)
    ].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
    } : {
        x: skidding,
        y: distance
    };
}
function $a330bb739738cf18$var$offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset = _options$offset === void 0 ? [
        0,
        0
    ] : _options$offset;
    var data = (0, $3ZIUY.placements).reduce(function(acc, placement) {
        acc[placement] = $a330bb739738cf18$export$7fa02d8595b015ed(placement, state.rects, offset);
        return acc;
    }, {});
    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
    }
    state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules
var $a330bb739738cf18$export$2e2bcd8739ae039 = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: [
        "popperOffsets"
    ],
    fn: $a330bb739738cf18$var$offset
};

});

parcelRegister("i4AAK", function(module, exports) {

$parcel$export(module.exports, "default", () => $d284fc136785a15e$export$2e2bcd8739ae039);

var $7rVZ1 = parcelRequire("7rVZ1");
function $d284fc136785a15e$var$popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = (0, $7rVZ1.default)({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: "absolute",
        placement: state.placement
    });
} // eslint-disable-next-line import/no-unused-modules
var $d284fc136785a15e$export$2e2bcd8739ae039 = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: $d284fc136785a15e$var$popperOffsets,
    data: {}
};

});

parcelRegister("lDwp4", function(module, exports) {

$parcel$export(module.exports, "default", () => $fc06601977373d48$export$2e2bcd8739ae039);

var $3ZIUY = parcelRequire("3ZIUY");

var $eJ303 = parcelRequire("eJ303");

var $wPDJ2 = parcelRequire("wPDJ2");

var $1v58a = parcelRequire("1v58a");

var $9N2WV = parcelRequire("9N2WV");

var $jNRCw = parcelRequire("jNRCw");

var $kefRd = parcelRequire("kefRd");

var $fq1Ka = parcelRequire("fq1Ka");

var $ekVLF = parcelRequire("ekVLF");

var $hZOmC = parcelRequire("hZOmC");

var $iABBo = parcelRequire("iABBo");
function $fc06601977373d48$var$preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = (0, $fq1Ka.default)(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
    });
    var basePlacement = (0, $eJ303.default)(state.placement);
    var variation = (0, $ekVLF.default)(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = (0, $wPDJ2.default)(basePlacement);
    var altAxis = (0, $1v58a.default)(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
    } : Object.assign({
        mainAxis: 0,
        altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
        x: 0,
        y: 0
    };
    if (!popperOffsets) return;
    if (checkMainAxis) {
        var _offsetModifierState$;
        var mainSide = mainAxis === "y" ? (0, $3ZIUY.top) : (0, $3ZIUY.left);
        var altSide = mainAxis === "y" ? (0, $3ZIUY.bottom) : (0, $3ZIUY.right);
        var len = mainAxis === "y" ? "height" : "width";
        var offset = popperOffsets[mainAxis];
        var min = offset + overflow[mainSide];
        var max = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === (0, $3ZIUY.start) ? referenceRect[len] : popperRect[len];
        var maxLen = variation === (0, $3ZIUY.start) ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds
        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? (0, $jNRCw.default)(arrowElement) : {
            width: 0,
            height: 0
        };
        var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : (0, $hZOmC.default)();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)
        var arrowLen = (0, $9N2WV.within)(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && (0, $kefRd.default)(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = (0, $9N2WV.within)(tether ? (0, $iABBo.min)(min, tetherMin) : min, offset, tether ? (0, $iABBo.max)(max, tetherMax) : max);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
    }
    if (checkAltAxis) {
        var _offsetModifierState$2;
        var _mainSide = mainAxis === "x" ? (0, $3ZIUY.top) : (0, $3ZIUY.left);
        var _altSide = mainAxis === "x" ? (0, $3ZIUY.bottom) : (0, $3ZIUY.right);
        var _offset = popperOffsets[altAxis];
        var _len = altAxis === "y" ? "height" : "width";
        var _min = _offset + overflow[_mainSide];
        var _max = _offset - overflow[_altSide];
        var isOriginSide = [
            (0, $3ZIUY.top),
            (0, $3ZIUY.left)
        ].indexOf(basePlacement) !== -1;
        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
        var _preventedOffset = tether && isOriginSide ? (0, $9N2WV.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0, $9N2WV.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules
var $fc06601977373d48$export$2e2bcd8739ae039 = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: $fc06601977373d48$var$preventOverflow,
    requiresIfExists: [
        "offset"
    ]
};

});
parcelRegister("1v58a", function(module, exports) {

$parcel$export(module.exports, "default", () => $117caa8bfa49c53b$export$2e2bcd8739ae039);
function $117caa8bfa49c53b$export$2e2bcd8739ae039(axis) {
    return axis === "x" ? "y" : "x";
}

});



parcelRegister("8yRgr", function(module, exports) {

$parcel$export(module.exports, "popperGenerator", () => $63bad0d90002a387$export$ed5e13716264f202);
$parcel$export(module.exports, "createPopper", () => $63bad0d90002a387$export$8f7491d57c8f97a9);

var $2o8wS = parcelRequire("2o8wS");

var $jNRCw = parcelRequire("jNRCw");

var $9tSP8 = parcelRequire("9tSP8");

var $kefRd = parcelRequire("kefRd");

var $6mXpF = parcelRequire("6mXpF");

var $7ivY0 = parcelRequire("7ivY0");

var $87bIy = parcelRequire("87bIy");

var $fq1Ka = parcelRequire("fq1Ka");

var $d6xDx = parcelRequire("d6xDx");
var $63bad0d90002a387$var$DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
};
function $63bad0d90002a387$var$areValidElements() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return !args.some(function(element) {
        return !(element && typeof element.getBoundingClientRect === "function");
    });
}
function $63bad0d90002a387$export$ed5e13716264f202(generatorOptions) {
    if (generatorOptions === void 0) generatorOptions = {};
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? $63bad0d90002a387$var$DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
        if (options === void 0) options = defaultOptions;
        var state = {
            placement: "bottom",
            orderedModifiers: [],
            options: Object.assign({}, $63bad0d90002a387$var$DEFAULT_OPTIONS, defaultOptions),
            modifiersData: {},
            elements: {
                reference: reference,
                popper: popper
            },
            attributes: {},
            styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
            state: state,
            setOptions: function setOptions(setOptionsAction) {
                var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
                cleanupModifierEffects();
                state.options = Object.assign({}, defaultOptions, state.options, options);
                state.scrollParents = {
                    reference: (0, $d6xDx.isElement)(reference) ? (0, $9tSP8.default)(reference) : reference.contextElement ? (0, $9tSP8.default)(reference.contextElement) : [],
                    popper: (0, $9tSP8.default)(popper)
                }; // Orders the modifiers based on their dependencies and `phase`
                // properties
                var orderedModifiers = (0, $6mXpF.default)((0, $87bIy.default)([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers
                state.orderedModifiers = orderedModifiers.filter(function(m) {
                    return m.enabled;
                });
                runModifierEffects();
                return instance.update();
            },
            // Sync update – it will always be executed, even if not necessary. This
            // is useful for low frequency updates where sync behavior simplifies the
            // logic.
            // For high frequency updates (e.g. `resize` and `scroll` events), always
            // prefer the async Popper#update method
            forceUpdate: function forceUpdate() {
                if (isDestroyed) return;
                var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
                // anymore
                if (!$63bad0d90002a387$var$areValidElements(reference, popper)) return;
                 // Store the reference and popper rects to be read by modifiers
                state.rects = {
                    reference: (0, $2o8wS.default)(reference, (0, $kefRd.default)(popper), state.options.strategy === "fixed"),
                    popper: (0, $jNRCw.default)(popper)
                }; // Modifiers have the ability to reset the current update cycle. The
                // most common use case for this is the `flip` modifier changing the
                // placement, which then needs to re-run all the modifiers, because the
                // logic was previously ran for the previous placement and is therefore
                // stale/incorrect
                state.reset = false;
                state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
                // is filled with the initial data specified by the modifier. This means
                // it doesn't persist and is fresh on each update.
                // To ensure persistent data, use `${name}#persistent`
                state.orderedModifiers.forEach(function(modifier) {
                    return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                });
                for(var index = 0; index < state.orderedModifiers.length; index++){
                    if (state.reset === true) {
                        state.reset = false;
                        index = -1;
                        continue;
                    }
                    var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                    if (typeof fn === "function") state = fn({
                        state: state,
                        options: _options,
                        name: name,
                        instance: instance
                    }) || state;
                }
            },
            // Async and optimistically optimized update – it will not be executed if
            // not necessary (debounced to run at most once-per-tick)
            update: (0, $7ivY0.default)(function() {
                return new Promise(function(resolve) {
                    instance.forceUpdate();
                    resolve(state);
                });
            }),
            destroy: function destroy() {
                cleanupModifierEffects();
                isDestroyed = true;
            }
        };
        if (!$63bad0d90002a387$var$areValidElements(reference, popper)) return instance;
        instance.setOptions(options).then(function(state) {
            if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.
        function runModifierEffects() {
            state.orderedModifiers.forEach(function(_ref) {
                var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
                if (typeof effect === "function") {
                    var cleanupFn = effect({
                        state: state,
                        name: name,
                        instance: instance,
                        options: options
                    });
                    var noopFn = function noopFn() {};
                    effectCleanupFns.push(cleanupFn || noopFn);
                }
            });
        }
        function cleanupModifierEffects() {
            effectCleanupFns.forEach(function(fn) {
                return fn();
            });
            effectCleanupFns = [];
        }
        return instance;
    };
}
var $63bad0d90002a387$export$8f7491d57c8f97a9 = /*#__PURE__*/ $63bad0d90002a387$export$ed5e13716264f202(); // eslint-disable-next-line import/no-unused-modules

});
parcelRegister("2o8wS", function(module, exports) {

$parcel$export(module.exports, "default", () => $1bd47066b42a5b5d$export$2e2bcd8739ae039);

var $fBOtw = parcelRequire("fBOtw");

var $2jjsC = parcelRequire("2jjsC");

var $eyTVg = parcelRequire("eyTVg");

var $d6xDx = parcelRequire("d6xDx");

var $bjNq5 = parcelRequire("bjNq5");

var $rbFoR = parcelRequire("rbFoR");

var $aHPzD = parcelRequire("aHPzD");

var $iABBo = parcelRequire("iABBo");
function $1bd47066b42a5b5d$var$isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = (0, $iABBo.round)(rect.width) / element.offsetWidth || 1;
    var scaleY = (0, $iABBo.round)(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
function $1bd47066b42a5b5d$export$2e2bcd8739ae039(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) isFixed = false;
    var isOffsetParentAnElement = (0, $d6xDx.isHTMLElement)(offsetParent);
    var offsetParentIsScaled = (0, $d6xDx.isHTMLElement)(offsetParent) && $1bd47066b42a5b5d$var$isElementScaled(offsetParent);
    var documentElement = (0, $rbFoR.default)(offsetParent);
    var rect = (0, $fBOtw.default)(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
        scrollLeft: 0,
        scrollTop: 0
    };
    var offsets = {
        x: 0,
        y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if ((0, $eyTVg.default)(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
        (0, $aHPzD.default)(documentElement)) scroll = (0, $2jjsC.default)(offsetParent);
        if ((0, $d6xDx.isHTMLElement)(offsetParent)) {
            offsets = (0, $fBOtw.default)(offsetParent, true);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
        } else if (documentElement) offsets.x = (0, $bjNq5.default)(documentElement);
    }
    return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
    };
}

});
parcelRegister("2jjsC", function(module, exports) {

$parcel$export(module.exports, "default", () => $1aec7390888aa5e7$export$2e2bcd8739ae039);

var $8ZJoe = parcelRequire("8ZJoe");

var $4bJEZ = parcelRequire("4bJEZ");

var $d6xDx = parcelRequire("d6xDx");

var $in80S = parcelRequire("in80S");
function $1aec7390888aa5e7$export$2e2bcd8739ae039(node) {
    if (node === (0, $4bJEZ.default)(node) || !(0, $d6xDx.isHTMLElement)(node)) return (0, $8ZJoe.default)(node);
    else return (0, $in80S.default)(node);
}

});
parcelRegister("in80S", function(module, exports) {

$parcel$export(module.exports, "default", () => $d60097371f30bca0$export$2e2bcd8739ae039);
function $d60097371f30bca0$export$2e2bcd8739ae039(element) {
    return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
    };
}

});



parcelRegister("6mXpF", function(module, exports) {

$parcel$export(module.exports, "default", () => $4a32e2579d0de4f9$export$2e2bcd8739ae039);

var $3ZIUY = parcelRequire("3ZIUY");
function $4a32e2579d0de4f9$var$order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
        map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively
    function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function(dep) {
            if (!visited.has(dep)) {
                var depModifier = map.get(dep);
                if (depModifier) sort(depModifier);
            }
        });
        result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
        if (!visited.has(modifier.name)) // check for visited object
        sort(modifier);
    });
    return result;
}
function $4a32e2579d0de4f9$export$2e2bcd8739ae039(modifiers) {
    // order based on dependencies
    var orderedModifiers = $4a32e2579d0de4f9$var$order(modifiers); // order based on phase
    return (0, $3ZIUY.modifierPhases).reduce(function(acc, phase) {
        return acc.concat(orderedModifiers.filter(function(modifier) {
            return modifier.phase === phase;
        }));
    }, []);
}

});

parcelRegister("7ivY0", function(module, exports) {

$parcel$export(module.exports, "default", () => $550302ce282a655b$export$2e2bcd8739ae039);
function $550302ce282a655b$export$2e2bcd8739ae039(fn) {
    var pending;
    return function() {
        if (!pending) pending = new Promise(function(resolve) {
            Promise.resolve().then(function() {
                pending = undefined;
                resolve(fn());
            });
        });
        return pending;
    };
}

});

parcelRegister("87bIy", function(module, exports) {

$parcel$export(module.exports, "default", () => $5e881110320a085b$export$2e2bcd8739ae039);
function $5e881110320a085b$export$2e2bcd8739ae039(modifiers) {
    var merged = modifiers.reduce(function(merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
    }, {}); // IE11 does not support Object.values
    return Object.keys(merged).map(function(key) {
        return merged[key];
    });
}

});


parcelRegister("e2LKo", function(module, exports) {

$parcel$export(module.exports, "createPopper", () => $a3964a39831c9644$export$8f7491d57c8f97a9);

var $8yRgr = parcelRequire("8yRgr");

var $jZBtg = parcelRequire("jZBtg");

var $i4AAK = parcelRequire("i4AAK");

var $3daoF = parcelRequire("3daoF");

var $g8OEA = parcelRequire("g8OEA");

var $e0EP7 = parcelRequire("e0EP7");

var $45jb7 = parcelRequire("45jb7");

var $lDwp4 = parcelRequire("lDwp4");

var $7b3sC = parcelRequire("7b3sC");

var $iZmmk = parcelRequire("iZmmk");


var $a3964a39831c9644$export$d34966752335dd47 = [
    (0, $jZBtg.default),
    (0, $i4AAK.default),
    (0, $3daoF.default),
    (0, $g8OEA.default),
    (0, $e0EP7.default),
    (0, $45jb7.default),
    (0, $lDwp4.default),
    (0, $7b3sC.default),
    (0, $iZmmk.default)
];
var $a3964a39831c9644$export$8f7491d57c8f97a9 = /*#__PURE__*/ (0, $8yRgr.popperGenerator)({
    defaultModifiers: $a3964a39831c9644$export$d34966752335dd47
}); // eslint-disable-next-line import/no-unused-modules

});

parcelRegister("aIwMe", function(module, exports) {

$parcel$export(module.exports, "createPopper", () => $7cd7704680ad4773$export$8f7491d57c8f97a9);

var $8yRgr = parcelRequire("8yRgr");

var $jZBtg = parcelRequire("jZBtg");

var $i4AAK = parcelRequire("i4AAK");

var $3daoF = parcelRequire("3daoF");

var $g8OEA = parcelRequire("g8OEA");
var $7cd7704680ad4773$export$d34966752335dd47 = [
    (0, $jZBtg.default),
    (0, $i4AAK.default),
    (0, $3daoF.default),
    (0, $g8OEA.default)
];
var $7cd7704680ad4773$export$8f7491d57c8f97a9 = /*#__PURE__*/ (0, $8yRgr.popperGenerator)({
    defaultModifiers: $7cd7704680ad4773$export$d34966752335dd47
}); // eslint-disable-next-line import/no-unused-modules

});


parcelRegister("f04Wu", function(module, exports) {
/*!
  * Bootstrap sanitizer.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    factory(module.exports);
})(module.exports, function(exports1) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ // js-docs-start allow-list
    const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    const DefaultAllowlist = {
        // Global attributes allowed on any supplied element below.
        "*": [
            "class",
            "dir",
            "id",
            "lang",
            "role",
            ARIA_ATTRIBUTE_PATTERN
        ],
        a: [
            "target",
            "href",
            "title",
            "rel"
        ],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: [
            "src",
            "srcset",
            "alt",
            "title",
            "width",
            "height"
        ],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    };
    // js-docs-end allow-list
    const uriAttributes = new Set([
        "background",
        "cite",
        "href",
        "itemtype",
        "longdesc",
        "poster",
        "src",
        "xlink:href"
    ]);
    /**
   * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
   * contexts.
   *
   * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
   */ // eslint-disable-next-line unicorn/better-regex
    const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
    const allowedAttribute = (attribute, allowedAttributeList)=>{
        const attributeName = attribute.nodeName.toLowerCase();
        if (allowedAttributeList.includes(attributeName)) {
            if (uriAttributes.has(attributeName)) return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
            return true;
        }
        // Check if a regular expression validates the attribute.
        return allowedAttributeList.filter((attributeRegex)=>attributeRegex instanceof RegExp).some((regex)=>regex.test(attributeName));
    };
    function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
        if (!unsafeHtml.length) return unsafeHtml;
        if (sanitizeFunction && typeof sanitizeFunction === "function") return sanitizeFunction(unsafeHtml);
        const domParser = new window.DOMParser();
        const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
        const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
        for (const element of elements){
            const elementName = element.nodeName.toLowerCase();
            if (!Object.keys(allowList).includes(elementName)) {
                element.remove();
                continue;
            }
            const attributeList = [].concat(...element.attributes);
            const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
            for (const attribute of attributeList)if (!allowedAttribute(attribute, allowedAttributes)) element.removeAttribute(attribute.nodeName);
        }
        return createdDocument.body.innerHTML;
    }
    exports1.DefaultAllowlist = DefaultAllowlist;
    exports1.sanitizeHtml = sanitizeHtml;
    Object.defineProperty(exports1, Symbol.toStringTag, {
        value: "Module"
    });
});

});

parcelRegister("fuTre", function(module, exports) {




/*!
  * Bootstrap template-factory.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("lScNz")), (parcelRequire("aWkXD")), (parcelRequire("f04Wu")), (parcelRequire("gIBQD")));
})(module.exports, function(SelectorEngine, Config, sanitizer_js, index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap util/template-factory.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const NAME = "TemplateFactory";
    const Default = {
        allowList: sanitizer_js.DefaultAllowlist,
        content: {},
        // { selector : text ,  selector2 : text2 , }
        extraClass: "",
        html: false,
        sanitize: true,
        sanitizeFn: null,
        template: "<div></div>"
    };
    const DefaultType = {
        allowList: "object",
        content: "object",
        extraClass: "(string|function)",
        html: "boolean",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        template: "string"
    };
    const DefaultContentType = {
        entry: "(string|element|function|null)",
        selector: "(string|element)"
    };
    /**
   * Class definition
   */ class TemplateFactory extends Config {
        constructor(config){
            super();
            this._config = this._getConfig(config);
        }
        // Getters
        static get Default() {
            return Default;
        }
        static get DefaultType() {
            return DefaultType;
        }
        static get NAME() {
            return NAME;
        }
        // Public
        getContent() {
            return Object.values(this._config.content).map((config)=>this._resolvePossibleFunction(config)).filter(Boolean);
        }
        hasContent() {
            return this.getContent().length > 0;
        }
        changeContent(content) {
            this._checkContent(content);
            this._config.content = {
                ...this._config.content,
                ...content
            };
            return this;
        }
        toHtml() {
            const templateWrapper = document.createElement("div");
            templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
            for (const [selector, text] of Object.entries(this._config.content))this._setContent(templateWrapper, text, selector);
            const template = templateWrapper.children[0];
            const extraClass = this._resolvePossibleFunction(this._config.extraClass);
            if (extraClass) template.classList.add(...extraClass.split(" "));
            return template;
        }
        // Private
        _typeCheckConfig(config) {
            super._typeCheckConfig(config);
            this._checkContent(config.content);
        }
        _checkContent(arg) {
            for (const [selector, content] of Object.entries(arg))super._typeCheckConfig({
                selector: selector,
                entry: content
            }, DefaultContentType);
        }
        _setContent(template, content, selector) {
            const templateElement = SelectorEngine.findOne(selector, template);
            if (!templateElement) return;
            content = this._resolvePossibleFunction(content);
            if (!content) {
                templateElement.remove();
                return;
            }
            if (index_js.isElement(content)) {
                this._putElementInTemplate(index_js.getElement(content), templateElement);
                return;
            }
            if (this._config.html) {
                templateElement.innerHTML = this._maybeSanitize(content);
                return;
            }
            templateElement.textContent = content;
        }
        _maybeSanitize(arg) {
            return this._config.sanitize ? sanitizer_js.sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
        }
        _resolvePossibleFunction(arg) {
            return index_js.execute(arg, [
                this
            ]);
        }
        _putElementInTemplate(element, templateElement) {
            if (this._config.html) {
                templateElement.innerHTML = "";
                templateElement.append(element);
                return;
            }
            templateElement.textContent = element.textContent;
        }
    }
    return TemplateFactory;
});

});
parcelRegister("lScNz", function(module, exports) {

/*!
  * Bootstrap selector-engine.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("gIBQD")));
})(module.exports, function(index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const getSelector = (element)=>{
        let selector = element.getAttribute("data-bs-target");
        if (!selector || selector === "#") {
            let hrefAttribute = element.getAttribute("href");
            // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) return null;
            // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
            selector = hrefAttribute && hrefAttribute !== "#" ? index_js.parseSelector(hrefAttribute.trim()) : null;
        }
        return selector;
    };
    const SelectorEngine = {
        find (selector, element = document.documentElement) {
            return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne (selector, element = document.documentElement) {
            return Element.prototype.querySelector.call(element, selector);
        },
        children (element, selector) {
            return [].concat(...element.children).filter((child)=>child.matches(selector));
        },
        parents (element, selector) {
            const parents = [];
            let ancestor = element.parentNode.closest(selector);
            while(ancestor){
                parents.push(ancestor);
                ancestor = ancestor.parentNode.closest(selector);
            }
            return parents;
        },
        prev (element, selector) {
            let previous = element.previousElementSibling;
            while(previous){
                if (previous.matches(selector)) return [
                    previous
                ];
                previous = previous.previousElementSibling;
            }
            return [];
        },
        // TODO: this is now unused; remove later along with prev()
        next (element, selector) {
            let next = element.nextElementSibling;
            while(next){
                if (next.matches(selector)) return [
                    next
                ];
                next = next.nextElementSibling;
            }
            return [];
        },
        focusableChildren (element) {
            const focusables = [
                "a",
                "button",
                "input",
                "textarea",
                "select",
                "details",
                "[tabindex]",
                '[contenteditable="true"]'
            ].map((selector)=>`${selector}:not([tabindex^="-"])`).join(",");
            return this.find(focusables, element).filter((el)=>!index_js.isDisabled(el) && index_js.isVisible(el));
        },
        getSelectorFromElement (element) {
            const selector = getSelector(element);
            if (selector) return SelectorEngine.findOne(selector) ? selector : null;
            return null;
        },
        getElementFromSelector (element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.findOne(selector) : null;
        },
        getMultipleElementsFromSelector (element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.find(selector) : [];
        }
    };
    return SelectorEngine;
});

});



// import "bootstrap/js/dist/alert";
var $75d2dc5c3006cf76$exports = {};



/*!
  * Bootstrap button.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $75d2dc5c3006cf76$exports = factory((parcelRequire("eS6uK")), (parcelRequire("8TXdu")), (parcelRequire("gIBQD")));
})($75d2dc5c3006cf76$exports, function(BaseComponent, EventHandler, index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const NAME = "button";
    const DATA_KEY = "bs.button";
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = ".data-api";
    const CLASS_NAME_ACTIVE = "active";
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    /**
   * Class definition
   */ class Button extends BaseComponent {
        // Getters
        static get NAME() {
            return NAME;
        }
        // Public
        toggle() {
            // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
            this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE));
        }
        // Static
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Button.getOrCreateInstance(this);
                if (config === "toggle") data[config]();
            });
        }
    }
    /**
   * Data API implementation
   */ EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event)=>{
        event.preventDefault();
        const button = event.target.closest(SELECTOR_DATA_TOGGLE);
        const data = Button.getOrCreateInstance(button);
        data.toggle();
    });
    /**
   * jQuery
   */ index_js.defineJQueryPlugin(Button);
    return Button;
});


var $b4f1f2985b475c40$exports = {};


/*!
  * Bootstrap popover.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $b4f1f2985b475c40$exports = factory((parcelRequire("aCidq")), (parcelRequire("gIBQD")));
})($b4f1f2985b475c40$exports, function(Tooltip, index_js) {
    "use strict";
    /**
   * --------------------------------------------------------------------------
   * Bootstrap popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * Constants
   */ const NAME = "popover";
    const SELECTOR_TITLE = ".popover-header";
    const SELECTOR_CONTENT = ".popover-body";
    const Default = {
        ...Tooltip.Default,
        content: "",
        offset: [
            0,
            8
        ],
        placement: "right",
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        trigger: "click"
    };
    const DefaultType = {
        ...Tooltip.DefaultType,
        content: "(null|string|element|function)"
    };
    /**
   * Class definition
   */ class Popover extends Tooltip {
        // Getters
        static get Default() {
            return Default;
        }
        static get DefaultType() {
            return DefaultType;
        }
        static get NAME() {
            return NAME;
        }
        // Overrides
        _isWithContent() {
            return this._getTitle() || this._getContent();
        }
        // Private
        _getContentForTemplate() {
            return {
                [SELECTOR_TITLE]: this._getTitle(),
                [SELECTOR_CONTENT]: this._getContent()
            };
        }
        _getContent() {
            return this._resolvePossibleFunction(this._config.content);
        }
        // Static
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Popover.getOrCreateInstance(this, config);
                if (typeof config !== "string") return;
                if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
                data[config]();
            });
        }
    }
    /**
   * jQuery
   */ index_js.defineJQueryPlugin(Popover);
    return Popover;
});


 // import "bootstrap/js/dist/scrollspy";
 // import "bootstrap/js/dist/tab";
 // import "bootstrap/js/dist/toast";
 // import "bootstrap/js/dist/tooltip";
 // import "bootstrap/js/dist/base-component";
 // import "bootstrap/js/dist/offcanvas";


//# sourceMappingURL=index.6ae06b9c.js.map
