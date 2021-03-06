
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*! @preserve
     * numeral.js
     * version : 2.0.6
     * author : Adam Draper
     * license : MIT
     * http://adamwdraper.github.com/Numeral-js/
     */

    var numeral = createCommonjsModule(function (module) {
    (function (global, factory) {
        if (module.exports) {
            module.exports = factory();
        } else {
            global.numeral = factory();
        }
    }(commonjsGlobal, function () {
        /************************************
            Variables
        ************************************/

        var numeral,
            _,
            VERSION = '2.0.6',
            formats = {},
            locales = {},
            defaults = {
                currentLocale: 'en',
                zeroFormat: null,
                nullFormat: null,
                defaultFormat: '0,0',
                scalePercentBy100: true
            },
            options = {
                currentLocale: defaults.currentLocale,
                zeroFormat: defaults.zeroFormat,
                nullFormat: defaults.nullFormat,
                defaultFormat: defaults.defaultFormat,
                scalePercentBy100: defaults.scalePercentBy100
            };


        /************************************
            Constructors
        ************************************/

        // Numeral prototype object
        function Numeral(input, number) {
            this._input = input;

            this._value = number;
        }

        numeral = function(input) {
            var value,
                kind,
                unformatFunction,
                regexp;

            if (numeral.isNumeral(input)) {
                value = input.value();
            } else if (input === 0 || typeof input === 'undefined') {
                value = 0;
            } else if (input === null || _.isNaN(input)) {
                value = null;
            } else if (typeof input === 'string') {
                if (options.zeroFormat && input === options.zeroFormat) {
                    value = 0;
                } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                    value = null;
                } else {
                    for (kind in formats) {
                        regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                        if (regexp && input.match(regexp)) {
                            unformatFunction = formats[kind].unformat;

                            break;
                        }
                    }

                    unformatFunction = unformatFunction || numeral._.stringToNumber;

                    value = unformatFunction(input);
                }
            } else {
                value = Number(input)|| null;
            }

            return new Numeral(input, value);
        };

        // version number
        numeral.version = VERSION;

        // compare numeral object
        numeral.isNumeral = function(obj) {
            return obj instanceof Numeral;
        };

        // helper functions
        numeral._ = _ = {
            // formats numbers separators, decimals places, signs, abbreviations
            numberToFormat: function(value, format, roundingFunction) {
                var locale = locales[numeral.options.currentLocale],
                    negP = false,
                    optDec = false,
                    leadingCount = 0,
                    abbr = '',
                    trillion = 1000000000000,
                    billion = 1000000000,
                    million = 1000000,
                    thousand = 1000,
                    decimal = '',
                    neg = false,
                    abbrForce, // force abbreviation
                    abs,
                    int,
                    precision,
                    signed,
                    thousands,
                    output;

                // make sure we never format a null value
                value = value || 0;

                abs = Math.abs(value);

                // see if we should use parentheses for negative number or if we should prefix with a sign
                // if both are present we default to parentheses
                if (numeral._.includes(format, '(')) {
                    negP = true;
                    format = format.replace(/[\(|\)]/g, '');
                } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                    signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                    format = format.replace(/[\+|\-]/g, '');
                }

                // see if abbreviation is wanted
                if (numeral._.includes(format, 'a')) {
                    abbrForce = format.match(/a(k|m|b|t)?/);

                    abbrForce = abbrForce ? abbrForce[1] : false;

                    // check for space before abbreviation
                    if (numeral._.includes(format, ' a')) {
                        abbr = ' ';
                    }

                    format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                    if (abs >= trillion && !abbrForce || abbrForce === 't') {
                        // trillion
                        abbr += locale.abbreviations.trillion;
                        value = value / trillion;
                    } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                        // billion
                        abbr += locale.abbreviations.billion;
                        value = value / billion;
                    } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                        // million
                        abbr += locale.abbreviations.million;
                        value = value / million;
                    } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                        // thousand
                        abbr += locale.abbreviations.thousand;
                        value = value / thousand;
                    }
                }

                // check for optional decimals
                if (numeral._.includes(format, '[.]')) {
                    optDec = true;
                    format = format.replace('[.]', '.');
                }

                // break number and format
                int = value.toString().split('.')[0];
                precision = format.split('.')[1];
                thousands = format.indexOf(',');
                leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

                if (precision) {
                    if (numeral._.includes(precision, '[')) {
                        precision = precision.replace(']', '');
                        precision = precision.split('[');
                        decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                    } else {
                        decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                    }

                    int = decimal.split('.')[0];

                    if (numeral._.includes(decimal, '.')) {
                        decimal = locale.delimiters.decimal + decimal.split('.')[1];
                    } else {
                        decimal = '';
                    }

                    if (optDec && Number(decimal.slice(1)) === 0) {
                        decimal = '';
                    }
                } else {
                    int = numeral._.toFixed(value, 0, roundingFunction);
                }

                // check abbreviation again after rounding
                if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                    int = String(Number(int) / 1000);

                    switch (abbr) {
                        case locale.abbreviations.thousand:
                            abbr = locale.abbreviations.million;
                            break;
                        case locale.abbreviations.million:
                            abbr = locale.abbreviations.billion;
                            break;
                        case locale.abbreviations.billion:
                            abbr = locale.abbreviations.trillion;
                            break;
                    }
                }


                // format number
                if (numeral._.includes(int, '-')) {
                    int = int.slice(1);
                    neg = true;
                }

                if (int.length < leadingCount) {
                    for (var i = leadingCount - int.length; i > 0; i--) {
                        int = '0' + int;
                    }
                }

                if (thousands > -1) {
                    int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
                }

                if (format.indexOf('.') === 0) {
                    int = '';
                }

                output = int + decimal + (abbr ? abbr : '');

                if (negP) {
                    output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
                } else {
                    if (signed >= 0) {
                        output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                    } else if (neg) {
                        output = '-' + output;
                    }
                }

                return output;
            },
            // unformats numbers separators, decimals places, signs, abbreviations
            stringToNumber: function(string) {
                var locale = locales[options.currentLocale],
                    stringOriginal = string,
                    abbreviations = {
                        thousand: 3,
                        million: 6,
                        billion: 9,
                        trillion: 12
                    },
                    abbreviation,
                    value,
                    regexp;

                if (options.zeroFormat && string === options.zeroFormat) {
                    value = 0;
                } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                    value = null;
                } else {
                    value = 1;

                    if (locale.delimiters.decimal !== '.') {
                        string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                    }

                    for (abbreviation in abbreviations) {
                        regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                        if (stringOriginal.match(regexp)) {
                            value *= Math.pow(10, abbreviations[abbreviation]);
                            break;
                        }
                    }

                    // check for negative number
                    value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                    // remove non numbers
                    string = string.replace(/[^0-9\.]+/g, '');

                    value *= Number(string);
                }

                return value;
            },
            isNaN: function(value) {
                return typeof value === 'number' && isNaN(value);
            },
            includes: function(string, search) {
                return string.indexOf(search) !== -1;
            },
            insert: function(string, subString, start) {
                return string.slice(0, start) + subString + string.slice(start);
            },
            reduce: function(array, callback /*, initialValue*/) {
                if (this === null) {
                    throw new TypeError('Array.prototype.reduce called on null or undefined');
                }

                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }

                var t = Object(array),
                    len = t.length >>> 0,
                    k = 0,
                    value;

                if (arguments.length === 3) {
                    value = arguments[2];
                } else {
                    while (k < len && !(k in t)) {
                        k++;
                    }

                    if (k >= len) {
                        throw new TypeError('Reduce of empty array with no initial value');
                    }

                    value = t[k++];
                }
                for (; k < len; k++) {
                    if (k in t) {
                        value = callback(value, t[k], k, t);
                    }
                }
                return value;
            },
            /**
             * Computes the multiplier necessary to make x >= 1,
             * effectively eliminating miscalculations caused by
             * finite precision.
             */
            multiplier: function (x) {
                var parts = x.toString().split('.');

                return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
            },
            /**
             * Given a variable number of arguments, returns the maximum
             * multiplier that must be used to normalize an operation involving
             * all of them.
             */
            correctionFactor: function () {
                var args = Array.prototype.slice.call(arguments);

                return args.reduce(function(accum, next) {
                    var mn = _.multiplier(next);
                    return accum > mn ? accum : mn;
                }, 1);
            },
            /**
             * Implementation of toFixed() that treats floats more like decimals
             *
             * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
             * problems for accounting- and finance-related software.
             */
            toFixed: function(value, maxDecimals, roundingFunction, optionals) {
                var splitValue = value.toString().split('.'),
                    minDecimals = maxDecimals - (optionals || 0),
                    boundedPrecision,
                    optionalsRegExp,
                    power,
                    output;

                // Use the smallest precision value possible to avoid errors from floating point representation
                if (splitValue.length === 2) {
                  boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
                } else {
                  boundedPrecision = minDecimals;
                }

                power = Math.pow(10, boundedPrecision);

                // Multiply up by precision, round accurately, then divide and use native toFixed():
                output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

                if (optionals > maxDecimals - boundedPrecision) {
                    optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                    output = output.replace(optionalsRegExp, '');
                }

                return output;
            }
        };

        // avaliable options
        numeral.options = options;

        // avaliable formats
        numeral.formats = formats;

        // avaliable formats
        numeral.locales = locales;

        // This function sets the current locale.  If
        // no arguments are passed in, it will simply return the current global
        // locale key.
        numeral.locale = function(key) {
            if (key) {
                options.currentLocale = key.toLowerCase();
            }

            return options.currentLocale;
        };

        // This function provides access to the loaded locale data.  If
        // no arguments are passed in, it will simply return the current
        // global locale object.
        numeral.localeData = function(key) {
            if (!key) {
                return locales[options.currentLocale];
            }

            key = key.toLowerCase();

            if (!locales[key]) {
                throw new Error('Unknown locale : ' + key);
            }

            return locales[key];
        };

        numeral.reset = function() {
            for (var property in defaults) {
                options[property] = defaults[property];
            }
        };

        numeral.zeroFormat = function(format) {
            options.zeroFormat = typeof(format) === 'string' ? format : null;
        };

        numeral.nullFormat = function (format) {
            options.nullFormat = typeof(format) === 'string' ? format : null;
        };

        numeral.defaultFormat = function(format) {
            options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
        };

        numeral.register = function(type, name, format) {
            name = name.toLowerCase();

            if (this[type + 's'][name]) {
                throw new TypeError(name + ' ' + type + ' already registered.');
            }

            this[type + 's'][name] = format;

            return format;
        };


        numeral.validate = function(val, culture) {
            var _decimalSep,
                _thousandSep,
                _currSymbol,
                _valArray,
                _abbrObj,
                _thousandRegEx,
                localeData,
                temp;

            //coerce val to string
            if (typeof val !== 'string') {
                val += '';

                if (console.warn) {
                    console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
                }
            }

            //trim whitespaces from either sides
            val = val.trim();

            //if val is just digits return true
            if (!!val.match(/^\d+$/)) {
                return true;
            }

            //if val is empty return false
            if (val === '') {
                return false;
            }

            //get the decimal and thousands separator from numeral.localeData
            try {
                //check if the culture is understood by numeral. if not, default it to current locale
                localeData = numeral.localeData(culture);
            } catch (e) {
                localeData = numeral.localeData(numeral.locale());
            }

            //setup the delimiters and currency symbol based on culture/locale
            _currSymbol = localeData.currency.symbol;
            _abbrObj = localeData.abbreviations;
            _decimalSep = localeData.delimiters.decimal;
            if (localeData.delimiters.thousands === '.') {
                _thousandSep = '\\.';
            } else {
                _thousandSep = localeData.delimiters.thousands;
            }

            // validating currency symbol
            temp = val.match(/^[^\d]+/);
            if (temp !== null) {
                val = val.substr(1);
                if (temp[0] !== _currSymbol) {
                    return false;
                }
            }

            //validating abbreviation symbol
            temp = val.match(/[^\d]+$/);
            if (temp !== null) {
                val = val.slice(0, -1);
                if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                    return false;
                }
            }

            _thousandRegEx = new RegExp(_thousandSep + '{2}');

            if (!val.match(/[^\d.,]/g)) {
                _valArray = val.split(_decimalSep);
                if (_valArray.length > 2) {
                    return false;
                } else {
                    if (_valArray.length < 2) {
                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                    } else {
                        if (_valArray[0].length === 1) {
                            return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                        } else {
                            return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                        }
                    }
                }
            }

            return false;
        };


        /************************************
            Numeral Prototype
        ************************************/

        numeral.fn = Numeral.prototype = {
            clone: function() {
                return numeral(this);
            },
            format: function(inputString, roundingFunction) {
                var value = this._value,
                    format = inputString || options.defaultFormat,
                    kind,
                    output,
                    formatFunction;

                // make sure we have a roundingFunction
                roundingFunction = roundingFunction || Math.round;

                // format based on value
                if (value === 0 && options.zeroFormat !== null) {
                    output = options.zeroFormat;
                } else if (value === null && options.nullFormat !== null) {
                    output = options.nullFormat;
                } else {
                    for (kind in formats) {
                        if (format.match(formats[kind].regexps.format)) {
                            formatFunction = formats[kind].format;

                            break;
                        }
                    }

                    formatFunction = formatFunction || numeral._.numberToFormat;

                    output = formatFunction(value, format, roundingFunction);
                }

                return output;
            },
            value: function() {
                return this._value;
            },
            input: function() {
                return this._input;
            },
            set: function(value) {
                this._value = Number(value);

                return this;
            },
            add: function(value) {
                var corrFactor = _.correctionFactor.call(null, this._value, value);

                function cback(accum, curr, currI, O) {
                    return accum + Math.round(corrFactor * curr);
                }

                this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

                return this;
            },
            subtract: function(value) {
                var corrFactor = _.correctionFactor.call(null, this._value, value);

                function cback(accum, curr, currI, O) {
                    return accum - Math.round(corrFactor * curr);
                }

                this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

                return this;
            },
            multiply: function(value) {
                function cback(accum, curr, currI, O) {
                    var corrFactor = _.correctionFactor(accum, curr);
                    return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
                }

                this._value = _.reduce([this._value, value], cback, 1);

                return this;
            },
            divide: function(value) {
                function cback(accum, curr, currI, O) {
                    var corrFactor = _.correctionFactor(accum, curr);
                    return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
                }

                this._value = _.reduce([this._value, value], cback);

                return this;
            },
            difference: function(value) {
                return Math.abs(numeral(this._value).subtract(value).value());
            }
        };

        /************************************
            Default Locale && Format
        ************************************/

        numeral.register('locale', 'en', {
            delimiters: {
                thousands: ',',
                decimal: '.'
            },
            abbreviations: {
                thousand: 'k',
                million: 'm',
                billion: 'b',
                trillion: 't'
            },
            ordinal: function(number) {
                var b = number % 10;
                return (~~(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                    (b === 2) ? 'nd' :
                    (b === 3) ? 'rd' : 'th';
            },
            currency: {
                symbol: '$'
            }
        });

        

    (function() {
            numeral.register('format', 'bps', {
                regexps: {
                    format: /(BPS)/,
                    unformat: /(BPS)/
                },
                format: function(value, format, roundingFunction) {
                    var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                        output;

                    value = value * 10000;

                    // check for space before BPS
                    format = format.replace(/\s?BPS/, '');

                    output = numeral._.numberToFormat(value, format, roundingFunction);

                    if (numeral._.includes(output, ')')) {
                        output = output.split('');

                        output.splice(-1, 0, space + 'BPS');

                        output = output.join('');
                    } else {
                        output = output + space + 'BPS';
                    }

                    return output;
                },
                unformat: function(string) {
                    return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
                }
            });
    })();


    (function() {
            var decimal = {
                base: 1000,
                suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            },
            binary = {
                base: 1024,
                suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
            };

        var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
                return decimal.suffixes.indexOf(item) < 0;
            }));
            var unformatRegex = allSuffixes.join('|');
            // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
            unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

        numeral.register('format', 'bytes', {
            regexps: {
                format: /([0\s]i?b)/,
                unformat: new RegExp(unformatRegex)
            },
            format: function(value, format, roundingFunction) {
                var output,
                    bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                    suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                    power,
                    min,
                    max;

                // check for space before
                format = format.replace(/\s?i?b/, '');

                for (power = 0; power <= bytes.suffixes.length; power++) {
                    min = Math.pow(bytes.base, power);
                    max = Math.pow(bytes.base, power + 1);

                    if (value === null || value === 0 || value >= min && value < max) {
                        suffix += bytes.suffixes[power];

                        if (min > 0) {
                            value = value / min;
                        }

                        break;
                    }
                }

                output = numeral._.numberToFormat(value, format, roundingFunction);

                return output + suffix;
            },
            unformat: function(string) {
                var value = numeral._.stringToNumber(string),
                    power,
                    bytesMultiplier;

                if (value) {
                    for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                        if (numeral._.includes(string, decimal.suffixes[power])) {
                            bytesMultiplier = Math.pow(decimal.base, power);

                            break;
                        }

                        if (numeral._.includes(string, binary.suffixes[power])) {
                            bytesMultiplier = Math.pow(binary.base, power);

                            break;
                        }
                    }

                    value *= (bytesMultiplier || 1);
                }

                return value;
            }
        });
    })();


    (function() {
            numeral.register('format', 'currency', {
            regexps: {
                format: /(\$)/
            },
            format: function(value, format, roundingFunction) {
                var locale = numeral.locales[numeral.options.currentLocale],
                    symbols = {
                        before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                        after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                    },
                    output,
                    symbol,
                    i;

                // strip format of spaces and $
                format = format.replace(/\s?\$\s?/, '');

                // format the number
                output = numeral._.numberToFormat(value, format, roundingFunction);

                // update the before and after based on value
                if (value >= 0) {
                    symbols.before = symbols.before.replace(/[\-\(]/, '');
                    symbols.after = symbols.after.replace(/[\-\)]/, '');
                } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                    symbols.before = '-' + symbols.before;
                }

                // loop through each before symbol
                for (i = 0; i < symbols.before.length; i++) {
                    symbol = symbols.before[i];

                    switch (symbol) {
                        case '$':
                            output = numeral._.insert(output, locale.currency.symbol, i);
                            break;
                        case ' ':
                            output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                            break;
                    }
                }

                // loop through each after symbol
                for (i = symbols.after.length - 1; i >= 0; i--) {
                    symbol = symbols.after[i];

                    switch (symbol) {
                        case '$':
                            output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                            break;
                        case ' ':
                            output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                            break;
                    }
                }


                return output;
            }
        });
    })();


    (function() {
            numeral.register('format', 'exponential', {
            regexps: {
                format: /(e\+|e-)/,
                unformat: /(e\+|e-)/
            },
            format: function(value, format, roundingFunction) {
                var output,
                    exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                    parts = exponential.split('e');

                format = format.replace(/e[\+|\-]{1}0/, '');

                output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

                return output + 'e' + parts[1];
            },
            unformat: function(string) {
                var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                    value = Number(parts[0]),
                    power = Number(parts[1]);

                power = numeral._.includes(string, 'e-') ? power *= -1 : power;

                function cback(accum, curr, currI, O) {
                    var corrFactor = numeral._.correctionFactor(accum, curr),
                        num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                    return num;
                }

                return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
            }
        });
    })();


    (function() {
            numeral.register('format', 'ordinal', {
            regexps: {
                format: /(o)/
            },
            format: function(value, format, roundingFunction) {
                var locale = numeral.locales[numeral.options.currentLocale],
                    output,
                    ordinal = numeral._.includes(format, ' o') ? ' ' : '';

                // check for space before
                format = format.replace(/\s?o/, '');

                ordinal += locale.ordinal(value);

                output = numeral._.numberToFormat(value, format, roundingFunction);

                return output + ordinal;
            }
        });
    })();


    (function() {
            numeral.register('format', 'percentage', {
            regexps: {
                format: /(%)/,
                unformat: /(%)/
            },
            format: function(value, format, roundingFunction) {
                var space = numeral._.includes(format, ' %') ? ' ' : '',
                    output;

                if (numeral.options.scalePercentBy100) {
                    value = value * 100;
                }

                // check for space before %
                format = format.replace(/\s?\%/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + '%');

                    output = output.join('');
                } else {
                    output = output + space + '%';
                }

                return output;
            },
            unformat: function(string) {
                var number = numeral._.stringToNumber(string);
                if (numeral.options.scalePercentBy100) {
                    return number * 0.01;
                }
                return number;
            }
        });
    })();


    (function() {
            numeral.register('format', 'time', {
            regexps: {
                format: /(:)/,
                unformat: /(:)/
            },
            format: function(value, format, roundingFunction) {
                var hours = Math.floor(value / 60 / 60),
                    minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                    seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

                return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            },
            unformat: function(string) {
                var timeArray = string.split(':'),
                    seconds = 0;

                // turn hours and minutes into seconds and add them all up
                if (timeArray.length === 3) {
                    // hours
                    seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                    // minutes
                    seconds = seconds + (Number(timeArray[1]) * 60);
                    // seconds
                    seconds = seconds + Number(timeArray[2]);
                } else if (timeArray.length === 2) {
                    // minutes
                    seconds = seconds + (Number(timeArray[0]) * 60);
                    // seconds
                    seconds = seconds + Number(timeArray[1]);
                }
                return Number(seconds);
            }
        });
    })();

    return numeral;
    }));
    });

    /* src/AppleAnime.svelte generated by Svelte v3.43.1 */

    const { console: console_1 } = globals;
    const file$1 = "src/AppleAnime.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let canvas_1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "id", canvasId);
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			set_style(canvas_1, "background-color", "#000");
    			add_location(canvas_1, file$1, 128, 5, 3186);
    			attr_dev(div0, "class", "canvas-container svelte-7fm08w");
    			add_location(div0, file$1, 127, 4, 3149);
    			attr_dev(div1, "class", "image-sequence svelte-7fm08w");
    			add_location(div1, file$1, 126, 3, 3115);
    			attr_dev(div2, "class", "scroll-sequence svelte-7fm08w");
    			add_location(div2, file$1, 125, 2, 3081);
    			attr_dev(div3, "class", "scroll-player-container svelte-7fm08w");
    			add_location(div3, file$1, 124, 1, 3039);
    			add_location(main, file$1, 123, 0, 3031);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, canvas_1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const canvasId = 'scroll-player';
    const imagesLength = 176; // ???????????????

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppleAnime', slots, []);
    	let name = 'Anime';
    	const width = document.documentElement.clientWidth;
    	const height = document.documentElement.clientHeight;
    	let boxHeight;

    	/**
     * ??????????????????
     */
    	function getImagesPath() {
    		let images = [];
    		const baseUrl = 'https://www.apple.com.cn/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/06-transparency-head/';

    		for (let i = 0; i < imagesLength; i++) {
    			images.push(`${baseUrl}${numeral(i).format('0000')}.jpg`);
    		}

    		return images;
    	}

    	let imagesManager = [];
    	let imagesPath = getImagesPath(); // ????????????????????????
    	let canvas;
    	let context;

    	/** ???????????? */
    	function loadImages() {
    		const loadNextImage = src => {
    			const img = new Image();

    			// ????????????, ??????????????????
    			img.onload = e => {
    				imagesManager.push(img);

    				if (imagesManager.length === imagesLength) {
    					// ?????????????????????????????? ??????????????????
    					imagesLoadComplete();
    				}
    			};

    			img.src = src;
    			if (imagesPath.length === 0) return;
    			loadNextImage(imagesPath.shift());
    		};

    		loadNextImage(imagesPath.shift());
    	}

    	function init() {
    		boxHeight = document.querySelector('.scroll-player-container').clientHeight - document.documentElement.clientHeight;
    		canvas = document.getElementById(canvasId);
    		context = canvas.getContext('2d');

    		// ??????scroll????????????
    		document.addEventListener('scroll', handleScroll);

    		// ????????????????????????????????????
    		loadImages();
    	}

    	let scrollIndex = 0; // ?????????????????????????????????????????????
    	let currentIndex = 0; // ??????????????????????????????
    	let raf = null;

    	/** ???????????????????????? */
    	function imagesLoadComplete() {
    		console.log('?????? ???? ????????????!');
    		GameRun();
    	}

    	function GameRun() {
    		raf = window.requestAnimationFrame(draw);
    	}

    	/**
     * ????????????????????????
     */
    	function draw() {
    		if (currentIndex <= scrollIndex) {
    			drawImages(imagesManager[currentIndex]);
    			currentIndex + 1 < scrollIndex && currentIndex++;
    		} else if (currentIndex >= scrollIndex) {
    			drawImages(imagesManager[currentIndex]);
    			currentIndex - 1 > scrollIndex && currentIndex--;
    		}

    		if (currentIndex > imagesLength) {
    			currentIndex = imagesLength;
    		}

    		raf = window.requestAnimationFrame(draw);
    	}

    	/**
     * ????????????
     */
    	function drawImages(img) {
    		context.clearRect(0, 0, width, height);
    		context.drawImage(img, 0, 0);
    	}

    	/**
     * ????????????????????????, ?????????scrollIndex
     */
    	function handleScroll() {
    		const docElement = document.documentElement;
    		docElement.scrollHeight;
    		docElement.clientHeight;
    		docElement.scrollTop;
    		let share = boxHeight / imagesLength;

    		// ??????????????????, ??????????????????????????????????????????
    		// scrollIndex = Math.round(scrollTop * imagesLength / (scrollHeight - clientHeight));
    		scrollIndex = Math.round(document.documentElement.scrollTop / share);

    		// console.log('compute', Math.round(boxHeight / imagesLength));
    		console.log('compute', document.documentElement.scrollTop, Math.round(document.documentElement.scrollTop / share));
    	}

    	window.onload = () => {
    		init();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AppleAnime> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		numeral,
    		name,
    		width,
    		height,
    		canvasId,
    		imagesLength,
    		boxHeight,
    		getImagesPath,
    		imagesManager,
    		imagesPath,
    		canvas,
    		context,
    		loadImages,
    		init,
    		scrollIndex,
    		currentIndex,
    		raf,
    		imagesLoadComplete,
    		GameRun,
    		draw,
    		drawImages,
    		handleScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) name = $$props.name;
    		if ('boxHeight' in $$props) boxHeight = $$props.boxHeight;
    		if ('imagesManager' in $$props) imagesManager = $$props.imagesManager;
    		if ('imagesPath' in $$props) imagesPath = $$props.imagesPath;
    		if ('canvas' in $$props) canvas = $$props.canvas;
    		if ('context' in $$props) context = $$props.context;
    		if ('scrollIndex' in $$props) scrollIndex = $$props.scrollIndex;
    		if ('currentIndex' in $$props) currentIndex = $$props.currentIndex;
    		if ('raf' in $$props) raf = $$props.raf;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height];
    }

    class AppleAnime extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppleAnime",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let anime;
    	let current;
    	anime = new AppleAnime({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(anime.$$.fragment);
    			attr_dev(main, "class", "svelte-1gofwrv");
    			add_location(main, file, 5, 0, 80);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(anime, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(anime.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(anime.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(anime);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Anime: AppleAnime, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
