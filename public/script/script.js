(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = typeof require !== "undefined" ? require : (x) => {
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/leaflet/dist/leaflet-src.js
  var require_leaflet_src = __commonJS({
    "node_modules/leaflet/dist/leaflet-src.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.L = {});
      })(exports, function(exports2) {
        "use strict";
        var version = "1.7.1";
        function extend(dest) {
          var i, j, len, src;
          for (j = 1, len = arguments.length; j < len; j++) {
            src = arguments[j];
            for (i in src) {
              dest[i] = src[i];
            }
          }
          return dest;
        }
        var create = Object.create || function() {
          function F() {
          }
          return function(proto) {
            F.prototype = proto;
            return new F();
          };
        }();
        function bind(fn, obj) {
          var slice = Array.prototype.slice;
          if (fn.bind) {
            return fn.bind.apply(fn, slice.call(arguments, 1));
          }
          var args = slice.call(arguments, 2);
          return function() {
            return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
          };
        }
        var lastId = 0;
        function stamp(obj) {
          obj._leaflet_id = obj._leaflet_id || ++lastId;
          return obj._leaflet_id;
        }
        function throttle(fn, time, context) {
          var lock, args, wrapperFn, later;
          later = function() {
            lock = false;
            if (args) {
              wrapperFn.apply(context, args);
              args = false;
            }
          };
          wrapperFn = function() {
            if (lock) {
              args = arguments;
            } else {
              fn.apply(context, arguments);
              setTimeout(later, time);
              lock = true;
            }
          };
          return wrapperFn;
        }
        function wrapNum(x, range, includeMax) {
          var max = range[1], min = range[0], d = max - min;
          return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
        }
        function falseFn() {
          return false;
        }
        function formatNum(num, digits) {
          var pow = Math.pow(10, digits === void 0 ? 6 : digits);
          return Math.round(num * pow) / pow;
        }
        function trim(str) {
          return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
        }
        function splitWords(str) {
          return trim(str).split(/\s+/);
        }
        function setOptions(obj, options) {
          if (!Object.prototype.hasOwnProperty.call(obj, "options")) {
            obj.options = obj.options ? create(obj.options) : {};
          }
          for (var i in options) {
            obj.options[i] = options[i];
          }
          return obj.options;
        }
        function getParamString(obj, existingUrl, uppercase) {
          var params = [];
          for (var i in obj) {
            params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + "=" + encodeURIComponent(obj[i]));
          }
          return (!existingUrl || existingUrl.indexOf("?") === -1 ? "?" : "&") + params.join("&");
        }
        var templateRe = /\{ *([\w_-]+) *\}/g;
        function template(str, data) {
          return str.replace(templateRe, function(str2, key) {
            var value = data[key];
            if (value === void 0) {
              throw new Error("No value provided for variable " + str2);
            } else if (typeof value === "function") {
              value = value(data);
            }
            return value;
          });
        }
        var isArray = Array.isArray || function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
        function indexOf(array, el) {
          for (var i = 0; i < array.length; i++) {
            if (array[i] === el) {
              return i;
            }
          }
          return -1;
        }
        var emptyImageUrl = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        function getPrefixed(name) {
          return window["webkit" + name] || window["moz" + name] || window["ms" + name];
        }
        var lastTime = 0;
        function timeoutDefer(fn) {
          var time = +new Date(), timeToCall = Math.max(0, 16 - (time - lastTime));
          lastTime = time + timeToCall;
          return window.setTimeout(fn, timeToCall);
        }
        var requestFn = window.requestAnimationFrame || getPrefixed("RequestAnimationFrame") || timeoutDefer;
        var cancelFn = window.cancelAnimationFrame || getPrefixed("CancelAnimationFrame") || getPrefixed("CancelRequestAnimationFrame") || function(id) {
          window.clearTimeout(id);
        };
        function requestAnimFrame(fn, context, immediate) {
          if (immediate && requestFn === timeoutDefer) {
            fn.call(context);
          } else {
            return requestFn.call(window, bind(fn, context));
          }
        }
        function cancelAnimFrame(id) {
          if (id) {
            cancelFn.call(window, id);
          }
        }
        var Util = {
          extend,
          create,
          bind,
          lastId,
          stamp,
          throttle,
          wrapNum,
          falseFn,
          formatNum,
          trim,
          splitWords,
          setOptions,
          getParamString,
          template,
          isArray,
          indexOf,
          emptyImageUrl,
          requestFn,
          cancelFn,
          requestAnimFrame,
          cancelAnimFrame
        };
        function Class() {
        }
        Class.extend = function(props) {
          var NewClass = function() {
            if (this.initialize) {
              this.initialize.apply(this, arguments);
            }
            this.callInitHooks();
          };
          var parentProto = NewClass.__super__ = this.prototype;
          var proto = create(parentProto);
          proto.constructor = NewClass;
          NewClass.prototype = proto;
          for (var i in this) {
            if (Object.prototype.hasOwnProperty.call(this, i) && i !== "prototype" && i !== "__super__") {
              NewClass[i] = this[i];
            }
          }
          if (props.statics) {
            extend(NewClass, props.statics);
            delete props.statics;
          }
          if (props.includes) {
            checkDeprecatedMixinEvents(props.includes);
            extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
          }
          if (proto.options) {
            props.options = extend(create(proto.options), props.options);
          }
          extend(proto, props);
          proto._initHooks = [];
          proto.callInitHooks = function() {
            if (this._initHooksCalled) {
              return;
            }
            if (parentProto.callInitHooks) {
              parentProto.callInitHooks.call(this);
            }
            this._initHooksCalled = true;
            for (var i2 = 0, len = proto._initHooks.length; i2 < len; i2++) {
              proto._initHooks[i2].call(this);
            }
          };
          return NewClass;
        };
        Class.include = function(props) {
          extend(this.prototype, props);
          return this;
        };
        Class.mergeOptions = function(options) {
          extend(this.prototype.options, options);
          return this;
        };
        Class.addInitHook = function(fn) {
          var args = Array.prototype.slice.call(arguments, 1);
          var init = typeof fn === "function" ? fn : function() {
            this[fn].apply(this, args);
          };
          this.prototype._initHooks = this.prototype._initHooks || [];
          this.prototype._initHooks.push(init);
          return this;
        };
        function checkDeprecatedMixinEvents(includes) {
          if (typeof L === "undefined" || !L || !L.Mixin) {
            return;
          }
          includes = isArray(includes) ? includes : [includes];
          for (var i = 0; i < includes.length; i++) {
            if (includes[i] === L.Mixin.Events) {
              console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
            }
          }
        }
        var Events = {
          on: function(types, fn, context) {
            if (typeof types === "object") {
              for (var type in types) {
                this._on(type, types[type], fn);
              }
            } else {
              types = splitWords(types);
              for (var i = 0, len = types.length; i < len; i++) {
                this._on(types[i], fn, context);
              }
            }
            return this;
          },
          off: function(types, fn, context) {
            if (!types) {
              delete this._events;
            } else if (typeof types === "object") {
              for (var type in types) {
                this._off(type, types[type], fn);
              }
            } else {
              types = splitWords(types);
              for (var i = 0, len = types.length; i < len; i++) {
                this._off(types[i], fn, context);
              }
            }
            return this;
          },
          _on: function(type, fn, context) {
            this._events = this._events || {};
            var typeListeners = this._events[type];
            if (!typeListeners) {
              typeListeners = [];
              this._events[type] = typeListeners;
            }
            if (context === this) {
              context = void 0;
            }
            var newListener = { fn, ctx: context }, listeners = typeListeners;
            for (var i = 0, len = listeners.length; i < len; i++) {
              if (listeners[i].fn === fn && listeners[i].ctx === context) {
                return;
              }
            }
            listeners.push(newListener);
          },
          _off: function(type, fn, context) {
            var listeners, i, len;
            if (!this._events) {
              return;
            }
            listeners = this._events[type];
            if (!listeners) {
              return;
            }
            if (!fn) {
              for (i = 0, len = listeners.length; i < len; i++) {
                listeners[i].fn = falseFn;
              }
              delete this._events[type];
              return;
            }
            if (context === this) {
              context = void 0;
            }
            if (listeners) {
              for (i = 0, len = listeners.length; i < len; i++) {
                var l = listeners[i];
                if (l.ctx !== context) {
                  continue;
                }
                if (l.fn === fn) {
                  l.fn = falseFn;
                  if (this._firingCount) {
                    this._events[type] = listeners = listeners.slice();
                  }
                  listeners.splice(i, 1);
                  return;
                }
              }
            }
          },
          fire: function(type, data, propagate) {
            if (!this.listens(type, propagate)) {
              return this;
            }
            var event = extend({}, data, {
              type,
              target: this,
              sourceTarget: data && data.sourceTarget || this
            });
            if (this._events) {
              var listeners = this._events[type];
              if (listeners) {
                this._firingCount = this._firingCount + 1 || 1;
                for (var i = 0, len = listeners.length; i < len; i++) {
                  var l = listeners[i];
                  l.fn.call(l.ctx || this, event);
                }
                this._firingCount--;
              }
            }
            if (propagate) {
              this._propagateEvent(event);
            }
            return this;
          },
          listens: function(type, propagate) {
            var listeners = this._events && this._events[type];
            if (listeners && listeners.length) {
              return true;
            }
            if (propagate) {
              for (var id in this._eventParents) {
                if (this._eventParents[id].listens(type, propagate)) {
                  return true;
                }
              }
            }
            return false;
          },
          once: function(types, fn, context) {
            if (typeof types === "object") {
              for (var type in types) {
                this.once(type, types[type], fn);
              }
              return this;
            }
            var handler = bind(function() {
              this.off(types, fn, context).off(types, handler, context);
            }, this);
            return this.on(types, fn, context).on(types, handler, context);
          },
          addEventParent: function(obj) {
            this._eventParents = this._eventParents || {};
            this._eventParents[stamp(obj)] = obj;
            return this;
          },
          removeEventParent: function(obj) {
            if (this._eventParents) {
              delete this._eventParents[stamp(obj)];
            }
            return this;
          },
          _propagateEvent: function(e) {
            for (var id in this._eventParents) {
              this._eventParents[id].fire(e.type, extend({
                layer: e.target,
                propagatedFrom: e.target
              }, e), true);
            }
          }
        };
        Events.addEventListener = Events.on;
        Events.removeEventListener = Events.clearAllEventListeners = Events.off;
        Events.addOneTimeEventListener = Events.once;
        Events.fireEvent = Events.fire;
        Events.hasEventListeners = Events.listens;
        var Evented = Class.extend(Events);
        function Point(x, y, round) {
          this.x = round ? Math.round(x) : x;
          this.y = round ? Math.round(y) : y;
        }
        var trunc = Math.trunc || function(v) {
          return v > 0 ? Math.floor(v) : Math.ceil(v);
        };
        Point.prototype = {
          clone: function() {
            return new Point(this.x, this.y);
          },
          add: function(point) {
            return this.clone()._add(toPoint(point));
          },
          _add: function(point) {
            this.x += point.x;
            this.y += point.y;
            return this;
          },
          subtract: function(point) {
            return this.clone()._subtract(toPoint(point));
          },
          _subtract: function(point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
          },
          divideBy: function(num) {
            return this.clone()._divideBy(num);
          },
          _divideBy: function(num) {
            this.x /= num;
            this.y /= num;
            return this;
          },
          multiplyBy: function(num) {
            return this.clone()._multiplyBy(num);
          },
          _multiplyBy: function(num) {
            this.x *= num;
            this.y *= num;
            return this;
          },
          scaleBy: function(point) {
            return new Point(this.x * point.x, this.y * point.y);
          },
          unscaleBy: function(point) {
            return new Point(this.x / point.x, this.y / point.y);
          },
          round: function() {
            return this.clone()._round();
          },
          _round: function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
          },
          floor: function() {
            return this.clone()._floor();
          },
          _floor: function() {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
          },
          ceil: function() {
            return this.clone()._ceil();
          },
          _ceil: function() {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
          },
          trunc: function() {
            return this.clone()._trunc();
          },
          _trunc: function() {
            this.x = trunc(this.x);
            this.y = trunc(this.y);
            return this;
          },
          distanceTo: function(point) {
            point = toPoint(point);
            var x = point.x - this.x, y = point.y - this.y;
            return Math.sqrt(x * x + y * y);
          },
          equals: function(point) {
            point = toPoint(point);
            return point.x === this.x && point.y === this.y;
          },
          contains: function(point) {
            point = toPoint(point);
            return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
          },
          toString: function() {
            return "Point(" + formatNum(this.x) + ", " + formatNum(this.y) + ")";
          }
        };
        function toPoint(x, y, round) {
          if (x instanceof Point) {
            return x;
          }
          if (isArray(x)) {
            return new Point(x[0], x[1]);
          }
          if (x === void 0 || x === null) {
            return x;
          }
          if (typeof x === "object" && "x" in x && "y" in x) {
            return new Point(x.x, x.y);
          }
          return new Point(x, y, round);
        }
        function Bounds(a, b) {
          if (!a) {
            return;
          }
          var points = b ? [a, b] : a;
          for (var i = 0, len = points.length; i < len; i++) {
            this.extend(points[i]);
          }
        }
        Bounds.prototype = {
          extend: function(point) {
            point = toPoint(point);
            if (!this.min && !this.max) {
              this.min = point.clone();
              this.max = point.clone();
            } else {
              this.min.x = Math.min(point.x, this.min.x);
              this.max.x = Math.max(point.x, this.max.x);
              this.min.y = Math.min(point.y, this.min.y);
              this.max.y = Math.max(point.y, this.max.y);
            }
            return this;
          },
          getCenter: function(round) {
            return new Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, round);
          },
          getBottomLeft: function() {
            return new Point(this.min.x, this.max.y);
          },
          getTopRight: function() {
            return new Point(this.max.x, this.min.y);
          },
          getTopLeft: function() {
            return this.min;
          },
          getBottomRight: function() {
            return this.max;
          },
          getSize: function() {
            return this.max.subtract(this.min);
          },
          contains: function(obj) {
            var min, max;
            if (typeof obj[0] === "number" || obj instanceof Point) {
              obj = toPoint(obj);
            } else {
              obj = toBounds(obj);
            }
            if (obj instanceof Bounds) {
              min = obj.min;
              max = obj.max;
            } else {
              min = max = obj;
            }
            return min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y;
          },
          intersects: function(bounds) {
            bounds = toBounds(bounds);
            var min = this.min, max = this.max, min2 = bounds.min, max2 = bounds.max, xIntersects = max2.x >= min.x && min2.x <= max.x, yIntersects = max2.y >= min.y && min2.y <= max.y;
            return xIntersects && yIntersects;
          },
          overlaps: function(bounds) {
            bounds = toBounds(bounds);
            var min = this.min, max = this.max, min2 = bounds.min, max2 = bounds.max, xOverlaps = max2.x > min.x && min2.x < max.x, yOverlaps = max2.y > min.y && min2.y < max.y;
            return xOverlaps && yOverlaps;
          },
          isValid: function() {
            return !!(this.min && this.max);
          }
        };
        function toBounds(a, b) {
          if (!a || a instanceof Bounds) {
            return a;
          }
          return new Bounds(a, b);
        }
        function LatLngBounds(corner1, corner2) {
          if (!corner1) {
            return;
          }
          var latlngs = corner2 ? [corner1, corner2] : corner1;
          for (var i = 0, len = latlngs.length; i < len; i++) {
            this.extend(latlngs[i]);
          }
        }
        LatLngBounds.prototype = {
          extend: function(obj) {
            var sw = this._southWest, ne = this._northEast, sw2, ne2;
            if (obj instanceof LatLng) {
              sw2 = obj;
              ne2 = obj;
            } else if (obj instanceof LatLngBounds) {
              sw2 = obj._southWest;
              ne2 = obj._northEast;
              if (!sw2 || !ne2) {
                return this;
              }
            } else {
              return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
            }
            if (!sw && !ne) {
              this._southWest = new LatLng(sw2.lat, sw2.lng);
              this._northEast = new LatLng(ne2.lat, ne2.lng);
            } else {
              sw.lat = Math.min(sw2.lat, sw.lat);
              sw.lng = Math.min(sw2.lng, sw.lng);
              ne.lat = Math.max(ne2.lat, ne.lat);
              ne.lng = Math.max(ne2.lng, ne.lng);
            }
            return this;
          },
          pad: function(bufferRatio) {
            var sw = this._southWest, ne = this._northEast, heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio, widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
            return new LatLngBounds(new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer), new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
          },
          getCenter: function() {
            return new LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
          },
          getSouthWest: function() {
            return this._southWest;
          },
          getNorthEast: function() {
            return this._northEast;
          },
          getNorthWest: function() {
            return new LatLng(this.getNorth(), this.getWest());
          },
          getSouthEast: function() {
            return new LatLng(this.getSouth(), this.getEast());
          },
          getWest: function() {
            return this._southWest.lng;
          },
          getSouth: function() {
            return this._southWest.lat;
          },
          getEast: function() {
            return this._northEast.lng;
          },
          getNorth: function() {
            return this._northEast.lat;
          },
          contains: function(obj) {
            if (typeof obj[0] === "number" || obj instanceof LatLng || "lat" in obj) {
              obj = toLatLng(obj);
            } else {
              obj = toLatLngBounds(obj);
            }
            var sw = this._southWest, ne = this._northEast, sw2, ne2;
            if (obj instanceof LatLngBounds) {
              sw2 = obj.getSouthWest();
              ne2 = obj.getNorthEast();
            } else {
              sw2 = ne2 = obj;
            }
            return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;
          },
          intersects: function(bounds) {
            bounds = toLatLngBounds(bounds);
            var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat, lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;
            return latIntersects && lngIntersects;
          },
          overlaps: function(bounds) {
            bounds = toLatLngBounds(bounds);
            var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latOverlaps = ne2.lat > sw.lat && sw2.lat < ne.lat, lngOverlaps = ne2.lng > sw.lng && sw2.lng < ne.lng;
            return latOverlaps && lngOverlaps;
          },
          toBBoxString: function() {
            return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
          },
          equals: function(bounds, maxMargin) {
            if (!bounds) {
              return false;
            }
            bounds = toLatLngBounds(bounds);
            return this._southWest.equals(bounds.getSouthWest(), maxMargin) && this._northEast.equals(bounds.getNorthEast(), maxMargin);
          },
          isValid: function() {
            return !!(this._southWest && this._northEast);
          }
        };
        function toLatLngBounds(a, b) {
          if (a instanceof LatLngBounds) {
            return a;
          }
          return new LatLngBounds(a, b);
        }
        function LatLng(lat, lng, alt) {
          if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid LatLng object: (" + lat + ", " + lng + ")");
          }
          this.lat = +lat;
          this.lng = +lng;
          if (alt !== void 0) {
            this.alt = +alt;
          }
        }
        LatLng.prototype = {
          equals: function(obj, maxMargin) {
            if (!obj) {
              return false;
            }
            obj = toLatLng(obj);
            var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));
            return margin <= (maxMargin === void 0 ? 1e-9 : maxMargin);
          },
          toString: function(precision) {
            return "LatLng(" + formatNum(this.lat, precision) + ", " + formatNum(this.lng, precision) + ")";
          },
          distanceTo: function(other) {
            return Earth.distance(this, toLatLng(other));
          },
          wrap: function() {
            return Earth.wrapLatLng(this);
          },
          toBounds: function(sizeInMeters) {
            var latAccuracy = 180 * sizeInMeters / 40075017, lngAccuracy = latAccuracy / Math.cos(Math.PI / 180 * this.lat);
            return toLatLngBounds([this.lat - latAccuracy, this.lng - lngAccuracy], [this.lat + latAccuracy, this.lng + lngAccuracy]);
          },
          clone: function() {
            return new LatLng(this.lat, this.lng, this.alt);
          }
        };
        function toLatLng(a, b, c) {
          if (a instanceof LatLng) {
            return a;
          }
          if (isArray(a) && typeof a[0] !== "object") {
            if (a.length === 3) {
              return new LatLng(a[0], a[1], a[2]);
            }
            if (a.length === 2) {
              return new LatLng(a[0], a[1]);
            }
            return null;
          }
          if (a === void 0 || a === null) {
            return a;
          }
          if (typeof a === "object" && "lat" in a) {
            return new LatLng(a.lat, "lng" in a ? a.lng : a.lon, a.alt);
          }
          if (b === void 0) {
            return null;
          }
          return new LatLng(a, b, c);
        }
        var CRS = {
          latLngToPoint: function(latlng, zoom2) {
            var projectedPoint = this.projection.project(latlng), scale2 = this.scale(zoom2);
            return this.transformation._transform(projectedPoint, scale2);
          },
          pointToLatLng: function(point, zoom2) {
            var scale2 = this.scale(zoom2), untransformedPoint = this.transformation.untransform(point, scale2);
            return this.projection.unproject(untransformedPoint);
          },
          project: function(latlng) {
            return this.projection.project(latlng);
          },
          unproject: function(point) {
            return this.projection.unproject(point);
          },
          scale: function(zoom2) {
            return 256 * Math.pow(2, zoom2);
          },
          zoom: function(scale2) {
            return Math.log(scale2 / 256) / Math.LN2;
          },
          getProjectedBounds: function(zoom2) {
            if (this.infinite) {
              return null;
            }
            var b = this.projection.bounds, s = this.scale(zoom2), min = this.transformation.transform(b.min, s), max = this.transformation.transform(b.max, s);
            return new Bounds(min, max);
          },
          infinite: false,
          wrapLatLng: function(latlng) {
            var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng, lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat, alt = latlng.alt;
            return new LatLng(lat, lng, alt);
          },
          wrapLatLngBounds: function(bounds) {
            var center = bounds.getCenter(), newCenter = this.wrapLatLng(center), latShift = center.lat - newCenter.lat, lngShift = center.lng - newCenter.lng;
            if (latShift === 0 && lngShift === 0) {
              return bounds;
            }
            var sw = bounds.getSouthWest(), ne = bounds.getNorthEast(), newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift), newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);
            return new LatLngBounds(newSw, newNe);
          }
        };
        var Earth = extend({}, CRS, {
          wrapLng: [-180, 180],
          R: 6371e3,
          distance: function(latlng1, latlng2) {
            var rad = Math.PI / 180, lat1 = latlng1.lat * rad, lat2 = latlng2.lat * rad, sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2), sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2), a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon, c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return this.R * c;
          }
        });
        var earthRadius = 6378137;
        var SphericalMercator = {
          R: earthRadius,
          MAX_LATITUDE: 85.0511287798,
          project: function(latlng) {
            var d = Math.PI / 180, max = this.MAX_LATITUDE, lat = Math.max(Math.min(max, latlng.lat), -max), sin = Math.sin(lat * d);
            return new Point(this.R * latlng.lng * d, this.R * Math.log((1 + sin) / (1 - sin)) / 2);
          },
          unproject: function(point) {
            var d = 180 / Math.PI;
            return new LatLng((2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d, point.x * d / this.R);
          },
          bounds: function() {
            var d = earthRadius * Math.PI;
            return new Bounds([-d, -d], [d, d]);
          }()
        };
        function Transformation(a, b, c, d) {
          if (isArray(a)) {
            this._a = a[0];
            this._b = a[1];
            this._c = a[2];
            this._d = a[3];
            return;
          }
          this._a = a;
          this._b = b;
          this._c = c;
          this._d = d;
        }
        Transformation.prototype = {
          transform: function(point, scale2) {
            return this._transform(point.clone(), scale2);
          },
          _transform: function(point, scale2) {
            scale2 = scale2 || 1;
            point.x = scale2 * (this._a * point.x + this._b);
            point.y = scale2 * (this._c * point.y + this._d);
            return point;
          },
          untransform: function(point, scale2) {
            scale2 = scale2 || 1;
            return new Point((point.x / scale2 - this._b) / this._a, (point.y / scale2 - this._d) / this._c);
          }
        };
        function toTransformation(a, b, c, d) {
          return new Transformation(a, b, c, d);
        }
        var EPSG3857 = extend({}, Earth, {
          code: "EPSG:3857",
          projection: SphericalMercator,
          transformation: function() {
            var scale2 = 0.5 / (Math.PI * SphericalMercator.R);
            return toTransformation(scale2, 0.5, -scale2, 0.5);
          }()
        });
        var EPSG900913 = extend({}, EPSG3857, {
          code: "EPSG:900913"
        });
        function svgCreate(name) {
          return document.createElementNS("http://www.w3.org/2000/svg", name);
        }
        function pointsToPath(rings, closed) {
          var str = "", i, j, len, len2, points, p;
          for (i = 0, len = rings.length; i < len; i++) {
            points = rings[i];
            for (j = 0, len2 = points.length; j < len2; j++) {
              p = points[j];
              str += (j ? "L" : "M") + p.x + " " + p.y;
            }
            str += closed ? svg ? "z" : "x" : "";
          }
          return str || "M0 0";
        }
        var style$1 = document.documentElement.style;
        var ie = "ActiveXObject" in window;
        var ielt9 = ie && !document.addEventListener;
        var edge = "msLaunchUri" in navigator && !("documentMode" in document);
        var webkit = userAgentContains("webkit");
        var android = userAgentContains("android");
        var android23 = userAgentContains("android 2") || userAgentContains("android 3");
        var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10);
        var androidStock = android && userAgentContains("Google") && webkitVer < 537 && !("AudioNode" in window);
        var opera = !!window.opera;
        var chrome = !edge && userAgentContains("chrome");
        var gecko = userAgentContains("gecko") && !webkit && !opera && !ie;
        var safari = !chrome && userAgentContains("safari");
        var phantom = userAgentContains("phantom");
        var opera12 = "OTransition" in style$1;
        var win = navigator.platform.indexOf("Win") === 0;
        var ie3d = ie && "transition" in style$1;
        var webkit3d = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !android23;
        var gecko3d = "MozPerspective" in style$1;
        var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;
        var mobile = typeof orientation !== "undefined" || userAgentContains("mobile");
        var mobileWebkit = mobile && webkit;
        var mobileWebkit3d = mobile && webkit3d;
        var msPointer = !window.PointerEvent && window.MSPointerEvent;
        var pointer = !!(window.PointerEvent || msPointer);
        var touch = !window.L_NO_TOUCH && (pointer || "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
        var mobileOpera = mobile && opera;
        var mobileGecko = mobile && gecko;
        var retina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;
        var passiveEvents = function() {
          var supportsPassiveOption = false;
          try {
            var opts = Object.defineProperty({}, "passive", {
              get: function() {
                supportsPassiveOption = true;
              }
            });
            window.addEventListener("testPassiveEventSupport", falseFn, opts);
            window.removeEventListener("testPassiveEventSupport", falseFn, opts);
          } catch (e) {
          }
          return supportsPassiveOption;
        }();
        var canvas = function() {
          return !!document.createElement("canvas").getContext;
        }();
        var svg = !!(document.createElementNS && svgCreate("svg").createSVGRect);
        var vml = !svg && function() {
          try {
            var div = document.createElement("div");
            div.innerHTML = '<v:shape adj="1"/>';
            var shape = div.firstChild;
            shape.style.behavior = "url(#default#VML)";
            return shape && typeof shape.adj === "object";
          } catch (e) {
            return false;
          }
        }();
        function userAgentContains(str) {
          return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
        }
        var Browser = {
          ie,
          ielt9,
          edge,
          webkit,
          android,
          android23,
          androidStock,
          opera,
          chrome,
          gecko,
          safari,
          phantom,
          opera12,
          win,
          ie3d,
          webkit3d,
          gecko3d,
          any3d,
          mobile,
          mobileWebkit,
          mobileWebkit3d,
          msPointer,
          pointer,
          touch,
          mobileOpera,
          mobileGecko,
          retina,
          passiveEvents,
          canvas,
          svg,
          vml
        };
        var POINTER_DOWN = msPointer ? "MSPointerDown" : "pointerdown";
        var POINTER_MOVE = msPointer ? "MSPointerMove" : "pointermove";
        var POINTER_UP = msPointer ? "MSPointerUp" : "pointerup";
        var POINTER_CANCEL = msPointer ? "MSPointerCancel" : "pointercancel";
        var _pointers = {};
        var _pointerDocListener = false;
        function addPointerListener(obj, type, handler, id) {
          if (type === "touchstart") {
            _addPointerStart(obj, handler, id);
          } else if (type === "touchmove") {
            _addPointerMove(obj, handler, id);
          } else if (type === "touchend") {
            _addPointerEnd(obj, handler, id);
          }
          return this;
        }
        function removePointerListener(obj, type, id) {
          var handler = obj["_leaflet_" + type + id];
          if (type === "touchstart") {
            obj.removeEventListener(POINTER_DOWN, handler, false);
          } else if (type === "touchmove") {
            obj.removeEventListener(POINTER_MOVE, handler, false);
          } else if (type === "touchend") {
            obj.removeEventListener(POINTER_UP, handler, false);
            obj.removeEventListener(POINTER_CANCEL, handler, false);
          }
          return this;
        }
        function _addPointerStart(obj, handler, id) {
          var onDown = bind(function(e) {
            if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
              preventDefault(e);
            }
            _handlePointer(e, handler);
          });
          obj["_leaflet_touchstart" + id] = onDown;
          obj.addEventListener(POINTER_DOWN, onDown, false);
          if (!_pointerDocListener) {
            document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
            document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
            document.addEventListener(POINTER_UP, _globalPointerUp, true);
            document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);
            _pointerDocListener = true;
          }
        }
        function _globalPointerDown(e) {
          _pointers[e.pointerId] = e;
        }
        function _globalPointerMove(e) {
          if (_pointers[e.pointerId]) {
            _pointers[e.pointerId] = e;
          }
        }
        function _globalPointerUp(e) {
          delete _pointers[e.pointerId];
        }
        function _handlePointer(e, handler) {
          e.touches = [];
          for (var i in _pointers) {
            e.touches.push(_pointers[i]);
          }
          e.changedTouches = [e];
          handler(e);
        }
        function _addPointerMove(obj, handler, id) {
          var onMove = function(e) {
            if (e.pointerType === (e.MSPOINTER_TYPE_MOUSE || "mouse") && e.buttons === 0) {
              return;
            }
            _handlePointer(e, handler);
          };
          obj["_leaflet_touchmove" + id] = onMove;
          obj.addEventListener(POINTER_MOVE, onMove, false);
        }
        function _addPointerEnd(obj, handler, id) {
          var onUp = function(e) {
            _handlePointer(e, handler);
          };
          obj["_leaflet_touchend" + id] = onUp;
          obj.addEventListener(POINTER_UP, onUp, false);
          obj.addEventListener(POINTER_CANCEL, onUp, false);
        }
        var _touchstart = msPointer ? "MSPointerDown" : pointer ? "pointerdown" : "touchstart";
        var _touchend = msPointer ? "MSPointerUp" : pointer ? "pointerup" : "touchend";
        var _pre = "_leaflet_";
        function addDoubleTapListener(obj, handler, id) {
          var last, touch$$1, doubleTap = false, delay = 250;
          function onTouchStart(e) {
            if (pointer) {
              if (!e.isPrimary) {
                return;
              }
              if (e.pointerType === "mouse") {
                return;
              }
            } else if (e.touches.length > 1) {
              return;
            }
            var now = Date.now(), delta = now - (last || now);
            touch$$1 = e.touches ? e.touches[0] : e;
            doubleTap = delta > 0 && delta <= delay;
            last = now;
          }
          function onTouchEnd(e) {
            if (doubleTap && !touch$$1.cancelBubble) {
              if (pointer) {
                if (e.pointerType === "mouse") {
                  return;
                }
                var newTouch = {}, prop, i;
                for (i in touch$$1) {
                  prop = touch$$1[i];
                  newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
                }
                touch$$1 = newTouch;
              }
              touch$$1.type = "dblclick";
              touch$$1.button = 0;
              handler(touch$$1);
              last = null;
            }
          }
          obj[_pre + _touchstart + id] = onTouchStart;
          obj[_pre + _touchend + id] = onTouchEnd;
          obj[_pre + "dblclick" + id] = handler;
          obj.addEventListener(_touchstart, onTouchStart, passiveEvents ? { passive: false } : false);
          obj.addEventListener(_touchend, onTouchEnd, passiveEvents ? { passive: false } : false);
          obj.addEventListener("dblclick", handler, false);
          return this;
        }
        function removeDoubleTapListener(obj, id) {
          var touchstart = obj[_pre + _touchstart + id], touchend = obj[_pre + _touchend + id], dblclick = obj[_pre + "dblclick" + id];
          obj.removeEventListener(_touchstart, touchstart, passiveEvents ? { passive: false } : false);
          obj.removeEventListener(_touchend, touchend, passiveEvents ? { passive: false } : false);
          obj.removeEventListener("dblclick", dblclick, false);
          return this;
        }
        var TRANSFORM = testProp(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]);
        var TRANSITION = testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
        var TRANSITION_END = TRANSITION === "webkitTransition" || TRANSITION === "OTransition" ? TRANSITION + "End" : "transitionend";
        function get(id) {
          return typeof id === "string" ? document.getElementById(id) : id;
        }
        function getStyle(el, style) {
          var value = el.style[style] || el.currentStyle && el.currentStyle[style];
          if ((!value || value === "auto") && document.defaultView) {
            var css = document.defaultView.getComputedStyle(el, null);
            value = css ? css[style] : null;
          }
          return value === "auto" ? null : value;
        }
        function create$1(tagName, className, container) {
          var el = document.createElement(tagName);
          el.className = className || "";
          if (container) {
            container.appendChild(el);
          }
          return el;
        }
        function remove(el) {
          var parent = el.parentNode;
          if (parent) {
            parent.removeChild(el);
          }
        }
        function empty(el) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
        }
        function toFront(el) {
          var parent = el.parentNode;
          if (parent && parent.lastChild !== el) {
            parent.appendChild(el);
          }
        }
        function toBack(el) {
          var parent = el.parentNode;
          if (parent && parent.firstChild !== el) {
            parent.insertBefore(el, parent.firstChild);
          }
        }
        function hasClass(el, name) {
          if (el.classList !== void 0) {
            return el.classList.contains(name);
          }
          var className = getClass(el);
          return className.length > 0 && new RegExp("(^|\\s)" + name + "(\\s|$)").test(className);
        }
        function addClass(el, name) {
          if (el.classList !== void 0) {
            var classes = splitWords(name);
            for (var i = 0, len = classes.length; i < len; i++) {
              el.classList.add(classes[i]);
            }
          } else if (!hasClass(el, name)) {
            var className = getClass(el);
            setClass(el, (className ? className + " " : "") + name);
          }
        }
        function removeClass(el, name) {
          if (el.classList !== void 0) {
            el.classList.remove(name);
          } else {
            setClass(el, trim((" " + getClass(el) + " ").replace(" " + name + " ", " ")));
          }
        }
        function setClass(el, name) {
          if (el.className.baseVal === void 0) {
            el.className = name;
          } else {
            el.className.baseVal = name;
          }
        }
        function getClass(el) {
          if (el.correspondingElement) {
            el = el.correspondingElement;
          }
          return el.className.baseVal === void 0 ? el.className : el.className.baseVal;
        }
        function setOpacity(el, value) {
          if ("opacity" in el.style) {
            el.style.opacity = value;
          } else if ("filter" in el.style) {
            _setOpacityIE(el, value);
          }
        }
        function _setOpacityIE(el, value) {
          var filter = false, filterName = "DXImageTransform.Microsoft.Alpha";
          try {
            filter = el.filters.item(filterName);
          } catch (e) {
            if (value === 1) {
              return;
            }
          }
          value = Math.round(value * 100);
          if (filter) {
            filter.Enabled = value !== 100;
            filter.Opacity = value;
          } else {
            el.style.filter += " progid:" + filterName + "(opacity=" + value + ")";
          }
        }
        function testProp(props) {
          var style = document.documentElement.style;
          for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
              return props[i];
            }
          }
          return false;
        }
        function setTransform(el, offset, scale2) {
          var pos = offset || new Point(0, 0);
          el.style[TRANSFORM] = (ie3d ? "translate(" + pos.x + "px," + pos.y + "px)" : "translate3d(" + pos.x + "px," + pos.y + "px,0)") + (scale2 ? " scale(" + scale2 + ")" : "");
        }
        function setPosition(el, point) {
          el._leaflet_pos = point;
          if (any3d) {
            setTransform(el, point);
          } else {
            el.style.left = point.x + "px";
            el.style.top = point.y + "px";
          }
        }
        function getPosition(el) {
          return el._leaflet_pos || new Point(0, 0);
        }
        var disableTextSelection;
        var enableTextSelection;
        var _userSelect;
        if ("onselectstart" in document) {
          disableTextSelection = function() {
            on(window, "selectstart", preventDefault);
          };
          enableTextSelection = function() {
            off(window, "selectstart", preventDefault);
          };
        } else {
          var userSelectProperty = testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
          disableTextSelection = function() {
            if (userSelectProperty) {
              var style = document.documentElement.style;
              _userSelect = style[userSelectProperty];
              style[userSelectProperty] = "none";
            }
          };
          enableTextSelection = function() {
            if (userSelectProperty) {
              document.documentElement.style[userSelectProperty] = _userSelect;
              _userSelect = void 0;
            }
          };
        }
        function disableImageDrag() {
          on(window, "dragstart", preventDefault);
        }
        function enableImageDrag() {
          off(window, "dragstart", preventDefault);
        }
        var _outlineElement, _outlineStyle;
        function preventOutline(element) {
          while (element.tabIndex === -1) {
            element = element.parentNode;
          }
          if (!element.style) {
            return;
          }
          restoreOutline();
          _outlineElement = element;
          _outlineStyle = element.style.outline;
          element.style.outline = "none";
          on(window, "keydown", restoreOutline);
        }
        function restoreOutline() {
          if (!_outlineElement) {
            return;
          }
          _outlineElement.style.outline = _outlineStyle;
          _outlineElement = void 0;
          _outlineStyle = void 0;
          off(window, "keydown", restoreOutline);
        }
        function getSizedParentNode(element) {
          do {
            element = element.parentNode;
          } while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
          return element;
        }
        function getScale(element) {
          var rect = element.getBoundingClientRect();
          return {
            x: rect.width / element.offsetWidth || 1,
            y: rect.height / element.offsetHeight || 1,
            boundingClientRect: rect
          };
        }
        var DomUtil = {
          TRANSFORM,
          TRANSITION,
          TRANSITION_END,
          get,
          getStyle,
          create: create$1,
          remove,
          empty,
          toFront,
          toBack,
          hasClass,
          addClass,
          removeClass,
          setClass,
          getClass,
          setOpacity,
          testProp,
          setTransform,
          setPosition,
          getPosition,
          disableTextSelection,
          enableTextSelection,
          disableImageDrag,
          enableImageDrag,
          preventOutline,
          restoreOutline,
          getSizedParentNode,
          getScale
        };
        function on(obj, types, fn, context) {
          if (typeof types === "object") {
            for (var type in types) {
              addOne(obj, type, types[type], fn);
            }
          } else {
            types = splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
              addOne(obj, types[i], fn, context);
            }
          }
          return this;
        }
        var eventsKey = "_leaflet_events";
        function off(obj, types, fn, context) {
          if (typeof types === "object") {
            for (var type in types) {
              removeOne(obj, type, types[type], fn);
            }
          } else if (types) {
            types = splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
              removeOne(obj, types[i], fn, context);
            }
          } else {
            for (var j in obj[eventsKey]) {
              removeOne(obj, j, obj[eventsKey][j]);
            }
            delete obj[eventsKey];
          }
          return this;
        }
        function browserFiresNativeDblClick() {
          if (pointer) {
            return !(edge || safari);
          }
        }
        var mouseSubst = {
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          wheel: !("onwheel" in window) && "mousewheel"
        };
        function addOne(obj, type, fn, context) {
          var id = type + stamp(fn) + (context ? "_" + stamp(context) : "");
          if (obj[eventsKey] && obj[eventsKey][id]) {
            return this;
          }
          var handler = function(e) {
            return fn.call(context || obj, e || window.event);
          };
          var originalHandler = handler;
          if (pointer && type.indexOf("touch") === 0) {
            addPointerListener(obj, type, handler, id);
          } else if (touch && type === "dblclick" && !browserFiresNativeDblClick()) {
            addDoubleTapListener(obj, handler, id);
          } else if ("addEventListener" in obj) {
            if (type === "touchstart" || type === "touchmove" || type === "wheel" || type === "mousewheel") {
              obj.addEventListener(mouseSubst[type] || type, handler, passiveEvents ? { passive: false } : false);
            } else if (type === "mouseenter" || type === "mouseleave") {
              handler = function(e) {
                e = e || window.event;
                if (isExternalTarget(obj, e)) {
                  originalHandler(e);
                }
              };
              obj.addEventListener(mouseSubst[type], handler, false);
            } else {
              obj.addEventListener(type, originalHandler, false);
            }
          } else if ("attachEvent" in obj) {
            obj.attachEvent("on" + type, handler);
          }
          obj[eventsKey] = obj[eventsKey] || {};
          obj[eventsKey][id] = handler;
        }
        function removeOne(obj, type, fn, context) {
          var id = type + stamp(fn) + (context ? "_" + stamp(context) : ""), handler = obj[eventsKey] && obj[eventsKey][id];
          if (!handler) {
            return this;
          }
          if (pointer && type.indexOf("touch") === 0) {
            removePointerListener(obj, type, id);
          } else if (touch && type === "dblclick" && !browserFiresNativeDblClick()) {
            removeDoubleTapListener(obj, id);
          } else if ("removeEventListener" in obj) {
            obj.removeEventListener(mouseSubst[type] || type, handler, false);
          } else if ("detachEvent" in obj) {
            obj.detachEvent("on" + type, handler);
          }
          obj[eventsKey][id] = null;
        }
        function stopPropagation(e) {
          if (e.stopPropagation) {
            e.stopPropagation();
          } else if (e.originalEvent) {
            e.originalEvent._stopped = true;
          } else {
            e.cancelBubble = true;
          }
          skipped(e);
          return this;
        }
        function disableScrollPropagation(el) {
          addOne(el, "wheel", stopPropagation);
          return this;
        }
        function disableClickPropagation(el) {
          on(el, "mousedown touchstart dblclick", stopPropagation);
          addOne(el, "click", fakeStop);
          return this;
        }
        function preventDefault(e) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
          return this;
        }
        function stop(e) {
          preventDefault(e);
          stopPropagation(e);
          return this;
        }
        function getMousePosition(e, container) {
          if (!container) {
            return new Point(e.clientX, e.clientY);
          }
          var scale2 = getScale(container), offset = scale2.boundingClientRect;
          return new Point((e.clientX - offset.left) / scale2.x - container.clientLeft, (e.clientY - offset.top) / scale2.y - container.clientTop);
        }
        var wheelPxFactor = win && chrome ? 2 * window.devicePixelRatio : gecko ? window.devicePixelRatio : 1;
        function getWheelDelta(e) {
          return edge ? e.wheelDeltaY / 2 : e.deltaY && e.deltaMode === 0 ? -e.deltaY / wheelPxFactor : e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : e.deltaX || e.deltaZ ? 0 : e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : e.detail ? e.detail / -32765 * 60 : 0;
        }
        var skipEvents = {};
        function fakeStop(e) {
          skipEvents[e.type] = true;
        }
        function skipped(e) {
          var events = skipEvents[e.type];
          skipEvents[e.type] = false;
          return events;
        }
        function isExternalTarget(el, e) {
          var related = e.relatedTarget;
          if (!related) {
            return true;
          }
          try {
            while (related && related !== el) {
              related = related.parentNode;
            }
          } catch (err) {
            return false;
          }
          return related !== el;
        }
        var DomEvent = {
          on,
          off,
          stopPropagation,
          disableScrollPropagation,
          disableClickPropagation,
          preventDefault,
          stop,
          getMousePosition,
          getWheelDelta,
          fakeStop,
          skipped,
          isExternalTarget,
          addListener: on,
          removeListener: off
        };
        var PosAnimation = Evented.extend({
          run: function(el, newPos, duration, easeLinearity) {
            this.stop();
            this._el = el;
            this._inProgress = true;
            this._duration = duration || 0.25;
            this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
            this._startPos = getPosition(el);
            this._offset = newPos.subtract(this._startPos);
            this._startTime = +new Date();
            this.fire("start");
            this._animate();
          },
          stop: function() {
            if (!this._inProgress) {
              return;
            }
            this._step(true);
            this._complete();
          },
          _animate: function() {
            this._animId = requestAnimFrame(this._animate, this);
            this._step();
          },
          _step: function(round) {
            var elapsed = +new Date() - this._startTime, duration = this._duration * 1e3;
            if (elapsed < duration) {
              this._runFrame(this._easeOut(elapsed / duration), round);
            } else {
              this._runFrame(1);
              this._complete();
            }
          },
          _runFrame: function(progress, round) {
            var pos = this._startPos.add(this._offset.multiplyBy(progress));
            if (round) {
              pos._round();
            }
            setPosition(this._el, pos);
            this.fire("step");
          },
          _complete: function() {
            cancelAnimFrame(this._animId);
            this._inProgress = false;
            this.fire("end");
          },
          _easeOut: function(t) {
            return 1 - Math.pow(1 - t, this._easeOutPower);
          }
        });
        var Map2 = Evented.extend({
          options: {
            crs: EPSG3857,
            center: void 0,
            zoom: void 0,
            minZoom: void 0,
            maxZoom: void 0,
            layers: [],
            maxBounds: void 0,
            renderer: void 0,
            zoomAnimation: true,
            zoomAnimationThreshold: 4,
            fadeAnimation: true,
            markerZoomAnimation: true,
            transform3DLimit: 8388608,
            zoomSnap: 1,
            zoomDelta: 1,
            trackResize: true
          },
          initialize: function(id, options) {
            options = setOptions(this, options);
            this._handlers = [];
            this._layers = {};
            this._zoomBoundLayers = {};
            this._sizeChanged = true;
            this._initContainer(id);
            this._initLayout();
            this._onResize = bind(this._onResize, this);
            this._initEvents();
            if (options.maxBounds) {
              this.setMaxBounds(options.maxBounds);
            }
            if (options.zoom !== void 0) {
              this._zoom = this._limitZoom(options.zoom);
            }
            if (options.center && options.zoom !== void 0) {
              this.setView(toLatLng(options.center), options.zoom, { reset: true });
            }
            this.callInitHooks();
            this._zoomAnimated = TRANSITION && any3d && !mobileOpera && this.options.zoomAnimation;
            if (this._zoomAnimated) {
              this._createAnimProxy();
              on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
            }
            this._addLayers(this.options.layers);
          },
          setView: function(center, zoom2, options) {
            zoom2 = zoom2 === void 0 ? this._zoom : this._limitZoom(zoom2);
            center = this._limitCenter(toLatLng(center), zoom2, this.options.maxBounds);
            options = options || {};
            this._stop();
            if (this._loaded && !options.reset && options !== true) {
              if (options.animate !== void 0) {
                options.zoom = extend({ animate: options.animate }, options.zoom);
                options.pan = extend({ animate: options.animate, duration: options.duration }, options.pan);
              }
              var moved = this._zoom !== zoom2 ? this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom2, options.zoom) : this._tryAnimatedPan(center, options.pan);
              if (moved) {
                clearTimeout(this._sizeTimer);
                return this;
              }
            }
            this._resetView(center, zoom2);
            return this;
          },
          setZoom: function(zoom2, options) {
            if (!this._loaded) {
              this._zoom = zoom2;
              return this;
            }
            return this.setView(this.getCenter(), zoom2, { zoom: options });
          },
          zoomIn: function(delta, options) {
            delta = delta || (any3d ? this.options.zoomDelta : 1);
            return this.setZoom(this._zoom + delta, options);
          },
          zoomOut: function(delta, options) {
            delta = delta || (any3d ? this.options.zoomDelta : 1);
            return this.setZoom(this._zoom - delta, options);
          },
          setZoomAround: function(latlng, zoom2, options) {
            var scale2 = this.getZoomScale(zoom2), viewHalf = this.getSize().divideBy(2), containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng), centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale2), newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
            return this.setView(newCenter, zoom2, { zoom: options });
          },
          _getBoundsCenterZoom: function(bounds, options) {
            options = options || {};
            bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);
            var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), zoom2 = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));
            zoom2 = typeof options.maxZoom === "number" ? Math.min(options.maxZoom, zoom2) : zoom2;
            if (zoom2 === Infinity) {
              return {
                center: bounds.getCenter(),
                zoom: zoom2
              };
            }
            var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2), swPoint = this.project(bounds.getSouthWest(), zoom2), nePoint = this.project(bounds.getNorthEast(), zoom2), center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom2);
            return {
              center,
              zoom: zoom2
            };
          },
          fitBounds: function(bounds, options) {
            bounds = toLatLngBounds(bounds);
            if (!bounds.isValid()) {
              throw new Error("Bounds are not valid.");
            }
            var target = this._getBoundsCenterZoom(bounds, options);
            return this.setView(target.center, target.zoom, options);
          },
          fitWorld: function(options) {
            return this.fitBounds([[-90, -180], [90, 180]], options);
          },
          panTo: function(center, options) {
            return this.setView(center, this._zoom, { pan: options });
          },
          panBy: function(offset, options) {
            offset = toPoint(offset).round();
            options = options || {};
            if (!offset.x && !offset.y) {
              return this.fire("moveend");
            }
            if (options.animate !== true && !this.getSize().contains(offset)) {
              this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
              return this;
            }
            if (!this._panAnim) {
              this._panAnim = new PosAnimation();
              this._panAnim.on({
                "step": this._onPanTransitionStep,
                "end": this._onPanTransitionEnd
              }, this);
            }
            if (!options.noMoveStart) {
              this.fire("movestart");
            }
            if (options.animate !== false) {
              addClass(this._mapPane, "leaflet-pan-anim");
              var newPos = this._getMapPanePos().subtract(offset).round();
              this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
            } else {
              this._rawPanBy(offset);
              this.fire("move").fire("moveend");
            }
            return this;
          },
          flyTo: function(targetCenter, targetZoom, options) {
            options = options || {};
            if (options.animate === false || !any3d) {
              return this.setView(targetCenter, targetZoom, options);
            }
            this._stop();
            var from = this.project(this.getCenter()), to = this.project(targetCenter), size = this.getSize(), startZoom = this._zoom;
            targetCenter = toLatLng(targetCenter);
            targetZoom = targetZoom === void 0 ? startZoom : targetZoom;
            var w0 = Math.max(size.x, size.y), w1 = w0 * this.getZoomScale(startZoom, targetZoom), u1 = to.distanceTo(from) || 1, rho = 1.42, rho2 = rho * rho;
            function r(i) {
              var s1 = i ? -1 : 1, s2 = i ? w1 : w0, t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1, b1 = 2 * s2 * rho2 * u1, b = t1 / b1, sq = Math.sqrt(b * b + 1) - b;
              var log = sq < 1e-9 ? -18 : Math.log(sq);
              return log;
            }
            function sinh(n) {
              return (Math.exp(n) - Math.exp(-n)) / 2;
            }
            function cosh(n) {
              return (Math.exp(n) + Math.exp(-n)) / 2;
            }
            function tanh(n) {
              return sinh(n) / cosh(n);
            }
            var r0 = r(0);
            function w(s) {
              return w0 * (cosh(r0) / cosh(r0 + rho * s));
            }
            function u(s) {
              return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2;
            }
            function easeOut(t) {
              return 1 - Math.pow(1 - t, 1.5);
            }
            var start2 = Date.now(), S = (r(1) - r0) / rho, duration = options.duration ? 1e3 * options.duration : 1e3 * S * 0.8;
            function frame() {
              var t = (Date.now() - start2) / duration, s = easeOut(t) * S;
              if (t <= 1) {
                this._flyToFrame = requestAnimFrame(frame, this);
                this._move(this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom), this.getScaleZoom(w0 / w(s), startZoom), { flyTo: true });
              } else {
                this._move(targetCenter, targetZoom)._moveEnd(true);
              }
            }
            this._moveStart(true, options.noMoveStart);
            frame.call(this);
            return this;
          },
          flyToBounds: function(bounds, options) {
            var target = this._getBoundsCenterZoom(bounds, options);
            return this.flyTo(target.center, target.zoom, options);
          },
          setMaxBounds: function(bounds) {
            bounds = toLatLngBounds(bounds);
            if (!bounds.isValid()) {
              this.options.maxBounds = null;
              return this.off("moveend", this._panInsideMaxBounds);
            } else if (this.options.maxBounds) {
              this.off("moveend", this._panInsideMaxBounds);
            }
            this.options.maxBounds = bounds;
            if (this._loaded) {
              this._panInsideMaxBounds();
            }
            return this.on("moveend", this._panInsideMaxBounds);
          },
          setMinZoom: function(zoom2) {
            var oldZoom = this.options.minZoom;
            this.options.minZoom = zoom2;
            if (this._loaded && oldZoom !== zoom2) {
              this.fire("zoomlevelschange");
              if (this.getZoom() < this.options.minZoom) {
                return this.setZoom(zoom2);
              }
            }
            return this;
          },
          setMaxZoom: function(zoom2) {
            var oldZoom = this.options.maxZoom;
            this.options.maxZoom = zoom2;
            if (this._loaded && oldZoom !== zoom2) {
              this.fire("zoomlevelschange");
              if (this.getZoom() > this.options.maxZoom) {
                return this.setZoom(zoom2);
              }
            }
            return this;
          },
          panInsideBounds: function(bounds, options) {
            this._enforcingBounds = true;
            var center = this.getCenter(), newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));
            if (!center.equals(newCenter)) {
              this.panTo(newCenter, options);
            }
            this._enforcingBounds = false;
            return this;
          },
          panInside: function(latlng, options) {
            options = options || {};
            var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), center = this.getCenter(), pixelCenter = this.project(center), pixelPoint = this.project(latlng), pixelBounds = this.getPixelBounds(), halfPixelBounds = pixelBounds.getSize().divideBy(2), paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]);
            if (!paddedBounds.contains(pixelPoint)) {
              this._enforcingBounds = true;
              var diff = pixelCenter.subtract(pixelPoint), newCenter = toPoint(pixelPoint.x + diff.x, pixelPoint.y + diff.y);
              if (pixelPoint.x < paddedBounds.min.x || pixelPoint.x > paddedBounds.max.x) {
                newCenter.x = pixelCenter.x - diff.x;
                if (diff.x > 0) {
                  newCenter.x += halfPixelBounds.x - paddingTL.x;
                } else {
                  newCenter.x -= halfPixelBounds.x - paddingBR.x;
                }
              }
              if (pixelPoint.y < paddedBounds.min.y || pixelPoint.y > paddedBounds.max.y) {
                newCenter.y = pixelCenter.y - diff.y;
                if (diff.y > 0) {
                  newCenter.y += halfPixelBounds.y - paddingTL.y;
                } else {
                  newCenter.y -= halfPixelBounds.y - paddingBR.y;
                }
              }
              this.panTo(this.unproject(newCenter), options);
              this._enforcingBounds = false;
            }
            return this;
          },
          invalidateSize: function(options) {
            if (!this._loaded) {
              return this;
            }
            options = extend({
              animate: false,
              pan: true
            }, options === true ? { animate: true } : options);
            var oldSize = this.getSize();
            this._sizeChanged = true;
            this._lastCenter = null;
            var newSize = this.getSize(), oldCenter = oldSize.divideBy(2).round(), newCenter = newSize.divideBy(2).round(), offset = oldCenter.subtract(newCenter);
            if (!offset.x && !offset.y) {
              return this;
            }
            if (options.animate && options.pan) {
              this.panBy(offset);
            } else {
              if (options.pan) {
                this._rawPanBy(offset);
              }
              this.fire("move");
              if (options.debounceMoveend) {
                clearTimeout(this._sizeTimer);
                this._sizeTimer = setTimeout(bind(this.fire, this, "moveend"), 200);
              } else {
                this.fire("moveend");
              }
            }
            return this.fire("resize", {
              oldSize,
              newSize
            });
          },
          stop: function() {
            this.setZoom(this._limitZoom(this._zoom));
            if (!this.options.zoomSnap) {
              this.fire("viewreset");
            }
            return this._stop();
          },
          locate: function(options) {
            options = this._locateOptions = extend({
              timeout: 1e4,
              watch: false
            }, options);
            if (!("geolocation" in navigator)) {
              this._handleGeolocationError({
                code: 0,
                message: "Geolocation not supported."
              });
              return this;
            }
            var onResponse = bind(this._handleGeolocationResponse, this), onError = bind(this._handleGeolocationError, this);
            if (options.watch) {
              this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
            } else {
              navigator.geolocation.getCurrentPosition(onResponse, onError, options);
            }
            return this;
          },
          stopLocate: function() {
            if (navigator.geolocation && navigator.geolocation.clearWatch) {
              navigator.geolocation.clearWatch(this._locationWatchId);
            }
            if (this._locateOptions) {
              this._locateOptions.setView = false;
            }
            return this;
          },
          _handleGeolocationError: function(error) {
            var c = error.code, message = error.message || (c === 1 ? "permission denied" : c === 2 ? "position unavailable" : "timeout");
            if (this._locateOptions.setView && !this._loaded) {
              this.fitWorld();
            }
            this.fire("locationerror", {
              code: c,
              message: "Geolocation error: " + message + "."
            });
          },
          _handleGeolocationResponse: function(pos) {
            var lat = pos.coords.latitude, lng = pos.coords.longitude, latlng = new LatLng(lat, lng), bounds = latlng.toBounds(pos.coords.accuracy * 2), options = this._locateOptions;
            if (options.setView) {
              var zoom2 = this.getBoundsZoom(bounds);
              this.setView(latlng, options.maxZoom ? Math.min(zoom2, options.maxZoom) : zoom2);
            }
            var data = {
              latlng,
              bounds,
              timestamp: pos.timestamp
            };
            for (var i in pos.coords) {
              if (typeof pos.coords[i] === "number") {
                data[i] = pos.coords[i];
              }
            }
            this.fire("locationfound", data);
          },
          addHandler: function(name, HandlerClass) {
            if (!HandlerClass) {
              return this;
            }
            var handler = this[name] = new HandlerClass(this);
            this._handlers.push(handler);
            if (this.options[name]) {
              handler.enable();
            }
            return this;
          },
          remove: function() {
            this._initEvents(true);
            this.off("moveend", this._panInsideMaxBounds);
            if (this._containerId !== this._container._leaflet_id) {
              throw new Error("Map container is being reused by another instance");
            }
            try {
              delete this._container._leaflet_id;
              delete this._containerId;
            } catch (e) {
              this._container._leaflet_id = void 0;
              this._containerId = void 0;
            }
            if (this._locationWatchId !== void 0) {
              this.stopLocate();
            }
            this._stop();
            remove(this._mapPane);
            if (this._clearControlPos) {
              this._clearControlPos();
            }
            if (this._resizeRequest) {
              cancelAnimFrame(this._resizeRequest);
              this._resizeRequest = null;
            }
            this._clearHandlers();
            if (this._loaded) {
              this.fire("unload");
            }
            var i;
            for (i in this._layers) {
              this._layers[i].remove();
            }
            for (i in this._panes) {
              remove(this._panes[i]);
            }
            this._layers = [];
            this._panes = [];
            delete this._mapPane;
            delete this._renderer;
            return this;
          },
          createPane: function(name, container) {
            var className = "leaflet-pane" + (name ? " leaflet-" + name.replace("Pane", "") + "-pane" : ""), pane = create$1("div", className, container || this._mapPane);
            if (name) {
              this._panes[name] = pane;
            }
            return pane;
          },
          getCenter: function() {
            this._checkIfLoaded();
            if (this._lastCenter && !this._moved()) {
              return this._lastCenter;
            }
            return this.layerPointToLatLng(this._getCenterLayerPoint());
          },
          getZoom: function() {
            return this._zoom;
          },
          getBounds: function() {
            var bounds = this.getPixelBounds(), sw = this.unproject(bounds.getBottomLeft()), ne = this.unproject(bounds.getTopRight());
            return new LatLngBounds(sw, ne);
          },
          getMinZoom: function() {
            return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
          },
          getMaxZoom: function() {
            return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
          },
          getBoundsZoom: function(bounds, inside, padding) {
            bounds = toLatLngBounds(bounds);
            padding = toPoint(padding || [0, 0]);
            var zoom2 = this.getZoom() || 0, min = this.getMinZoom(), max = this.getMaxZoom(), nw = bounds.getNorthWest(), se = bounds.getSouthEast(), size = this.getSize().subtract(padding), boundsSize = toBounds(this.project(se, zoom2), this.project(nw, zoom2)).getSize(), snap = any3d ? this.options.zoomSnap : 1, scalex = size.x / boundsSize.x, scaley = size.y / boundsSize.y, scale2 = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);
            zoom2 = this.getScaleZoom(scale2, zoom2);
            if (snap) {
              zoom2 = Math.round(zoom2 / (snap / 100)) * (snap / 100);
              zoom2 = inside ? Math.ceil(zoom2 / snap) * snap : Math.floor(zoom2 / snap) * snap;
            }
            return Math.max(min, Math.min(max, zoom2));
          },
          getSize: function() {
            if (!this._size || this._sizeChanged) {
              this._size = new Point(this._container.clientWidth || 0, this._container.clientHeight || 0);
              this._sizeChanged = false;
            }
            return this._size.clone();
          },
          getPixelBounds: function(center, zoom2) {
            var topLeftPoint = this._getTopLeftPoint(center, zoom2);
            return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
          },
          getPixelOrigin: function() {
            this._checkIfLoaded();
            return this._pixelOrigin;
          },
          getPixelWorldBounds: function(zoom2) {
            return this.options.crs.getProjectedBounds(zoom2 === void 0 ? this.getZoom() : zoom2);
          },
          getPane: function(pane) {
            return typeof pane === "string" ? this._panes[pane] : pane;
          },
          getPanes: function() {
            return this._panes;
          },
          getContainer: function() {
            return this._container;
          },
          getZoomScale: function(toZoom, fromZoom) {
            var crs = this.options.crs;
            fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
            return crs.scale(toZoom) / crs.scale(fromZoom);
          },
          getScaleZoom: function(scale2, fromZoom) {
            var crs = this.options.crs;
            fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
            var zoom2 = crs.zoom(scale2 * crs.scale(fromZoom));
            return isNaN(zoom2) ? Infinity : zoom2;
          },
          project: function(latlng, zoom2) {
            zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
            return this.options.crs.latLngToPoint(toLatLng(latlng), zoom2);
          },
          unproject: function(point, zoom2) {
            zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
            return this.options.crs.pointToLatLng(toPoint(point), zoom2);
          },
          layerPointToLatLng: function(point) {
            var projectedPoint = toPoint(point).add(this.getPixelOrigin());
            return this.unproject(projectedPoint);
          },
          latLngToLayerPoint: function(latlng) {
            var projectedPoint = this.project(toLatLng(latlng))._round();
            return projectedPoint._subtract(this.getPixelOrigin());
          },
          wrapLatLng: function(latlng) {
            return this.options.crs.wrapLatLng(toLatLng(latlng));
          },
          wrapLatLngBounds: function(latlng) {
            return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
          },
          distance: function(latlng1, latlng2) {
            return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
          },
          containerPointToLayerPoint: function(point) {
            return toPoint(point).subtract(this._getMapPanePos());
          },
          layerPointToContainerPoint: function(point) {
            return toPoint(point).add(this._getMapPanePos());
          },
          containerPointToLatLng: function(point) {
            var layerPoint = this.containerPointToLayerPoint(toPoint(point));
            return this.layerPointToLatLng(layerPoint);
          },
          latLngToContainerPoint: function(latlng) {
            return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
          },
          mouseEventToContainerPoint: function(e) {
            return getMousePosition(e, this._container);
          },
          mouseEventToLayerPoint: function(e) {
            return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
          },
          mouseEventToLatLng: function(e) {
            return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
          },
          _initContainer: function(id) {
            var container = this._container = get(id);
            if (!container) {
              throw new Error("Map container not found.");
            } else if (container._leaflet_id) {
              throw new Error("Map container is already initialized.");
            }
            on(container, "scroll", this._onScroll, this);
            this._containerId = stamp(container);
          },
          _initLayout: function() {
            var container = this._container;
            this._fadeAnimated = this.options.fadeAnimation && any3d;
            addClass(container, "leaflet-container" + (touch ? " leaflet-touch" : "") + (retina ? " leaflet-retina" : "") + (ielt9 ? " leaflet-oldie" : "") + (safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
            var position = getStyle(container, "position");
            if (position !== "absolute" && position !== "relative" && position !== "fixed") {
              container.style.position = "relative";
            }
            this._initPanes();
            if (this._initControlPos) {
              this._initControlPos();
            }
          },
          _initPanes: function() {
            var panes = this._panes = {};
            this._paneRenderers = {};
            this._mapPane = this.createPane("mapPane", this._container);
            setPosition(this._mapPane, new Point(0, 0));
            this.createPane("tilePane");
            this.createPane("shadowPane");
            this.createPane("overlayPane");
            this.createPane("markerPane");
            this.createPane("tooltipPane");
            this.createPane("popupPane");
            if (!this.options.markerZoomAnimation) {
              addClass(panes.markerPane, "leaflet-zoom-hide");
              addClass(panes.shadowPane, "leaflet-zoom-hide");
            }
          },
          _resetView: function(center, zoom2) {
            setPosition(this._mapPane, new Point(0, 0));
            var loading = !this._loaded;
            this._loaded = true;
            zoom2 = this._limitZoom(zoom2);
            this.fire("viewprereset");
            var zoomChanged = this._zoom !== zoom2;
            this._moveStart(zoomChanged, false)._move(center, zoom2)._moveEnd(zoomChanged);
            this.fire("viewreset");
            if (loading) {
              this.fire("load");
            }
          },
          _moveStart: function(zoomChanged, noMoveStart) {
            if (zoomChanged) {
              this.fire("zoomstart");
            }
            if (!noMoveStart) {
              this.fire("movestart");
            }
            return this;
          },
          _move: function(center, zoom2, data) {
            if (zoom2 === void 0) {
              zoom2 = this._zoom;
            }
            var zoomChanged = this._zoom !== zoom2;
            this._zoom = zoom2;
            this._lastCenter = center;
            this._pixelOrigin = this._getNewPixelOrigin(center);
            if (zoomChanged || data && data.pinch) {
              this.fire("zoom", data);
            }
            return this.fire("move", data);
          },
          _moveEnd: function(zoomChanged) {
            if (zoomChanged) {
              this.fire("zoomend");
            }
            return this.fire("moveend");
          },
          _stop: function() {
            cancelAnimFrame(this._flyToFrame);
            if (this._panAnim) {
              this._panAnim.stop();
            }
            return this;
          },
          _rawPanBy: function(offset) {
            setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
          },
          _getZoomSpan: function() {
            return this.getMaxZoom() - this.getMinZoom();
          },
          _panInsideMaxBounds: function() {
            if (!this._enforcingBounds) {
              this.panInsideBounds(this.options.maxBounds);
            }
          },
          _checkIfLoaded: function() {
            if (!this._loaded) {
              throw new Error("Set map center and zoom first.");
            }
          },
          _initEvents: function(remove$$1) {
            this._targets = {};
            this._targets[stamp(this._container)] = this;
            var onOff = remove$$1 ? off : on;
            onOff(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this);
            if (this.options.trackResize) {
              onOff(window, "resize", this._onResize, this);
            }
            if (any3d && this.options.transform3DLimit) {
              (remove$$1 ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
            }
          },
          _onResize: function() {
            cancelAnimFrame(this._resizeRequest);
            this._resizeRequest = requestAnimFrame(function() {
              this.invalidateSize({ debounceMoveend: true });
            }, this);
          },
          _onScroll: function() {
            this._container.scrollTop = 0;
            this._container.scrollLeft = 0;
          },
          _onMoveEnd: function() {
            var pos = this._getMapPanePos();
            if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
              this._resetView(this.getCenter(), this.getZoom());
            }
          },
          _findEventTargets: function(e, type) {
            var targets = [], target, isHover = type === "mouseout" || type === "mouseover", src = e.target || e.srcElement, dragging = false;
            while (src) {
              target = this._targets[stamp(src)];
              if (target && (type === "click" || type === "preclick") && !e._simulated && this._draggableMoved(target)) {
                dragging = true;
                break;
              }
              if (target && target.listens(type, true)) {
                if (isHover && !isExternalTarget(src, e)) {
                  break;
                }
                targets.push(target);
                if (isHover) {
                  break;
                }
              }
              if (src === this._container) {
                break;
              }
              src = src.parentNode;
            }
            if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
              targets = [this];
            }
            return targets;
          },
          _handleDOMEvent: function(e) {
            if (!this._loaded || skipped(e)) {
              return;
            }
            var type = e.type;
            if (type === "mousedown" || type === "keypress" || type === "keyup" || type === "keydown") {
              preventOutline(e.target || e.srcElement);
            }
            this._fireDOMEvent(e, type);
          },
          _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
          _fireDOMEvent: function(e, type, targets) {
            if (e.type === "click") {
              var synth = extend({}, e);
              synth.type = "preclick";
              this._fireDOMEvent(synth, synth.type, targets);
            }
            if (e._stopped) {
              return;
            }
            targets = (targets || []).concat(this._findEventTargets(e, type));
            if (!targets.length) {
              return;
            }
            var target = targets[0];
            if (type === "contextmenu" && target.listens(type, true)) {
              preventDefault(e);
            }
            var data = {
              originalEvent: e
            };
            if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
              var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
              data.containerPoint = isMarker ? this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
              data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
              data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
            }
            for (var i = 0; i < targets.length; i++) {
              targets[i].fire(type, data, true);
              if (data.originalEvent._stopped || targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1) {
                return;
              }
            }
          },
          _draggableMoved: function(obj) {
            obj = obj.dragging && obj.dragging.enabled() ? obj : this;
            return obj.dragging && obj.dragging.moved() || this.boxZoom && this.boxZoom.moved();
          },
          _clearHandlers: function() {
            for (var i = 0, len = this._handlers.length; i < len; i++) {
              this._handlers[i].disable();
            }
          },
          whenReady: function(callback, context) {
            if (this._loaded) {
              callback.call(context || this, { target: this });
            } else {
              this.on("load", callback, context);
            }
            return this;
          },
          _getMapPanePos: function() {
            return getPosition(this._mapPane) || new Point(0, 0);
          },
          _moved: function() {
            var pos = this._getMapPanePos();
            return pos && !pos.equals([0, 0]);
          },
          _getTopLeftPoint: function(center, zoom2) {
            var pixelOrigin = center && zoom2 !== void 0 ? this._getNewPixelOrigin(center, zoom2) : this.getPixelOrigin();
            return pixelOrigin.subtract(this._getMapPanePos());
          },
          _getNewPixelOrigin: function(center, zoom2) {
            var viewHalf = this.getSize()._divideBy(2);
            return this.project(center, zoom2)._subtract(viewHalf)._add(this._getMapPanePos())._round();
          },
          _latLngToNewLayerPoint: function(latlng, zoom2, center) {
            var topLeft = this._getNewPixelOrigin(center, zoom2);
            return this.project(latlng, zoom2)._subtract(topLeft);
          },
          _latLngBoundsToNewLayerBounds: function(latLngBounds, zoom2, center) {
            var topLeft = this._getNewPixelOrigin(center, zoom2);
            return toBounds([
              this.project(latLngBounds.getSouthWest(), zoom2)._subtract(topLeft),
              this.project(latLngBounds.getNorthWest(), zoom2)._subtract(topLeft),
              this.project(latLngBounds.getSouthEast(), zoom2)._subtract(topLeft),
              this.project(latLngBounds.getNorthEast(), zoom2)._subtract(topLeft)
            ]);
          },
          _getCenterLayerPoint: function() {
            return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
          },
          _getCenterOffset: function(latlng) {
            return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
          },
          _limitCenter: function(center, zoom2, bounds) {
            if (!bounds) {
              return center;
            }
            var centerPoint = this.project(center, zoom2), viewHalf = this.getSize().divideBy(2), viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)), offset = this._getBoundsOffset(viewBounds, bounds, zoom2);
            if (offset.round().equals([0, 0])) {
              return center;
            }
            return this.unproject(centerPoint.add(offset), zoom2);
          },
          _limitOffset: function(offset, bounds) {
            if (!bounds) {
              return offset;
            }
            var viewBounds = this.getPixelBounds(), newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
            return offset.add(this._getBoundsOffset(newBounds, bounds));
          },
          _getBoundsOffset: function(pxBounds, maxBounds, zoom2) {
            var projectedMaxBounds = toBounds(this.project(maxBounds.getNorthEast(), zoom2), this.project(maxBounds.getSouthWest(), zoom2)), minOffset = projectedMaxBounds.min.subtract(pxBounds.min), maxOffset = projectedMaxBounds.max.subtract(pxBounds.max), dx = this._rebound(minOffset.x, -maxOffset.x), dy = this._rebound(minOffset.y, -maxOffset.y);
            return new Point(dx, dy);
          },
          _rebound: function(left, right) {
            return left + right > 0 ? Math.round(left - right) / 2 : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
          },
          _limitZoom: function(zoom2) {
            var min = this.getMinZoom(), max = this.getMaxZoom(), snap = any3d ? this.options.zoomSnap : 1;
            if (snap) {
              zoom2 = Math.round(zoom2 / snap) * snap;
            }
            return Math.max(min, Math.min(max, zoom2));
          },
          _onPanTransitionStep: function() {
            this.fire("move");
          },
          _onPanTransitionEnd: function() {
            removeClass(this._mapPane, "leaflet-pan-anim");
            this.fire("moveend");
          },
          _tryAnimatedPan: function(center, options) {
            var offset = this._getCenterOffset(center)._trunc();
            if ((options && options.animate) !== true && !this.getSize().contains(offset)) {
              return false;
            }
            this.panBy(offset, options);
            return true;
          },
          _createAnimProxy: function() {
            var proxy = this._proxy = create$1("div", "leaflet-proxy leaflet-zoom-animated");
            this._panes.mapPane.appendChild(proxy);
            this.on("zoomanim", function(e) {
              var prop = TRANSFORM, transform = this._proxy.style[prop];
              setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));
              if (transform === this._proxy.style[prop] && this._animatingZoom) {
                this._onZoomTransitionEnd();
              }
            }, this);
            this.on("load moveend", this._animMoveEnd, this);
            this._on("unload", this._destroyAnimProxy, this);
          },
          _destroyAnimProxy: function() {
            remove(this._proxy);
            this.off("load moveend", this._animMoveEnd, this);
            delete this._proxy;
          },
          _animMoveEnd: function() {
            var c = this.getCenter(), z = this.getZoom();
            setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
          },
          _catchTransitionEnd: function(e) {
            if (this._animatingZoom && e.propertyName.indexOf("transform") >= 0) {
              this._onZoomTransitionEnd();
            }
          },
          _nothingToAnimate: function() {
            return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
          },
          _tryAnimatedZoom: function(center, zoom2, options) {
            if (this._animatingZoom) {
              return true;
            }
            options = options || {};
            if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() || Math.abs(zoom2 - this._zoom) > this.options.zoomAnimationThreshold) {
              return false;
            }
            var scale2 = this.getZoomScale(zoom2), offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale2);
            if (options.animate !== true && !this.getSize().contains(offset)) {
              return false;
            }
            requestAnimFrame(function() {
              this._moveStart(true, false)._animateZoom(center, zoom2, true);
            }, this);
            return true;
          },
          _animateZoom: function(center, zoom2, startAnim, noUpdate) {
            if (!this._mapPane) {
              return;
            }
            if (startAnim) {
              this._animatingZoom = true;
              this._animateToCenter = center;
              this._animateToZoom = zoom2;
              addClass(this._mapPane, "leaflet-zoom-anim");
            }
            this.fire("zoomanim", {
              center,
              zoom: zoom2,
              noUpdate
            });
            setTimeout(bind(this._onZoomTransitionEnd, this), 250);
          },
          _onZoomTransitionEnd: function() {
            if (!this._animatingZoom) {
              return;
            }
            if (this._mapPane) {
              removeClass(this._mapPane, "leaflet-zoom-anim");
            }
            this._animatingZoom = false;
            this._move(this._animateToCenter, this._animateToZoom);
            requestAnimFrame(function() {
              this._moveEnd(true);
            }, this);
          }
        });
        function createMap(id, options) {
          return new Map2(id, options);
        }
        var Control = Class.extend({
          options: {
            position: "topright"
          },
          initialize: function(options) {
            setOptions(this, options);
          },
          getPosition: function() {
            return this.options.position;
          },
          setPosition: function(position) {
            var map2 = this._map;
            if (map2) {
              map2.removeControl(this);
            }
            this.options.position = position;
            if (map2) {
              map2.addControl(this);
            }
            return this;
          },
          getContainer: function() {
            return this._container;
          },
          addTo: function(map2) {
            this.remove();
            this._map = map2;
            var container = this._container = this.onAdd(map2), pos = this.getPosition(), corner = map2._controlCorners[pos];
            addClass(container, "leaflet-control");
            if (pos.indexOf("bottom") !== -1) {
              corner.insertBefore(container, corner.firstChild);
            } else {
              corner.appendChild(container);
            }
            this._map.on("unload", this.remove, this);
            return this;
          },
          remove: function() {
            if (!this._map) {
              return this;
            }
            remove(this._container);
            if (this.onRemove) {
              this.onRemove(this._map);
            }
            this._map.off("unload", this.remove, this);
            this._map = null;
            return this;
          },
          _refocusOnMap: function(e) {
            if (this._map && e && e.screenX > 0 && e.screenY > 0) {
              this._map.getContainer().focus();
            }
          }
        });
        var control = function(options) {
          return new Control(options);
        };
        Map2.include({
          addControl: function(control2) {
            control2.addTo(this);
            return this;
          },
          removeControl: function(control2) {
            control2.remove();
            return this;
          },
          _initControlPos: function() {
            var corners = this._controlCorners = {}, l = "leaflet-", container = this._controlContainer = create$1("div", l + "control-container", this._container);
            function createCorner(vSide, hSide) {
              var className = l + vSide + " " + l + hSide;
              corners[vSide + hSide] = create$1("div", className, container);
            }
            createCorner("top", "left");
            createCorner("top", "right");
            createCorner("bottom", "left");
            createCorner("bottom", "right");
          },
          _clearControlPos: function() {
            for (var i in this._controlCorners) {
              remove(this._controlCorners[i]);
            }
            remove(this._controlContainer);
            delete this._controlCorners;
            delete this._controlContainer;
          }
        });
        var Layers = Control.extend({
          options: {
            collapsed: true,
            position: "topright",
            autoZIndex: true,
            hideSingleBase: false,
            sortLayers: false,
            sortFunction: function(layerA, layerB, nameA, nameB) {
              return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
            }
          },
          initialize: function(baseLayers, overlays, options) {
            setOptions(this, options);
            this._layerControlInputs = [];
            this._layers = [];
            this._lastZIndex = 0;
            this._handlingClick = false;
            for (var i in baseLayers) {
              this._addLayer(baseLayers[i], i);
            }
            for (i in overlays) {
              this._addLayer(overlays[i], i, true);
            }
          },
          onAdd: function(map2) {
            this._initLayout();
            this._update();
            this._map = map2;
            map2.on("zoomend", this._checkDisabledLayers, this);
            for (var i = 0; i < this._layers.length; i++) {
              this._layers[i].layer.on("add remove", this._onLayerChange, this);
            }
            return this._container;
          },
          addTo: function(map2) {
            Control.prototype.addTo.call(this, map2);
            return this._expandIfNotCollapsed();
          },
          onRemove: function() {
            this._map.off("zoomend", this._checkDisabledLayers, this);
            for (var i = 0; i < this._layers.length; i++) {
              this._layers[i].layer.off("add remove", this._onLayerChange, this);
            }
          },
          addBaseLayer: function(layer, name) {
            this._addLayer(layer, name);
            return this._map ? this._update() : this;
          },
          addOverlay: function(layer, name) {
            this._addLayer(layer, name, true);
            return this._map ? this._update() : this;
          },
          removeLayer: function(layer) {
            layer.off("add remove", this._onLayerChange, this);
            var obj = this._getLayer(stamp(layer));
            if (obj) {
              this._layers.splice(this._layers.indexOf(obj), 1);
            }
            return this._map ? this._update() : this;
          },
          expand: function() {
            addClass(this._container, "leaflet-control-layers-expanded");
            this._section.style.height = null;
            var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
            if (acceptableHeight < this._section.clientHeight) {
              addClass(this._section, "leaflet-control-layers-scrollbar");
              this._section.style.height = acceptableHeight + "px";
            } else {
              removeClass(this._section, "leaflet-control-layers-scrollbar");
            }
            this._checkDisabledLayers();
            return this;
          },
          collapse: function() {
            removeClass(this._container, "leaflet-control-layers-expanded");
            return this;
          },
          _initLayout: function() {
            var className = "leaflet-control-layers", container = this._container = create$1("div", className), collapsed = this.options.collapsed;
            container.setAttribute("aria-haspopup", true);
            disableClickPropagation(container);
            disableScrollPropagation(container);
            var section = this._section = create$1("section", className + "-list");
            if (collapsed) {
              this._map.on("click", this.collapse, this);
              if (!android) {
                on(container, {
                  mouseenter: this.expand,
                  mouseleave: this.collapse
                }, this);
              }
            }
            var link = this._layersLink = create$1("a", className + "-toggle", container);
            link.href = "#";
            link.title = "Layers";
            if (touch) {
              on(link, "click", stop);
              on(link, "click", this.expand, this);
            } else {
              on(link, "focus", this.expand, this);
            }
            if (!collapsed) {
              this.expand();
            }
            this._baseLayersList = create$1("div", className + "-base", section);
            this._separator = create$1("div", className + "-separator", section);
            this._overlaysList = create$1("div", className + "-overlays", section);
            container.appendChild(section);
          },
          _getLayer: function(id) {
            for (var i = 0; i < this._layers.length; i++) {
              if (this._layers[i] && stamp(this._layers[i].layer) === id) {
                return this._layers[i];
              }
            }
          },
          _addLayer: function(layer, name, overlay) {
            if (this._map) {
              layer.on("add remove", this._onLayerChange, this);
            }
            this._layers.push({
              layer,
              name,
              overlay
            });
            if (this.options.sortLayers) {
              this._layers.sort(bind(function(a, b) {
                return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
              }, this));
            }
            if (this.options.autoZIndex && layer.setZIndex) {
              this._lastZIndex++;
              layer.setZIndex(this._lastZIndex);
            }
            this._expandIfNotCollapsed();
          },
          _update: function() {
            if (!this._container) {
              return this;
            }
            empty(this._baseLayersList);
            empty(this._overlaysList);
            this._layerControlInputs = [];
            var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
            for (i = 0; i < this._layers.length; i++) {
              obj = this._layers[i];
              this._addItem(obj);
              overlaysPresent = overlaysPresent || obj.overlay;
              baseLayersPresent = baseLayersPresent || !obj.overlay;
              baseLayersCount += !obj.overlay ? 1 : 0;
            }
            if (this.options.hideSingleBase) {
              baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
              this._baseLayersList.style.display = baseLayersPresent ? "" : "none";
            }
            this._separator.style.display = overlaysPresent && baseLayersPresent ? "" : "none";
            return this;
          },
          _onLayerChange: function(e) {
            if (!this._handlingClick) {
              this._update();
            }
            var obj = this._getLayer(stamp(e.target));
            var type = obj.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
            if (type) {
              this._map.fire(type, obj);
            }
          },
          _createRadioElement: function(name, checked) {
            var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"' + (checked ? ' checked="checked"' : "") + "/>";
            var radioFragment = document.createElement("div");
            radioFragment.innerHTML = radioHtml;
            return radioFragment.firstChild;
          },
          _addItem: function(obj) {
            var label = document.createElement("label"), checked = this._map.hasLayer(obj.layer), input;
            if (obj.overlay) {
              input = document.createElement("input");
              input.type = "checkbox";
              input.className = "leaflet-control-layers-selector";
              input.defaultChecked = checked;
            } else {
              input = this._createRadioElement("leaflet-base-layers_" + stamp(this), checked);
            }
            this._layerControlInputs.push(input);
            input.layerId = stamp(obj.layer);
            on(input, "click", this._onInputClick, this);
            var name = document.createElement("span");
            name.innerHTML = " " + obj.name;
            var holder = document.createElement("div");
            label.appendChild(holder);
            holder.appendChild(input);
            holder.appendChild(name);
            var container = obj.overlay ? this._overlaysList : this._baseLayersList;
            container.appendChild(label);
            this._checkDisabledLayers();
            return label;
          },
          _onInputClick: function() {
            var inputs = this._layerControlInputs, input, layer;
            var addedLayers = [], removedLayers = [];
            this._handlingClick = true;
            for (var i = inputs.length - 1; i >= 0; i--) {
              input = inputs[i];
              layer = this._getLayer(input.layerId).layer;
              if (input.checked) {
                addedLayers.push(layer);
              } else if (!input.checked) {
                removedLayers.push(layer);
              }
            }
            for (i = 0; i < removedLayers.length; i++) {
              if (this._map.hasLayer(removedLayers[i])) {
                this._map.removeLayer(removedLayers[i]);
              }
            }
            for (i = 0; i < addedLayers.length; i++) {
              if (!this._map.hasLayer(addedLayers[i])) {
                this._map.addLayer(addedLayers[i]);
              }
            }
            this._handlingClick = false;
            this._refocusOnMap();
          },
          _checkDisabledLayers: function() {
            var inputs = this._layerControlInputs, input, layer, zoom2 = this._map.getZoom();
            for (var i = inputs.length - 1; i >= 0; i--) {
              input = inputs[i];
              layer = this._getLayer(input.layerId).layer;
              input.disabled = layer.options.minZoom !== void 0 && zoom2 < layer.options.minZoom || layer.options.maxZoom !== void 0 && zoom2 > layer.options.maxZoom;
            }
          },
          _expandIfNotCollapsed: function() {
            if (this._map && !this.options.collapsed) {
              this.expand();
            }
            return this;
          },
          _expand: function() {
            return this.expand();
          },
          _collapse: function() {
            return this.collapse();
          }
        });
        var layers = function(baseLayers, overlays, options) {
          return new Layers(baseLayers, overlays, options);
        };
        var Zoom = Control.extend({
          options: {
            position: "topleft",
            zoomInText: "+",
            zoomInTitle: "Zoom in",
            zoomOutText: "&#x2212;",
            zoomOutTitle: "Zoom out"
          },
          onAdd: function(map2) {
            var zoomName = "leaflet-control-zoom", container = create$1("div", zoomName + " leaflet-bar"), options = this.options;
            this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, zoomName + "-in", container, this._zoomIn);
            this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, zoomName + "-out", container, this._zoomOut);
            this._updateDisabled();
            map2.on("zoomend zoomlevelschange", this._updateDisabled, this);
            return container;
          },
          onRemove: function(map2) {
            map2.off("zoomend zoomlevelschange", this._updateDisabled, this);
          },
          disable: function() {
            this._disabled = true;
            this._updateDisabled();
            return this;
          },
          enable: function() {
            this._disabled = false;
            this._updateDisabled();
            return this;
          },
          _zoomIn: function(e) {
            if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
              this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
            }
          },
          _zoomOut: function(e) {
            if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
              this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
            }
          },
          _createButton: function(html, title, className, container, fn) {
            var link = create$1("a", className, container);
            link.innerHTML = html;
            link.href = "#";
            link.title = title;
            link.setAttribute("role", "button");
            link.setAttribute("aria-label", title);
            disableClickPropagation(link);
            on(link, "click", stop);
            on(link, "click", fn, this);
            on(link, "click", this._refocusOnMap, this);
            return link;
          },
          _updateDisabled: function() {
            var map2 = this._map, className = "leaflet-disabled";
            removeClass(this._zoomInButton, className);
            removeClass(this._zoomOutButton, className);
            if (this._disabled || map2._zoom === map2.getMinZoom()) {
              addClass(this._zoomOutButton, className);
            }
            if (this._disabled || map2._zoom === map2.getMaxZoom()) {
              addClass(this._zoomInButton, className);
            }
          }
        });
        Map2.mergeOptions({
          zoomControl: true
        });
        Map2.addInitHook(function() {
          if (this.options.zoomControl) {
            this.zoomControl = new Zoom();
            this.addControl(this.zoomControl);
          }
        });
        var zoom = function(options) {
          return new Zoom(options);
        };
        var Scale = Control.extend({
          options: {
            position: "bottomleft",
            maxWidth: 100,
            metric: true,
            imperial: true
          },
          onAdd: function(map2) {
            var className = "leaflet-control-scale", container = create$1("div", className), options = this.options;
            this._addScales(options, className + "-line", container);
            map2.on(options.updateWhenIdle ? "moveend" : "move", this._update, this);
            map2.whenReady(this._update, this);
            return container;
          },
          onRemove: function(map2) {
            map2.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
          },
          _addScales: function(options, className, container) {
            if (options.metric) {
              this._mScale = create$1("div", className, container);
            }
            if (options.imperial) {
              this._iScale = create$1("div", className, container);
            }
          },
          _update: function() {
            var map2 = this._map, y = map2.getSize().y / 2;
            var maxMeters = map2.distance(map2.containerPointToLatLng([0, y]), map2.containerPointToLatLng([this.options.maxWidth, y]));
            this._updateScales(maxMeters);
          },
          _updateScales: function(maxMeters) {
            if (this.options.metric && maxMeters) {
              this._updateMetric(maxMeters);
            }
            if (this.options.imperial && maxMeters) {
              this._updateImperial(maxMeters);
            }
          },
          _updateMetric: function(maxMeters) {
            var meters = this._getRoundNum(maxMeters), label = meters < 1e3 ? meters + " m" : meters / 1e3 + " km";
            this._updateScale(this._mScale, label, meters / maxMeters);
          },
          _updateImperial: function(maxMeters) {
            var maxFeet = maxMeters * 3.2808399, maxMiles, miles, feet;
            if (maxFeet > 5280) {
              maxMiles = maxFeet / 5280;
              miles = this._getRoundNum(maxMiles);
              this._updateScale(this._iScale, miles + " mi", miles / maxMiles);
            } else {
              feet = this._getRoundNum(maxFeet);
              this._updateScale(this._iScale, feet + " ft", feet / maxFeet);
            }
          },
          _updateScale: function(scale2, text, ratio) {
            scale2.style.width = Math.round(this.options.maxWidth * ratio) + "px";
            scale2.innerHTML = text;
          },
          _getRoundNum: function(num) {
            var pow10 = Math.pow(10, (Math.floor(num) + "").length - 1), d = num / pow10;
            d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
            return pow10 * d;
          }
        });
        var scale = function(options) {
          return new Scale(options);
        };
        var Attribution = Control.extend({
          options: {
            position: "bottomright",
            prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
          },
          initialize: function(options) {
            setOptions(this, options);
            this._attributions = {};
          },
          onAdd: function(map2) {
            map2.attributionControl = this;
            this._container = create$1("div", "leaflet-control-attribution");
            disableClickPropagation(this._container);
            for (var i in map2._layers) {
              if (map2._layers[i].getAttribution) {
                this.addAttribution(map2._layers[i].getAttribution());
              }
            }
            this._update();
            return this._container;
          },
          setPrefix: function(prefix) {
            this.options.prefix = prefix;
            this._update();
            return this;
          },
          addAttribution: function(text) {
            if (!text) {
              return this;
            }
            if (!this._attributions[text]) {
              this._attributions[text] = 0;
            }
            this._attributions[text]++;
            this._update();
            return this;
          },
          removeAttribution: function(text) {
            if (!text) {
              return this;
            }
            if (this._attributions[text]) {
              this._attributions[text]--;
              this._update();
            }
            return this;
          },
          _update: function() {
            if (!this._map) {
              return;
            }
            var attribs = [];
            for (var i in this._attributions) {
              if (this._attributions[i]) {
                attribs.push(i);
              }
            }
            var prefixAndAttribs = [];
            if (this.options.prefix) {
              prefixAndAttribs.push(this.options.prefix);
            }
            if (attribs.length) {
              prefixAndAttribs.push(attribs.join(", "));
            }
            this._container.innerHTML = prefixAndAttribs.join(" | ");
          }
        });
        Map2.mergeOptions({
          attributionControl: true
        });
        Map2.addInitHook(function() {
          if (this.options.attributionControl) {
            new Attribution().addTo(this);
          }
        });
        var attribution = function(options) {
          return new Attribution(options);
        };
        Control.Layers = Layers;
        Control.Zoom = Zoom;
        Control.Scale = Scale;
        Control.Attribution = Attribution;
        control.layers = layers;
        control.zoom = zoom;
        control.scale = scale;
        control.attribution = attribution;
        var Handler = Class.extend({
          initialize: function(map2) {
            this._map = map2;
          },
          enable: function() {
            if (this._enabled) {
              return this;
            }
            this._enabled = true;
            this.addHooks();
            return this;
          },
          disable: function() {
            if (!this._enabled) {
              return this;
            }
            this._enabled = false;
            this.removeHooks();
            return this;
          },
          enabled: function() {
            return !!this._enabled;
          }
        });
        Handler.addTo = function(map2, name) {
          map2.addHandler(name, this);
          return this;
        };
        var Mixin = { Events };
        var START = touch ? "touchstart mousedown" : "mousedown";
        var END = {
          mousedown: "mouseup",
          touchstart: "touchend",
          pointerdown: "touchend",
          MSPointerDown: "touchend"
        };
        var MOVE = {
          mousedown: "mousemove",
          touchstart: "touchmove",
          pointerdown: "touchmove",
          MSPointerDown: "touchmove"
        };
        var Draggable = Evented.extend({
          options: {
            clickTolerance: 3
          },
          initialize: function(element, dragStartTarget, preventOutline$$1, options) {
            setOptions(this, options);
            this._element = element;
            this._dragStartTarget = dragStartTarget || element;
            this._preventOutline = preventOutline$$1;
          },
          enable: function() {
            if (this._enabled) {
              return;
            }
            on(this._dragStartTarget, START, this._onDown, this);
            this._enabled = true;
          },
          disable: function() {
            if (!this._enabled) {
              return;
            }
            if (Draggable._dragging === this) {
              this.finishDrag();
            }
            off(this._dragStartTarget, START, this._onDown, this);
            this._enabled = false;
            this._moved = false;
          },
          _onDown: function(e) {
            if (e._simulated || !this._enabled) {
              return;
            }
            this._moved = false;
            if (hasClass(this._element, "leaflet-zoom-anim")) {
              return;
            }
            if (Draggable._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) {
              return;
            }
            Draggable._dragging = this;
            if (this._preventOutline) {
              preventOutline(this._element);
            }
            disableImageDrag();
            disableTextSelection();
            if (this._moving) {
              return;
            }
            this.fire("down");
            var first = e.touches ? e.touches[0] : e, sizedParent = getSizedParentNode(this._element);
            this._startPoint = new Point(first.clientX, first.clientY);
            this._parentScale = getScale(sizedParent);
            on(document, MOVE[e.type], this._onMove, this);
            on(document, END[e.type], this._onUp, this);
          },
          _onMove: function(e) {
            if (e._simulated || !this._enabled) {
              return;
            }
            if (e.touches && e.touches.length > 1) {
              this._moved = true;
              return;
            }
            var first = e.touches && e.touches.length === 1 ? e.touches[0] : e, offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);
            if (!offset.x && !offset.y) {
              return;
            }
            if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) {
              return;
            }
            offset.x /= this._parentScale.x;
            offset.y /= this._parentScale.y;
            preventDefault(e);
            if (!this._moved) {
              this.fire("dragstart");
              this._moved = true;
              this._startPos = getPosition(this._element).subtract(offset);
              addClass(document.body, "leaflet-dragging");
              this._lastTarget = e.target || e.srcElement;
              if (window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance) {
                this._lastTarget = this._lastTarget.correspondingUseElement;
              }
              addClass(this._lastTarget, "leaflet-drag-target");
            }
            this._newPos = this._startPos.add(offset);
            this._moving = true;
            cancelAnimFrame(this._animRequest);
            this._lastEvent = e;
            this._animRequest = requestAnimFrame(this._updatePosition, this, true);
          },
          _updatePosition: function() {
            var e = { originalEvent: this._lastEvent };
            this.fire("predrag", e);
            setPosition(this._element, this._newPos);
            this.fire("drag", e);
          },
          _onUp: function(e) {
            if (e._simulated || !this._enabled) {
              return;
            }
            this.finishDrag();
          },
          finishDrag: function() {
            removeClass(document.body, "leaflet-dragging");
            if (this._lastTarget) {
              removeClass(this._lastTarget, "leaflet-drag-target");
              this._lastTarget = null;
            }
            for (var i in MOVE) {
              off(document, MOVE[i], this._onMove, this);
              off(document, END[i], this._onUp, this);
            }
            enableImageDrag();
            enableTextSelection();
            if (this._moved && this._moving) {
              cancelAnimFrame(this._animRequest);
              this.fire("dragend", {
                distance: this._newPos.distanceTo(this._startPos)
              });
            }
            this._moving = false;
            Draggable._dragging = false;
          }
        });
        function simplify(points, tolerance) {
          if (!tolerance || !points.length) {
            return points.slice();
          }
          var sqTolerance = tolerance * tolerance;
          points = _reducePoints(points, sqTolerance);
          points = _simplifyDP(points, sqTolerance);
          return points;
        }
        function pointToSegmentDistance(p, p1, p2) {
          return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
        }
        function closestPointOnSegment(p, p1, p2) {
          return _sqClosestPointOnSegment(p, p1, p2);
        }
        function _simplifyDP(points, sqTolerance) {
          var len = points.length, ArrayConstructor = typeof Uint8Array !== void 0 + "" ? Uint8Array : Array, markers = new ArrayConstructor(len);
          markers[0] = markers[len - 1] = 1;
          _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
          var i, newPoints = [];
          for (i = 0; i < len; i++) {
            if (markers[i]) {
              newPoints.push(points[i]);
            }
          }
          return newPoints;
        }
        function _simplifyDPStep(points, markers, sqTolerance, first, last) {
          var maxSqDist = 0, index2, i, sqDist;
          for (i = first + 1; i <= last - 1; i++) {
            sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);
            if (sqDist > maxSqDist) {
              index2 = i;
              maxSqDist = sqDist;
            }
          }
          if (maxSqDist > sqTolerance) {
            markers[index2] = 1;
            _simplifyDPStep(points, markers, sqTolerance, first, index2);
            _simplifyDPStep(points, markers, sqTolerance, index2, last);
          }
        }
        function _reducePoints(points, sqTolerance) {
          var reducedPoints = [points[0]];
          for (var i = 1, prev = 0, len = points.length; i < len; i++) {
            if (_sqDist(points[i], points[prev]) > sqTolerance) {
              reducedPoints.push(points[i]);
              prev = i;
            }
          }
          if (prev < len - 1) {
            reducedPoints.push(points[len - 1]);
          }
          return reducedPoints;
        }
        var _lastCode;
        function clipSegment(a, b, bounds, useLastCode, round) {
          var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds), codeB = _getBitCode(b, bounds), codeOut, p, newCode;
          _lastCode = codeB;
          while (true) {
            if (!(codeA | codeB)) {
              return [a, b];
            }
            if (codeA & codeB) {
              return false;
            }
            codeOut = codeA || codeB;
            p = _getEdgeIntersection(a, b, codeOut, bounds, round);
            newCode = _getBitCode(p, bounds);
            if (codeOut === codeA) {
              a = p;
              codeA = newCode;
            } else {
              b = p;
              codeB = newCode;
            }
          }
        }
        function _getEdgeIntersection(a, b, code, bounds, round) {
          var dx = b.x - a.x, dy = b.y - a.y, min = bounds.min, max = bounds.max, x, y;
          if (code & 8) {
            x = a.x + dx * (max.y - a.y) / dy;
            y = max.y;
          } else if (code & 4) {
            x = a.x + dx * (min.y - a.y) / dy;
            y = min.y;
          } else if (code & 2) {
            x = max.x;
            y = a.y + dy * (max.x - a.x) / dx;
          } else if (code & 1) {
            x = min.x;
            y = a.y + dy * (min.x - a.x) / dx;
          }
          return new Point(x, y, round);
        }
        function _getBitCode(p, bounds) {
          var code = 0;
          if (p.x < bounds.min.x) {
            code |= 1;
          } else if (p.x > bounds.max.x) {
            code |= 2;
          }
          if (p.y < bounds.min.y) {
            code |= 4;
          } else if (p.y > bounds.max.y) {
            code |= 8;
          }
          return code;
        }
        function _sqDist(p1, p2) {
          var dx = p2.x - p1.x, dy = p2.y - p1.y;
          return dx * dx + dy * dy;
        }
        function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
          var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y, dot = dx * dx + dy * dy, t;
          if (dot > 0) {
            t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
            if (t > 1) {
              x = p2.x;
              y = p2.y;
            } else if (t > 0) {
              x += dx * t;
              y += dy * t;
            }
          }
          dx = p.x - x;
          dy = p.y - y;
          return sqDist ? dx * dx + dy * dy : new Point(x, y);
        }
        function isFlat(latlngs) {
          return !isArray(latlngs[0]) || typeof latlngs[0][0] !== "object" && typeof latlngs[0][0] !== "undefined";
        }
        function _flat(latlngs) {
          console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead.");
          return isFlat(latlngs);
        }
        var LineUtil = {
          simplify,
          pointToSegmentDistance,
          closestPointOnSegment,
          clipSegment,
          _getEdgeIntersection,
          _getBitCode,
          _sqClosestPointOnSegment,
          isFlat,
          _flat
        };
        function clipPolygon(points, bounds, round) {
          var clippedPoints, edges = [1, 4, 2, 8], i, j, k, a, b, len, edge2, p;
          for (i = 0, len = points.length; i < len; i++) {
            points[i]._code = _getBitCode(points[i], bounds);
          }
          for (k = 0; k < 4; k++) {
            edge2 = edges[k];
            clippedPoints = [];
            for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
              a = points[i];
              b = points[j];
              if (!(a._code & edge2)) {
                if (b._code & edge2) {
                  p = _getEdgeIntersection(b, a, edge2, bounds, round);
                  p._code = _getBitCode(p, bounds);
                  clippedPoints.push(p);
                }
                clippedPoints.push(a);
              } else if (!(b._code & edge2)) {
                p = _getEdgeIntersection(b, a, edge2, bounds, round);
                p._code = _getBitCode(p, bounds);
                clippedPoints.push(p);
              }
            }
            points = clippedPoints;
          }
          return points;
        }
        var PolyUtil = {
          clipPolygon
        };
        var LonLat = {
          project: function(latlng) {
            return new Point(latlng.lng, latlng.lat);
          },
          unproject: function(point) {
            return new LatLng(point.y, point.x);
          },
          bounds: new Bounds([-180, -90], [180, 90])
        };
        var Mercator = {
          R: 6378137,
          R_MINOR: 6356752314245179e-9,
          bounds: new Bounds([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
          project: function(latlng) {
            var d = Math.PI / 180, r = this.R, y = latlng.lat * d, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), con = e * Math.sin(y);
            var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
            y = -r * Math.log(Math.max(ts, 1e-10));
            return new Point(latlng.lng * d * r, y);
          },
          unproject: function(point) {
            var d = 180 / Math.PI, r = this.R, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), ts = Math.exp(-point.y / r), phi = Math.PI / 2 - 2 * Math.atan(ts);
            for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
              con = e * Math.sin(phi);
              con = Math.pow((1 - con) / (1 + con), e / 2);
              dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
              phi += dphi;
            }
            return new LatLng(phi * d, point.x * d / r);
          }
        };
        var index = {
          LonLat,
          Mercator,
          SphericalMercator
        };
        var EPSG3395 = extend({}, Earth, {
          code: "EPSG:3395",
          projection: Mercator,
          transformation: function() {
            var scale2 = 0.5 / (Math.PI * Mercator.R);
            return toTransformation(scale2, 0.5, -scale2, 0.5);
          }()
        });
        var EPSG4326 = extend({}, Earth, {
          code: "EPSG:4326",
          projection: LonLat,
          transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
        });
        var Simple = extend({}, CRS, {
          projection: LonLat,
          transformation: toTransformation(1, 0, -1, 0),
          scale: function(zoom2) {
            return Math.pow(2, zoom2);
          },
          zoom: function(scale2) {
            return Math.log(scale2) / Math.LN2;
          },
          distance: function(latlng1, latlng2) {
            var dx = latlng2.lng - latlng1.lng, dy = latlng2.lat - latlng1.lat;
            return Math.sqrt(dx * dx + dy * dy);
          },
          infinite: true
        });
        CRS.Earth = Earth;
        CRS.EPSG3395 = EPSG3395;
        CRS.EPSG3857 = EPSG3857;
        CRS.EPSG900913 = EPSG900913;
        CRS.EPSG4326 = EPSG4326;
        CRS.Simple = Simple;
        var Layer = Evented.extend({
          options: {
            pane: "overlayPane",
            attribution: null,
            bubblingMouseEvents: true
          },
          addTo: function(map2) {
            map2.addLayer(this);
            return this;
          },
          remove: function() {
            return this.removeFrom(this._map || this._mapToAdd);
          },
          removeFrom: function(obj) {
            if (obj) {
              obj.removeLayer(this);
            }
            return this;
          },
          getPane: function(name) {
            return this._map.getPane(name ? this.options[name] || name : this.options.pane);
          },
          addInteractiveTarget: function(targetEl) {
            this._map._targets[stamp(targetEl)] = this;
            return this;
          },
          removeInteractiveTarget: function(targetEl) {
            delete this._map._targets[stamp(targetEl)];
            return this;
          },
          getAttribution: function() {
            return this.options.attribution;
          },
          _layerAdd: function(e) {
            var map2 = e.target;
            if (!map2.hasLayer(this)) {
              return;
            }
            this._map = map2;
            this._zoomAnimated = map2._zoomAnimated;
            if (this.getEvents) {
              var events = this.getEvents();
              map2.on(events, this);
              this.once("remove", function() {
                map2.off(events, this);
              }, this);
            }
            this.onAdd(map2);
            if (this.getAttribution && map2.attributionControl) {
              map2.attributionControl.addAttribution(this.getAttribution());
            }
            this.fire("add");
            map2.fire("layeradd", { layer: this });
          }
        });
        Map2.include({
          addLayer: function(layer) {
            if (!layer._layerAdd) {
              throw new Error("The provided object is not a Layer.");
            }
            var id = stamp(layer);
            if (this._layers[id]) {
              return this;
            }
            this._layers[id] = layer;
            layer._mapToAdd = this;
            if (layer.beforeAdd) {
              layer.beforeAdd(this);
            }
            this.whenReady(layer._layerAdd, layer);
            return this;
          },
          removeLayer: function(layer) {
            var id = stamp(layer);
            if (!this._layers[id]) {
              return this;
            }
            if (this._loaded) {
              layer.onRemove(this);
            }
            if (layer.getAttribution && this.attributionControl) {
              this.attributionControl.removeAttribution(layer.getAttribution());
            }
            delete this._layers[id];
            if (this._loaded) {
              this.fire("layerremove", { layer });
              layer.fire("remove");
            }
            layer._map = layer._mapToAdd = null;
            return this;
          },
          hasLayer: function(layer) {
            return !!layer && stamp(layer) in this._layers;
          },
          eachLayer: function(method, context) {
            for (var i in this._layers) {
              method.call(context, this._layers[i]);
            }
            return this;
          },
          _addLayers: function(layers2) {
            layers2 = layers2 ? isArray(layers2) ? layers2 : [layers2] : [];
            for (var i = 0, len = layers2.length; i < len; i++) {
              this.addLayer(layers2[i]);
            }
          },
          _addZoomLimit: function(layer) {
            if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
              this._zoomBoundLayers[stamp(layer)] = layer;
              this._updateZoomLevels();
            }
          },
          _removeZoomLimit: function(layer) {
            var id = stamp(layer);
            if (this._zoomBoundLayers[id]) {
              delete this._zoomBoundLayers[id];
              this._updateZoomLevels();
            }
          },
          _updateZoomLevels: function() {
            var minZoom = Infinity, maxZoom = -Infinity, oldZoomSpan = this._getZoomSpan();
            for (var i in this._zoomBoundLayers) {
              var options = this._zoomBoundLayers[i].options;
              minZoom = options.minZoom === void 0 ? minZoom : Math.min(minZoom, options.minZoom);
              maxZoom = options.maxZoom === void 0 ? maxZoom : Math.max(maxZoom, options.maxZoom);
            }
            this._layersMaxZoom = maxZoom === -Infinity ? void 0 : maxZoom;
            this._layersMinZoom = minZoom === Infinity ? void 0 : minZoom;
            if (oldZoomSpan !== this._getZoomSpan()) {
              this.fire("zoomlevelschange");
            }
            if (this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
              this.setZoom(this._layersMaxZoom);
            }
            if (this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
              this.setZoom(this._layersMinZoom);
            }
          }
        });
        var LayerGroup = Layer.extend({
          initialize: function(layers2, options) {
            setOptions(this, options);
            this._layers = {};
            var i, len;
            if (layers2) {
              for (i = 0, len = layers2.length; i < len; i++) {
                this.addLayer(layers2[i]);
              }
            }
          },
          addLayer: function(layer) {
            var id = this.getLayerId(layer);
            this._layers[id] = layer;
            if (this._map) {
              this._map.addLayer(layer);
            }
            return this;
          },
          removeLayer: function(layer) {
            var id = layer in this._layers ? layer : this.getLayerId(layer);
            if (this._map && this._layers[id]) {
              this._map.removeLayer(this._layers[id]);
            }
            delete this._layers[id];
            return this;
          },
          hasLayer: function(layer) {
            if (!layer) {
              return false;
            }
            var layerId = typeof layer === "number" ? layer : this.getLayerId(layer);
            return layerId in this._layers;
          },
          clearLayers: function() {
            return this.eachLayer(this.removeLayer, this);
          },
          invoke: function(methodName) {
            var args = Array.prototype.slice.call(arguments, 1), i, layer;
            for (i in this._layers) {
              layer = this._layers[i];
              if (layer[methodName]) {
                layer[methodName].apply(layer, args);
              }
            }
            return this;
          },
          onAdd: function(map2) {
            this.eachLayer(map2.addLayer, map2);
          },
          onRemove: function(map2) {
            this.eachLayer(map2.removeLayer, map2);
          },
          eachLayer: function(method, context) {
            for (var i in this._layers) {
              method.call(context, this._layers[i]);
            }
            return this;
          },
          getLayer: function(id) {
            return this._layers[id];
          },
          getLayers: function() {
            var layers2 = [];
            this.eachLayer(layers2.push, layers2);
            return layers2;
          },
          setZIndex: function(zIndex) {
            return this.invoke("setZIndex", zIndex);
          },
          getLayerId: function(layer) {
            return stamp(layer);
          }
        });
        var layerGroup = function(layers2, options) {
          return new LayerGroup(layers2, options);
        };
        var FeatureGroup = LayerGroup.extend({
          addLayer: function(layer) {
            if (this.hasLayer(layer)) {
              return this;
            }
            layer.addEventParent(this);
            LayerGroup.prototype.addLayer.call(this, layer);
            return this.fire("layeradd", { layer });
          },
          removeLayer: function(layer) {
            if (!this.hasLayer(layer)) {
              return this;
            }
            if (layer in this._layers) {
              layer = this._layers[layer];
            }
            layer.removeEventParent(this);
            LayerGroup.prototype.removeLayer.call(this, layer);
            return this.fire("layerremove", { layer });
          },
          setStyle: function(style) {
            return this.invoke("setStyle", style);
          },
          bringToFront: function() {
            return this.invoke("bringToFront");
          },
          bringToBack: function() {
            return this.invoke("bringToBack");
          },
          getBounds: function() {
            var bounds = new LatLngBounds();
            for (var id in this._layers) {
              var layer = this._layers[id];
              bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
            }
            return bounds;
          }
        });
        var featureGroup = function(layers2, options) {
          return new FeatureGroup(layers2, options);
        };
        var Icon = Class.extend({
          options: {
            popupAnchor: [0, 0],
            tooltipAnchor: [0, 0]
          },
          initialize: function(options) {
            setOptions(this, options);
          },
          createIcon: function(oldIcon) {
            return this._createIcon("icon", oldIcon);
          },
          createShadow: function(oldIcon) {
            return this._createIcon("shadow", oldIcon);
          },
          _createIcon: function(name, oldIcon) {
            var src = this._getIconUrl(name);
            if (!src) {
              if (name === "icon") {
                throw new Error("iconUrl not set in Icon options (see the docs).");
              }
              return null;
            }
            var img = this._createImg(src, oldIcon && oldIcon.tagName === "IMG" ? oldIcon : null);
            this._setIconStyles(img, name);
            return img;
          },
          _setIconStyles: function(img, name) {
            var options = this.options;
            var sizeOption = options[name + "Size"];
            if (typeof sizeOption === "number") {
              sizeOption = [sizeOption, sizeOption];
            }
            var size = toPoint(sizeOption), anchor = toPoint(name === "shadow" && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2, true));
            img.className = "leaflet-marker-" + name + " " + (options.className || "");
            if (anchor) {
              img.style.marginLeft = -anchor.x + "px";
              img.style.marginTop = -anchor.y + "px";
            }
            if (size) {
              img.style.width = size.x + "px";
              img.style.height = size.y + "px";
            }
          },
          _createImg: function(src, el) {
            el = el || document.createElement("img");
            el.src = src;
            return el;
          },
          _getIconUrl: function(name) {
            return retina && this.options[name + "RetinaUrl"] || this.options[name + "Url"];
          }
        });
        function icon(options) {
          return new Icon(options);
        }
        var IconDefault = Icon.extend({
          options: {
            iconUrl: "marker-icon.png",
            iconRetinaUrl: "marker-icon-2x.png",
            shadowUrl: "marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
          },
          _getIconUrl: function(name) {
            if (!IconDefault.imagePath) {
              IconDefault.imagePath = this._detectIconPath();
            }
            return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
          },
          _detectIconPath: function() {
            var el = create$1("div", "leaflet-default-icon-path", document.body);
            var path = getStyle(el, "background-image") || getStyle(el, "backgroundImage");
            document.body.removeChild(el);
            if (path === null || path.indexOf("url") !== 0) {
              path = "";
            } else {
              path = path.replace(/^url\(["']?/, "").replace(/marker-icon\.png["']?\)$/, "");
            }
            return path;
          }
        });
        var MarkerDrag = Handler.extend({
          initialize: function(marker2) {
            this._marker = marker2;
          },
          addHooks: function() {
            var icon2 = this._marker._icon;
            if (!this._draggable) {
              this._draggable = new Draggable(icon2, icon2, true);
            }
            this._draggable.on({
              dragstart: this._onDragStart,
              predrag: this._onPreDrag,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this).enable();
            addClass(icon2, "leaflet-marker-draggable");
          },
          removeHooks: function() {
            this._draggable.off({
              dragstart: this._onDragStart,
              predrag: this._onPreDrag,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this).disable();
            if (this._marker._icon) {
              removeClass(this._marker._icon, "leaflet-marker-draggable");
            }
          },
          moved: function() {
            return this._draggable && this._draggable._moved;
          },
          _adjustPan: function(e) {
            var marker2 = this._marker, map2 = marker2._map, speed = this._marker.options.autoPanSpeed, padding = this._marker.options.autoPanPadding, iconPos = getPosition(marker2._icon), bounds = map2.getPixelBounds(), origin = map2.getPixelOrigin();
            var panBounds = toBounds(bounds.min._subtract(origin).add(padding), bounds.max._subtract(origin).subtract(padding));
            if (!panBounds.contains(iconPos)) {
              var movement = toPoint((Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) - (Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x), (Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) - (Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)).multiplyBy(speed);
              map2.panBy(movement, { animate: false });
              this._draggable._newPos._add(movement);
              this._draggable._startPos._add(movement);
              setPosition(marker2._icon, this._draggable._newPos);
              this._onDrag(e);
              this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
            }
          },
          _onDragStart: function() {
            this._oldLatLng = this._marker.getLatLng();
            this._marker.closePopup && this._marker.closePopup();
            this._marker.fire("movestart").fire("dragstart");
          },
          _onPreDrag: function(e) {
            if (this._marker.options.autoPan) {
              cancelAnimFrame(this._panRequest);
              this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
            }
          },
          _onDrag: function(e) {
            var marker2 = this._marker, shadow = marker2._shadow, iconPos = getPosition(marker2._icon), latlng = marker2._map.layerPointToLatLng(iconPos);
            if (shadow) {
              setPosition(shadow, iconPos);
            }
            marker2._latlng = latlng;
            e.latlng = latlng;
            e.oldLatLng = this._oldLatLng;
            marker2.fire("move", e).fire("drag", e);
          },
          _onDragEnd: function(e) {
            cancelAnimFrame(this._panRequest);
            delete this._oldLatLng;
            this._marker.fire("moveend").fire("dragend", e);
          }
        });
        var Marker = Layer.extend({
          options: {
            icon: new IconDefault(),
            interactive: true,
            keyboard: true,
            title: "",
            alt: "",
            zIndexOffset: 0,
            opacity: 1,
            riseOnHover: false,
            riseOffset: 250,
            pane: "markerPane",
            shadowPane: "shadowPane",
            bubblingMouseEvents: false,
            draggable: false,
            autoPan: false,
            autoPanPadding: [50, 50],
            autoPanSpeed: 10
          },
          initialize: function(latlng, options) {
            setOptions(this, options);
            this._latlng = toLatLng(latlng);
          },
          onAdd: function(map2) {
            this._zoomAnimated = this._zoomAnimated && map2.options.markerZoomAnimation;
            if (this._zoomAnimated) {
              map2.on("zoomanim", this._animateZoom, this);
            }
            this._initIcon();
            this.update();
          },
          onRemove: function(map2) {
            if (this.dragging && this.dragging.enabled()) {
              this.options.draggable = true;
              this.dragging.removeHooks();
            }
            delete this.dragging;
            if (this._zoomAnimated) {
              map2.off("zoomanim", this._animateZoom, this);
            }
            this._removeIcon();
            this._removeShadow();
          },
          getEvents: function() {
            return {
              zoom: this.update,
              viewreset: this.update
            };
          },
          getLatLng: function() {
            return this._latlng;
          },
          setLatLng: function(latlng) {
            var oldLatLng = this._latlng;
            this._latlng = toLatLng(latlng);
            this.update();
            return this.fire("move", { oldLatLng, latlng: this._latlng });
          },
          setZIndexOffset: function(offset) {
            this.options.zIndexOffset = offset;
            return this.update();
          },
          getIcon: function() {
            return this.options.icon;
          },
          setIcon: function(icon2) {
            this.options.icon = icon2;
            if (this._map) {
              this._initIcon();
              this.update();
            }
            if (this._popup) {
              this.bindPopup(this._popup, this._popup.options);
            }
            return this;
          },
          getElement: function() {
            return this._icon;
          },
          update: function() {
            if (this._icon && this._map) {
              var pos = this._map.latLngToLayerPoint(this._latlng).round();
              this._setPos(pos);
            }
            return this;
          },
          _initIcon: function() {
            var options = this.options, classToAdd = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
            var icon2 = options.icon.createIcon(this._icon), addIcon = false;
            if (icon2 !== this._icon) {
              if (this._icon) {
                this._removeIcon();
              }
              addIcon = true;
              if (options.title) {
                icon2.title = options.title;
              }
              if (icon2.tagName === "IMG") {
                icon2.alt = options.alt || "";
              }
            }
            addClass(icon2, classToAdd);
            if (options.keyboard) {
              icon2.tabIndex = "0";
            }
            this._icon = icon2;
            if (options.riseOnHover) {
              this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex
              });
            }
            var newShadow = options.icon.createShadow(this._shadow), addShadow = false;
            if (newShadow !== this._shadow) {
              this._removeShadow();
              addShadow = true;
            }
            if (newShadow) {
              addClass(newShadow, classToAdd);
              newShadow.alt = "";
            }
            this._shadow = newShadow;
            if (options.opacity < 1) {
              this._updateOpacity();
            }
            if (addIcon) {
              this.getPane().appendChild(this._icon);
            }
            this._initInteraction();
            if (newShadow && addShadow) {
              this.getPane(options.shadowPane).appendChild(this._shadow);
            }
          },
          _removeIcon: function() {
            if (this.options.riseOnHover) {
              this.off({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex
              });
            }
            remove(this._icon);
            this.removeInteractiveTarget(this._icon);
            this._icon = null;
          },
          _removeShadow: function() {
            if (this._shadow) {
              remove(this._shadow);
            }
            this._shadow = null;
          },
          _setPos: function(pos) {
            if (this._icon) {
              setPosition(this._icon, pos);
            }
            if (this._shadow) {
              setPosition(this._shadow, pos);
            }
            this._zIndex = pos.y + this.options.zIndexOffset;
            this._resetZIndex();
          },
          _updateZIndex: function(offset) {
            if (this._icon) {
              this._icon.style.zIndex = this._zIndex + offset;
            }
          },
          _animateZoom: function(opt) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
            this._setPos(pos);
          },
          _initInteraction: function() {
            if (!this.options.interactive) {
              return;
            }
            addClass(this._icon, "leaflet-interactive");
            this.addInteractiveTarget(this._icon);
            if (MarkerDrag) {
              var draggable = this.options.draggable;
              if (this.dragging) {
                draggable = this.dragging.enabled();
                this.dragging.disable();
              }
              this.dragging = new MarkerDrag(this);
              if (draggable) {
                this.dragging.enable();
              }
            }
          },
          setOpacity: function(opacity) {
            this.options.opacity = opacity;
            if (this._map) {
              this._updateOpacity();
            }
            return this;
          },
          _updateOpacity: function() {
            var opacity = this.options.opacity;
            if (this._icon) {
              setOpacity(this._icon, opacity);
            }
            if (this._shadow) {
              setOpacity(this._shadow, opacity);
            }
          },
          _bringToFront: function() {
            this._updateZIndex(this.options.riseOffset);
          },
          _resetZIndex: function() {
            this._updateZIndex(0);
          },
          _getPopupAnchor: function() {
            return this.options.icon.options.popupAnchor;
          },
          _getTooltipAnchor: function() {
            return this.options.icon.options.tooltipAnchor;
          }
        });
        function marker(latlng, options) {
          return new Marker(latlng, options);
        }
        var Path = Layer.extend({
          options: {
            stroke: true,
            color: "#3388ff",
            weight: 3,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
            dashArray: null,
            dashOffset: null,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            fillRule: "evenodd",
            interactive: true,
            bubblingMouseEvents: true
          },
          beforeAdd: function(map2) {
            this._renderer = map2.getRenderer(this);
          },
          onAdd: function() {
            this._renderer._initPath(this);
            this._reset();
            this._renderer._addPath(this);
          },
          onRemove: function() {
            this._renderer._removePath(this);
          },
          redraw: function() {
            if (this._map) {
              this._renderer._updatePath(this);
            }
            return this;
          },
          setStyle: function(style) {
            setOptions(this, style);
            if (this._renderer) {
              this._renderer._updateStyle(this);
              if (this.options.stroke && style && Object.prototype.hasOwnProperty.call(style, "weight")) {
                this._updateBounds();
              }
            }
            return this;
          },
          bringToFront: function() {
            if (this._renderer) {
              this._renderer._bringToFront(this);
            }
            return this;
          },
          bringToBack: function() {
            if (this._renderer) {
              this._renderer._bringToBack(this);
            }
            return this;
          },
          getElement: function() {
            return this._path;
          },
          _reset: function() {
            this._project();
            this._update();
          },
          _clickTolerance: function() {
            return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
          }
        });
        var CircleMarker = Path.extend({
          options: {
            fill: true,
            radius: 10
          },
          initialize: function(latlng, options) {
            setOptions(this, options);
            this._latlng = toLatLng(latlng);
            this._radius = this.options.radius;
          },
          setLatLng: function(latlng) {
            var oldLatLng = this._latlng;
            this._latlng = toLatLng(latlng);
            this.redraw();
            return this.fire("move", { oldLatLng, latlng: this._latlng });
          },
          getLatLng: function() {
            return this._latlng;
          },
          setRadius: function(radius) {
            this.options.radius = this._radius = radius;
            return this.redraw();
          },
          getRadius: function() {
            return this._radius;
          },
          setStyle: function(options) {
            var radius = options && options.radius || this._radius;
            Path.prototype.setStyle.call(this, options);
            this.setRadius(radius);
            return this;
          },
          _project: function() {
            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._updateBounds();
          },
          _updateBounds: function() {
            var r = this._radius, r2 = this._radiusY || r, w = this._clickTolerance(), p = [r + w, r2 + w];
            this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
          },
          _update: function() {
            if (this._map) {
              this._updatePath();
            }
          },
          _updatePath: function() {
            this._renderer._updateCircle(this);
          },
          _empty: function() {
            return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
          },
          _containsPoint: function(p) {
            return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
          }
        });
        function circleMarker(latlng, options) {
          return new CircleMarker(latlng, options);
        }
        var Circle = CircleMarker.extend({
          initialize: function(latlng, options, legacyOptions) {
            if (typeof options === "number") {
              options = extend({}, legacyOptions, { radius: options });
            }
            setOptions(this, options);
            this._latlng = toLatLng(latlng);
            if (isNaN(this.options.radius)) {
              throw new Error("Circle radius cannot be NaN");
            }
            this._mRadius = this.options.radius;
          },
          setRadius: function(radius) {
            this._mRadius = radius;
            return this.redraw();
          },
          getRadius: function() {
            return this._mRadius;
          },
          getBounds: function() {
            var half = [this._radius, this._radiusY || this._radius];
            return new LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(half)), this._map.layerPointToLatLng(this._point.add(half)));
          },
          setStyle: Path.prototype.setStyle,
          _project: function() {
            var lng = this._latlng.lng, lat = this._latlng.lat, map2 = this._map, crs = map2.options.crs;
            if (crs.distance === Earth.distance) {
              var d = Math.PI / 180, latR = this._mRadius / Earth.R / d, top = map2.project([lat + latR, lng]), bottom = map2.project([lat - latR, lng]), p = top.add(bottom).divideBy(2), lat2 = map2.unproject(p).lat, lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) / (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;
              if (isNaN(lngR) || lngR === 0) {
                lngR = latR / Math.cos(Math.PI / 180 * lat);
              }
              this._point = p.subtract(map2.getPixelOrigin());
              this._radius = isNaN(lngR) ? 0 : p.x - map2.project([lat2, lng - lngR]).x;
              this._radiusY = p.y - top.y;
            } else {
              var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));
              this._point = map2.latLngToLayerPoint(this._latlng);
              this._radius = this._point.x - map2.latLngToLayerPoint(latlng2).x;
            }
            this._updateBounds();
          }
        });
        function circle(latlng, options, legacyOptions) {
          return new Circle(latlng, options, legacyOptions);
        }
        var Polyline = Path.extend({
          options: {
            smoothFactor: 1,
            noClip: false
          },
          initialize: function(latlngs, options) {
            setOptions(this, options);
            this._setLatLngs(latlngs);
          },
          getLatLngs: function() {
            return this._latlngs;
          },
          setLatLngs: function(latlngs) {
            this._setLatLngs(latlngs);
            return this.redraw();
          },
          isEmpty: function() {
            return !this._latlngs.length;
          },
          closestLayerPoint: function(p) {
            var minDistance = Infinity, minPoint = null, closest = _sqClosestPointOnSegment, p1, p2;
            for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
              var points = this._parts[j];
              for (var i = 1, len = points.length; i < len; i++) {
                p1 = points[i - 1];
                p2 = points[i];
                var sqDist = closest(p, p1, p2, true);
                if (sqDist < minDistance) {
                  minDistance = sqDist;
                  minPoint = closest(p, p1, p2);
                }
              }
            }
            if (minPoint) {
              minPoint.distance = Math.sqrt(minDistance);
            }
            return minPoint;
          },
          getCenter: function() {
            if (!this._map) {
              throw new Error("Must add layer to map before using getCenter()");
            }
            var i, halfDist, segDist, dist, p1, p2, ratio, points = this._rings[0], len = points.length;
            if (!len) {
              return null;
            }
            for (i = 0, halfDist = 0; i < len - 1; i++) {
              halfDist += points[i].distanceTo(points[i + 1]) / 2;
            }
            if (halfDist === 0) {
              return this._map.layerPointToLatLng(points[0]);
            }
            for (i = 0, dist = 0; i < len - 1; i++) {
              p1 = points[i];
              p2 = points[i + 1];
              segDist = p1.distanceTo(p2);
              dist += segDist;
              if (dist > halfDist) {
                ratio = (dist - halfDist) / segDist;
                return this._map.layerPointToLatLng([
                  p2.x - ratio * (p2.x - p1.x),
                  p2.y - ratio * (p2.y - p1.y)
                ]);
              }
            }
          },
          getBounds: function() {
            return this._bounds;
          },
          addLatLng: function(latlng, latlngs) {
            latlngs = latlngs || this._defaultShape();
            latlng = toLatLng(latlng);
            latlngs.push(latlng);
            this._bounds.extend(latlng);
            return this.redraw();
          },
          _setLatLngs: function(latlngs) {
            this._bounds = new LatLngBounds();
            this._latlngs = this._convertLatLngs(latlngs);
          },
          _defaultShape: function() {
            return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
          },
          _convertLatLngs: function(latlngs) {
            var result = [], flat = isFlat(latlngs);
            for (var i = 0, len = latlngs.length; i < len; i++) {
              if (flat) {
                result[i] = toLatLng(latlngs[i]);
                this._bounds.extend(result[i]);
              } else {
                result[i] = this._convertLatLngs(latlngs[i]);
              }
            }
            return result;
          },
          _project: function() {
            var pxBounds = new Bounds();
            this._rings = [];
            this._projectLatlngs(this._latlngs, this._rings, pxBounds);
            if (this._bounds.isValid() && pxBounds.isValid()) {
              this._rawPxBounds = pxBounds;
              this._updateBounds();
            }
          },
          _updateBounds: function() {
            var w = this._clickTolerance(), p = new Point(w, w);
            this._pxBounds = new Bounds([
              this._rawPxBounds.min.subtract(p),
              this._rawPxBounds.max.add(p)
            ]);
          },
          _projectLatlngs: function(latlngs, result, projectedBounds) {
            var flat = latlngs[0] instanceof LatLng, len = latlngs.length, i, ring;
            if (flat) {
              ring = [];
              for (i = 0; i < len; i++) {
                ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
                projectedBounds.extend(ring[i]);
              }
              result.push(ring);
            } else {
              for (i = 0; i < len; i++) {
                this._projectLatlngs(latlngs[i], result, projectedBounds);
              }
            }
          },
          _clipPoints: function() {
            var bounds = this._renderer._bounds;
            this._parts = [];
            if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
              return;
            }
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var parts = this._parts, i, j, k, len, len2, segment, points;
            for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
              points = this._rings[i];
              for (j = 0, len2 = points.length; j < len2 - 1; j++) {
                segment = clipSegment(points[j], points[j + 1], bounds, j, true);
                if (!segment) {
                  continue;
                }
                parts[k] = parts[k] || [];
                parts[k].push(segment[0]);
                if (segment[1] !== points[j + 1] || j === len2 - 2) {
                  parts[k].push(segment[1]);
                  k++;
                }
              }
            }
          },
          _simplifyPoints: function() {
            var parts = this._parts, tolerance = this.options.smoothFactor;
            for (var i = 0, len = parts.length; i < len; i++) {
              parts[i] = simplify(parts[i], tolerance);
            }
          },
          _update: function() {
            if (!this._map) {
              return;
            }
            this._clipPoints();
            this._simplifyPoints();
            this._updatePath();
          },
          _updatePath: function() {
            this._renderer._updatePoly(this);
          },
          _containsPoint: function(p, closed) {
            var i, j, k, len, len2, part, w = this._clickTolerance();
            if (!this._pxBounds || !this._pxBounds.contains(p)) {
              return false;
            }
            for (i = 0, len = this._parts.length; i < len; i++) {
              part = this._parts[i];
              for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
                if (!closed && j === 0) {
                  continue;
                }
                if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
                  return true;
                }
              }
            }
            return false;
          }
        });
        function polyline(latlngs, options) {
          return new Polyline(latlngs, options);
        }
        Polyline._flat = _flat;
        var Polygon = Polyline.extend({
          options: {
            fill: true
          },
          isEmpty: function() {
            return !this._latlngs.length || !this._latlngs[0].length;
          },
          getCenter: function() {
            if (!this._map) {
              throw new Error("Must add layer to map before using getCenter()");
            }
            var i, j, p1, p2, f, area, x, y, center, points = this._rings[0], len = points.length;
            if (!len) {
              return null;
            }
            area = x = y = 0;
            for (i = 0, j = len - 1; i < len; j = i++) {
              p1 = points[i];
              p2 = points[j];
              f = p1.y * p2.x - p2.y * p1.x;
              x += (p1.x + p2.x) * f;
              y += (p1.y + p2.y) * f;
              area += f * 3;
            }
            if (area === 0) {
              center = points[0];
            } else {
              center = [x / area, y / area];
            }
            return this._map.layerPointToLatLng(center);
          },
          _convertLatLngs: function(latlngs) {
            var result = Polyline.prototype._convertLatLngs.call(this, latlngs), len = result.length;
            if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
              result.pop();
            }
            return result;
          },
          _setLatLngs: function(latlngs) {
            Polyline.prototype._setLatLngs.call(this, latlngs);
            if (isFlat(this._latlngs)) {
              this._latlngs = [this._latlngs];
            }
          },
          _defaultShape: function() {
            return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
          },
          _clipPoints: function() {
            var bounds = this._renderer._bounds, w = this.options.weight, p = new Point(w, w);
            bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));
            this._parts = [];
            if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
              return;
            }
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
              clipped = clipPolygon(this._rings[i], bounds, true);
              if (clipped.length) {
                this._parts.push(clipped);
              }
            }
          },
          _updatePath: function() {
            this._renderer._updatePoly(this, true);
          },
          _containsPoint: function(p) {
            var inside = false, part, p1, p2, i, j, k, len, len2;
            if (!this._pxBounds || !this._pxBounds.contains(p)) {
              return false;
            }
            for (i = 0, len = this._parts.length; i < len; i++) {
              part = this._parts[i];
              for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
                p1 = part[j];
                p2 = part[k];
                if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
                  inside = !inside;
                }
              }
            }
            return inside || Polyline.prototype._containsPoint.call(this, p, true);
          }
        });
        function polygon(latlngs, options) {
          return new Polygon(latlngs, options);
        }
        var GeoJSON = FeatureGroup.extend({
          initialize: function(geojson, options) {
            setOptions(this, options);
            this._layers = {};
            if (geojson) {
              this.addData(geojson);
            }
          },
          addData: function(geojson) {
            var features = isArray(geojson) ? geojson : geojson.features, i, len, feature;
            if (features) {
              for (i = 0, len = features.length; i < len; i++) {
                feature = features[i];
                if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                  this.addData(feature);
                }
              }
              return this;
            }
            var options = this.options;
            if (options.filter && !options.filter(geojson)) {
              return this;
            }
            var layer = geometryToLayer(geojson, options);
            if (!layer) {
              return this;
            }
            layer.feature = asFeature(geojson);
            layer.defaultOptions = layer.options;
            this.resetStyle(layer);
            if (options.onEachFeature) {
              options.onEachFeature(geojson, layer);
            }
            return this.addLayer(layer);
          },
          resetStyle: function(layer) {
            if (layer === void 0) {
              return this.eachLayer(this.resetStyle, this);
            }
            layer.options = extend({}, layer.defaultOptions);
            this._setLayerStyle(layer, this.options.style);
            return this;
          },
          setStyle: function(style) {
            return this.eachLayer(function(layer) {
              this._setLayerStyle(layer, style);
            }, this);
          },
          _setLayerStyle: function(layer, style) {
            if (layer.setStyle) {
              if (typeof style === "function") {
                style = style(layer.feature);
              }
              layer.setStyle(style);
            }
          }
        });
        function geometryToLayer(geojson, options) {
          var geometry = geojson.type === "Feature" ? geojson.geometry : geojson, coords = geometry ? geometry.coordinates : null, layers2 = [], pointToLayer = options && options.pointToLayer, _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng, latlng, latlngs, i, len;
          if (!coords && !geometry) {
            return null;
          }
          switch (geometry.type) {
            case "Point":
              latlng = _coordsToLatLng(coords);
              return _pointToLayer(pointToLayer, geojson, latlng, options);
            case "MultiPoint":
              for (i = 0, len = coords.length; i < len; i++) {
                latlng = _coordsToLatLng(coords[i]);
                layers2.push(_pointToLayer(pointToLayer, geojson, latlng, options));
              }
              return new FeatureGroup(layers2);
            case "LineString":
            case "MultiLineString":
              latlngs = coordsToLatLngs(coords, geometry.type === "LineString" ? 0 : 1, _coordsToLatLng);
              return new Polyline(latlngs, options);
            case "Polygon":
            case "MultiPolygon":
              latlngs = coordsToLatLngs(coords, geometry.type === "Polygon" ? 1 : 2, _coordsToLatLng);
              return new Polygon(latlngs, options);
            case "GeometryCollection":
              for (i = 0, len = geometry.geometries.length; i < len; i++) {
                var layer = geometryToLayer({
                  geometry: geometry.geometries[i],
                  type: "Feature",
                  properties: geojson.properties
                }, options);
                if (layer) {
                  layers2.push(layer);
                }
              }
              return new FeatureGroup(layers2);
            default:
              throw new Error("Invalid GeoJSON object.");
          }
        }
        function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
          return pointToLayerFn ? pointToLayerFn(geojson, latlng) : new Marker(latlng, options && options.markersInheritOptions && options);
        }
        function coordsToLatLng(coords) {
          return new LatLng(coords[1], coords[0], coords[2]);
        }
        function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
          var latlngs = [];
          for (var i = 0, len = coords.length, latlng; i < len; i++) {
            latlng = levelsDeep ? coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) : (_coordsToLatLng || coordsToLatLng)(coords[i]);
            latlngs.push(latlng);
          }
          return latlngs;
        }
        function latLngToCoords(latlng, precision) {
          precision = typeof precision === "number" ? precision : 6;
          return latlng.alt !== void 0 ? [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] : [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
        }
        function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
          var coords = [];
          for (var i = 0, len = latlngs.length; i < len; i++) {
            coords.push(levelsDeep ? latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) : latLngToCoords(latlngs[i], precision));
          }
          if (!levelsDeep && closed) {
            coords.push(coords[0]);
          }
          return coords;
        }
        function getFeature(layer, newGeometry) {
          return layer.feature ? extend({}, layer.feature, { geometry: newGeometry }) : asFeature(newGeometry);
        }
        function asFeature(geojson) {
          if (geojson.type === "Feature" || geojson.type === "FeatureCollection") {
            return geojson;
          }
          return {
            type: "Feature",
            properties: {},
            geometry: geojson
          };
        }
        var PointToGeoJSON = {
          toGeoJSON: function(precision) {
            return getFeature(this, {
              type: "Point",
              coordinates: latLngToCoords(this.getLatLng(), precision)
            });
          }
        };
        Marker.include(PointToGeoJSON);
        Circle.include(PointToGeoJSON);
        CircleMarker.include(PointToGeoJSON);
        Polyline.include({
          toGeoJSON: function(precision) {
            var multi = !isFlat(this._latlngs);
            var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);
            return getFeature(this, {
              type: (multi ? "Multi" : "") + "LineString",
              coordinates: coords
            });
          }
        });
        Polygon.include({
          toGeoJSON: function(precision) {
            var holes = !isFlat(this._latlngs), multi = holes && !isFlat(this._latlngs[0]);
            var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);
            if (!holes) {
              coords = [coords];
            }
            return getFeature(this, {
              type: (multi ? "Multi" : "") + "Polygon",
              coordinates: coords
            });
          }
        });
        LayerGroup.include({
          toMultiPoint: function(precision) {
            var coords = [];
            this.eachLayer(function(layer) {
              coords.push(layer.toGeoJSON(precision).geometry.coordinates);
            });
            return getFeature(this, {
              type: "MultiPoint",
              coordinates: coords
            });
          },
          toGeoJSON: function(precision) {
            var type = this.feature && this.feature.geometry && this.feature.geometry.type;
            if (type === "MultiPoint") {
              return this.toMultiPoint(precision);
            }
            var isGeometryCollection = type === "GeometryCollection", jsons = [];
            this.eachLayer(function(layer) {
              if (layer.toGeoJSON) {
                var json = layer.toGeoJSON(precision);
                if (isGeometryCollection) {
                  jsons.push(json.geometry);
                } else {
                  var feature = asFeature(json);
                  if (feature.type === "FeatureCollection") {
                    jsons.push.apply(jsons, feature.features);
                  } else {
                    jsons.push(feature);
                  }
                }
              }
            });
            if (isGeometryCollection) {
              return getFeature(this, {
                geometries: jsons,
                type: "GeometryCollection"
              });
            }
            return {
              type: "FeatureCollection",
              features: jsons
            };
          }
        });
        function geoJSON(geojson, options) {
          return new GeoJSON(geojson, options);
        }
        var geoJson = geoJSON;
        var ImageOverlay = Layer.extend({
          options: {
            opacity: 1,
            alt: "",
            interactive: false,
            crossOrigin: false,
            errorOverlayUrl: "",
            zIndex: 1,
            className: ""
          },
          initialize: function(url, bounds, options) {
            this._url = url;
            this._bounds = toLatLngBounds(bounds);
            setOptions(this, options);
          },
          onAdd: function() {
            if (!this._image) {
              this._initImage();
              if (this.options.opacity < 1) {
                this._updateOpacity();
              }
            }
            if (this.options.interactive) {
              addClass(this._image, "leaflet-interactive");
              this.addInteractiveTarget(this._image);
            }
            this.getPane().appendChild(this._image);
            this._reset();
          },
          onRemove: function() {
            remove(this._image);
            if (this.options.interactive) {
              this.removeInteractiveTarget(this._image);
            }
          },
          setOpacity: function(opacity) {
            this.options.opacity = opacity;
            if (this._image) {
              this._updateOpacity();
            }
            return this;
          },
          setStyle: function(styleOpts) {
            if (styleOpts.opacity) {
              this.setOpacity(styleOpts.opacity);
            }
            return this;
          },
          bringToFront: function() {
            if (this._map) {
              toFront(this._image);
            }
            return this;
          },
          bringToBack: function() {
            if (this._map) {
              toBack(this._image);
            }
            return this;
          },
          setUrl: function(url) {
            this._url = url;
            if (this._image) {
              this._image.src = url;
            }
            return this;
          },
          setBounds: function(bounds) {
            this._bounds = toLatLngBounds(bounds);
            if (this._map) {
              this._reset();
            }
            return this;
          },
          getEvents: function() {
            var events = {
              zoom: this._reset,
              viewreset: this._reset
            };
            if (this._zoomAnimated) {
              events.zoomanim = this._animateZoom;
            }
            return events;
          },
          setZIndex: function(value) {
            this.options.zIndex = value;
            this._updateZIndex();
            return this;
          },
          getBounds: function() {
            return this._bounds;
          },
          getElement: function() {
            return this._image;
          },
          _initImage: function() {
            var wasElementSupplied = this._url.tagName === "IMG";
            var img = this._image = wasElementSupplied ? this._url : create$1("img");
            addClass(img, "leaflet-image-layer");
            if (this._zoomAnimated) {
              addClass(img, "leaflet-zoom-animated");
            }
            if (this.options.className) {
              addClass(img, this.options.className);
            }
            img.onselectstart = falseFn;
            img.onmousemove = falseFn;
            img.onload = bind(this.fire, this, "load");
            img.onerror = bind(this._overlayOnError, this, "error");
            if (this.options.crossOrigin || this.options.crossOrigin === "") {
              img.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
            }
            if (this.options.zIndex) {
              this._updateZIndex();
            }
            if (wasElementSupplied) {
              this._url = img.src;
              return;
            }
            img.src = this._url;
            img.alt = this.options.alt;
          },
          _animateZoom: function(e) {
            var scale2 = this._map.getZoomScale(e.zoom), offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
            setTransform(this._image, offset, scale2);
          },
          _reset: function() {
            var image = this._image, bounds = new Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())), size = bounds.getSize();
            setPosition(image, bounds.min);
            image.style.width = size.x + "px";
            image.style.height = size.y + "px";
          },
          _updateOpacity: function() {
            setOpacity(this._image, this.options.opacity);
          },
          _updateZIndex: function() {
            if (this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
              this._image.style.zIndex = this.options.zIndex;
            }
          },
          _overlayOnError: function() {
            this.fire("error");
            var errorUrl = this.options.errorOverlayUrl;
            if (errorUrl && this._url !== errorUrl) {
              this._url = errorUrl;
              this._image.src = errorUrl;
            }
          }
        });
        var imageOverlay = function(url, bounds, options) {
          return new ImageOverlay(url, bounds, options);
        };
        var VideoOverlay = ImageOverlay.extend({
          options: {
            autoplay: true,
            loop: true,
            keepAspectRatio: true,
            muted: false
          },
          _initImage: function() {
            var wasElementSupplied = this._url.tagName === "VIDEO";
            var vid = this._image = wasElementSupplied ? this._url : create$1("video");
            addClass(vid, "leaflet-image-layer");
            if (this._zoomAnimated) {
              addClass(vid, "leaflet-zoom-animated");
            }
            if (this.options.className) {
              addClass(vid, this.options.className);
            }
            vid.onselectstart = falseFn;
            vid.onmousemove = falseFn;
            vid.onloadeddata = bind(this.fire, this, "load");
            if (wasElementSupplied) {
              var sourceElements = vid.getElementsByTagName("source");
              var sources = [];
              for (var j = 0; j < sourceElements.length; j++) {
                sources.push(sourceElements[j].src);
              }
              this._url = sourceElements.length > 0 ? sources : [vid.src];
              return;
            }
            if (!isArray(this._url)) {
              this._url = [this._url];
            }
            if (!this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(vid.style, "objectFit")) {
              vid.style["objectFit"] = "fill";
            }
            vid.autoplay = !!this.options.autoplay;
            vid.loop = !!this.options.loop;
            vid.muted = !!this.options.muted;
            for (var i = 0; i < this._url.length; i++) {
              var source = create$1("source");
              source.src = this._url[i];
              vid.appendChild(source);
            }
          }
        });
        function videoOverlay(video, bounds, options) {
          return new VideoOverlay(video, bounds, options);
        }
        var SVGOverlay = ImageOverlay.extend({
          _initImage: function() {
            var el = this._image = this._url;
            addClass(el, "leaflet-image-layer");
            if (this._zoomAnimated) {
              addClass(el, "leaflet-zoom-animated");
            }
            if (this.options.className) {
              addClass(el, this.options.className);
            }
            el.onselectstart = falseFn;
            el.onmousemove = falseFn;
          }
        });
        function svgOverlay(el, bounds, options) {
          return new SVGOverlay(el, bounds, options);
        }
        var DivOverlay = Layer.extend({
          options: {
            offset: [0, 7],
            className: "",
            pane: "popupPane"
          },
          initialize: function(options, source) {
            setOptions(this, options);
            this._source = source;
          },
          onAdd: function(map2) {
            this._zoomAnimated = map2._zoomAnimated;
            if (!this._container) {
              this._initLayout();
            }
            if (map2._fadeAnimated) {
              setOpacity(this._container, 0);
            }
            clearTimeout(this._removeTimeout);
            this.getPane().appendChild(this._container);
            this.update();
            if (map2._fadeAnimated) {
              setOpacity(this._container, 1);
            }
            this.bringToFront();
          },
          onRemove: function(map2) {
            if (map2._fadeAnimated) {
              setOpacity(this._container, 0);
              this._removeTimeout = setTimeout(bind(remove, void 0, this._container), 200);
            } else {
              remove(this._container);
            }
          },
          getLatLng: function() {
            return this._latlng;
          },
          setLatLng: function(latlng) {
            this._latlng = toLatLng(latlng);
            if (this._map) {
              this._updatePosition();
              this._adjustPan();
            }
            return this;
          },
          getContent: function() {
            return this._content;
          },
          setContent: function(content) {
            this._content = content;
            this.update();
            return this;
          },
          getElement: function() {
            return this._container;
          },
          update: function() {
            if (!this._map) {
              return;
            }
            this._container.style.visibility = "hidden";
            this._updateContent();
            this._updateLayout();
            this._updatePosition();
            this._container.style.visibility = "";
            this._adjustPan();
          },
          getEvents: function() {
            var events = {
              zoom: this._updatePosition,
              viewreset: this._updatePosition
            };
            if (this._zoomAnimated) {
              events.zoomanim = this._animateZoom;
            }
            return events;
          },
          isOpen: function() {
            return !!this._map && this._map.hasLayer(this);
          },
          bringToFront: function() {
            if (this._map) {
              toFront(this._container);
            }
            return this;
          },
          bringToBack: function() {
            if (this._map) {
              toBack(this._container);
            }
            return this;
          },
          _prepareOpen: function(parent, layer, latlng) {
            if (!(layer instanceof Layer)) {
              latlng = layer;
              layer = parent;
            }
            if (layer instanceof FeatureGroup) {
              for (var id in parent._layers) {
                layer = parent._layers[id];
                break;
              }
            }
            if (!latlng) {
              if (layer.getCenter) {
                latlng = layer.getCenter();
              } else if (layer.getLatLng) {
                latlng = layer.getLatLng();
              } else {
                throw new Error("Unable to get source layer LatLng.");
              }
            }
            this._source = layer;
            this.update();
            return latlng;
          },
          _updateContent: function() {
            if (!this._content) {
              return;
            }
            var node = this._contentNode;
            var content = typeof this._content === "function" ? this._content(this._source || this) : this._content;
            if (typeof content === "string") {
              node.innerHTML = content;
            } else {
              while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
              }
              node.appendChild(content);
            }
            this.fire("contentupdate");
          },
          _updatePosition: function() {
            if (!this._map) {
              return;
            }
            var pos = this._map.latLngToLayerPoint(this._latlng), offset = toPoint(this.options.offset), anchor = this._getAnchor();
            if (this._zoomAnimated) {
              setPosition(this._container, pos.add(anchor));
            } else {
              offset = offset.add(pos).add(anchor);
            }
            var bottom = this._containerBottom = -offset.y, left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;
            this._container.style.bottom = bottom + "px";
            this._container.style.left = left + "px";
          },
          _getAnchor: function() {
            return [0, 0];
          }
        });
        var Popup = DivOverlay.extend({
          options: {
            maxWidth: 300,
            minWidth: 50,
            maxHeight: null,
            autoPan: true,
            autoPanPaddingTopLeft: null,
            autoPanPaddingBottomRight: null,
            autoPanPadding: [5, 5],
            keepInView: false,
            closeButton: true,
            autoClose: true,
            closeOnEscapeKey: true,
            className: ""
          },
          openOn: function(map2) {
            map2.openPopup(this);
            return this;
          },
          onAdd: function(map2) {
            DivOverlay.prototype.onAdd.call(this, map2);
            map2.fire("popupopen", { popup: this });
            if (this._source) {
              this._source.fire("popupopen", { popup: this }, true);
              if (!(this._source instanceof Path)) {
                this._source.on("preclick", stopPropagation);
              }
            }
          },
          onRemove: function(map2) {
            DivOverlay.prototype.onRemove.call(this, map2);
            map2.fire("popupclose", { popup: this });
            if (this._source) {
              this._source.fire("popupclose", { popup: this }, true);
              if (!(this._source instanceof Path)) {
                this._source.off("preclick", stopPropagation);
              }
            }
          },
          getEvents: function() {
            var events = DivOverlay.prototype.getEvents.call(this);
            if (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
              events.preclick = this._close;
            }
            if (this.options.keepInView) {
              events.moveend = this._adjustPan;
            }
            return events;
          },
          _close: function() {
            if (this._map) {
              this._map.closePopup(this);
            }
          },
          _initLayout: function() {
            var prefix = "leaflet-popup", container = this._container = create$1("div", prefix + " " + (this.options.className || "") + " leaflet-zoom-animated");
            var wrapper = this._wrapper = create$1("div", prefix + "-content-wrapper", container);
            this._contentNode = create$1("div", prefix + "-content", wrapper);
            disableClickPropagation(container);
            disableScrollPropagation(this._contentNode);
            on(container, "contextmenu", stopPropagation);
            this._tipContainer = create$1("div", prefix + "-tip-container", container);
            this._tip = create$1("div", prefix + "-tip", this._tipContainer);
            if (this.options.closeButton) {
              var closeButton = this._closeButton = create$1("a", prefix + "-close-button", container);
              closeButton.href = "#close";
              closeButton.innerHTML = "&#215;";
              on(closeButton, "click", this._onCloseButtonClick, this);
            }
          },
          _updateLayout: function() {
            var container = this._contentNode, style = container.style;
            style.width = "";
            style.whiteSpace = "nowrap";
            var width = container.offsetWidth;
            width = Math.min(width, this.options.maxWidth);
            width = Math.max(width, this.options.minWidth);
            style.width = width + 1 + "px";
            style.whiteSpace = "";
            style.height = "";
            var height = container.offsetHeight, maxHeight = this.options.maxHeight, scrolledClass = "leaflet-popup-scrolled";
            if (maxHeight && height > maxHeight) {
              style.height = maxHeight + "px";
              addClass(container, scrolledClass);
            } else {
              removeClass(container, scrolledClass);
            }
            this._containerWidth = this._container.offsetWidth;
          },
          _animateZoom: function(e) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), anchor = this._getAnchor();
            setPosition(this._container, pos.add(anchor));
          },
          _adjustPan: function() {
            if (!this.options.autoPan) {
              return;
            }
            if (this._map._panAnim) {
              this._map._panAnim.stop();
            }
            var map2 = this._map, marginBottom = parseInt(getStyle(this._container, "marginBottom"), 10) || 0, containerHeight = this._container.offsetHeight + marginBottom, containerWidth = this._containerWidth, layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);
            layerPos._add(getPosition(this._container));
            var containerPos = map2.layerPointToContainerPoint(layerPos), padding = toPoint(this.options.autoPanPadding), paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding), paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding), size = map2.getSize(), dx = 0, dy = 0;
            if (containerPos.x + containerWidth + paddingBR.x > size.x) {
              dx = containerPos.x + containerWidth - size.x + paddingBR.x;
            }
            if (containerPos.x - dx - paddingTL.x < 0) {
              dx = containerPos.x - paddingTL.x;
            }
            if (containerPos.y + containerHeight + paddingBR.y > size.y) {
              dy = containerPos.y + containerHeight - size.y + paddingBR.y;
            }
            if (containerPos.y - dy - paddingTL.y < 0) {
              dy = containerPos.y - paddingTL.y;
            }
            if (dx || dy) {
              map2.fire("autopanstart").panBy([dx, dy]);
            }
          },
          _onCloseButtonClick: function(e) {
            this._close();
            stop(e);
          },
          _getAnchor: function() {
            return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
          }
        });
        var popup = function(options, source) {
          return new Popup(options, source);
        };
        Map2.mergeOptions({
          closePopupOnClick: true
        });
        Map2.include({
          openPopup: function(popup2, latlng, options) {
            if (!(popup2 instanceof Popup)) {
              popup2 = new Popup(options).setContent(popup2);
            }
            if (latlng) {
              popup2.setLatLng(latlng);
            }
            if (this.hasLayer(popup2)) {
              return this;
            }
            if (this._popup && this._popup.options.autoClose) {
              this.closePopup();
            }
            this._popup = popup2;
            return this.addLayer(popup2);
          },
          closePopup: function(popup2) {
            if (!popup2 || popup2 === this._popup) {
              popup2 = this._popup;
              this._popup = null;
            }
            if (popup2) {
              this.removeLayer(popup2);
            }
            return this;
          }
        });
        Layer.include({
          bindPopup: function(content, options) {
            if (content instanceof Popup) {
              setOptions(content, options);
              this._popup = content;
              content._source = this;
            } else {
              if (!this._popup || options) {
                this._popup = new Popup(options, this);
              }
              this._popup.setContent(content);
            }
            if (!this._popupHandlersAdded) {
              this.on({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup
              });
              this._popupHandlersAdded = true;
            }
            return this;
          },
          unbindPopup: function() {
            if (this._popup) {
              this.off({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup
              });
              this._popupHandlersAdded = false;
              this._popup = null;
            }
            return this;
          },
          openPopup: function(layer, latlng) {
            if (this._popup && this._map) {
              latlng = this._popup._prepareOpen(this, layer, latlng);
              this._map.openPopup(this._popup, latlng);
            }
            return this;
          },
          closePopup: function() {
            if (this._popup) {
              this._popup._close();
            }
            return this;
          },
          togglePopup: function(target) {
            if (this._popup) {
              if (this._popup._map) {
                this.closePopup();
              } else {
                this.openPopup(target);
              }
            }
            return this;
          },
          isPopupOpen: function() {
            return this._popup ? this._popup.isOpen() : false;
          },
          setPopupContent: function(content) {
            if (this._popup) {
              this._popup.setContent(content);
            }
            return this;
          },
          getPopup: function() {
            return this._popup;
          },
          _openPopup: function(e) {
            var layer = e.layer || e.target;
            if (!this._popup) {
              return;
            }
            if (!this._map) {
              return;
            }
            stop(e);
            if (layer instanceof Path) {
              this.openPopup(e.layer || e.target, e.latlng);
              return;
            }
            if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
              this.closePopup();
            } else {
              this.openPopup(layer, e.latlng);
            }
          },
          _movePopup: function(e) {
            this._popup.setLatLng(e.latlng);
          },
          _onKeyPress: function(e) {
            if (e.originalEvent.keyCode === 13) {
              this._openPopup(e);
            }
          }
        });
        var Tooltip = DivOverlay.extend({
          options: {
            pane: "tooltipPane",
            offset: [0, 0],
            direction: "auto",
            permanent: false,
            sticky: false,
            interactive: false,
            opacity: 0.9
          },
          onAdd: function(map2) {
            DivOverlay.prototype.onAdd.call(this, map2);
            this.setOpacity(this.options.opacity);
            map2.fire("tooltipopen", { tooltip: this });
            if (this._source) {
              this._source.fire("tooltipopen", { tooltip: this }, true);
            }
          },
          onRemove: function(map2) {
            DivOverlay.prototype.onRemove.call(this, map2);
            map2.fire("tooltipclose", { tooltip: this });
            if (this._source) {
              this._source.fire("tooltipclose", { tooltip: this }, true);
            }
          },
          getEvents: function() {
            var events = DivOverlay.prototype.getEvents.call(this);
            if (touch && !this.options.permanent) {
              events.preclick = this._close;
            }
            return events;
          },
          _close: function() {
            if (this._map) {
              this._map.closeTooltip(this);
            }
          },
          _initLayout: function() {
            var prefix = "leaflet-tooltip", className = prefix + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
            this._contentNode = this._container = create$1("div", className);
          },
          _updateLayout: function() {
          },
          _adjustPan: function() {
          },
          _setPosition: function(pos) {
            var subX, subY, map2 = this._map, container = this._container, centerPoint = map2.latLngToContainerPoint(map2.getCenter()), tooltipPoint = map2.layerPointToContainerPoint(pos), direction = this.options.direction, tooltipWidth = container.offsetWidth, tooltipHeight = container.offsetHeight, offset = toPoint(this.options.offset), anchor = this._getAnchor();
            if (direction === "top") {
              subX = tooltipWidth / 2;
              subY = tooltipHeight;
            } else if (direction === "bottom") {
              subX = tooltipWidth / 2;
              subY = 0;
            } else if (direction === "center") {
              subX = tooltipWidth / 2;
              subY = tooltipHeight / 2;
            } else if (direction === "right") {
              subX = 0;
              subY = tooltipHeight / 2;
            } else if (direction === "left") {
              subX = tooltipWidth;
              subY = tooltipHeight / 2;
            } else if (tooltipPoint.x < centerPoint.x) {
              direction = "right";
              subX = 0;
              subY = tooltipHeight / 2;
            } else {
              direction = "left";
              subX = tooltipWidth + (offset.x + anchor.x) * 2;
              subY = tooltipHeight / 2;
            }
            pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);
            removeClass(container, "leaflet-tooltip-right");
            removeClass(container, "leaflet-tooltip-left");
            removeClass(container, "leaflet-tooltip-top");
            removeClass(container, "leaflet-tooltip-bottom");
            addClass(container, "leaflet-tooltip-" + direction);
            setPosition(container, pos);
          },
          _updatePosition: function() {
            var pos = this._map.latLngToLayerPoint(this._latlng);
            this._setPosition(pos);
          },
          setOpacity: function(opacity) {
            this.options.opacity = opacity;
            if (this._container) {
              setOpacity(this._container, opacity);
            }
          },
          _animateZoom: function(e) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
            this._setPosition(pos);
          },
          _getAnchor: function() {
            return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
          }
        });
        var tooltip = function(options, source) {
          return new Tooltip(options, source);
        };
        Map2.include({
          openTooltip: function(tooltip2, latlng, options) {
            if (!(tooltip2 instanceof Tooltip)) {
              tooltip2 = new Tooltip(options).setContent(tooltip2);
            }
            if (latlng) {
              tooltip2.setLatLng(latlng);
            }
            if (this.hasLayer(tooltip2)) {
              return this;
            }
            return this.addLayer(tooltip2);
          },
          closeTooltip: function(tooltip2) {
            if (tooltip2) {
              this.removeLayer(tooltip2);
            }
            return this;
          }
        });
        Layer.include({
          bindTooltip: function(content, options) {
            if (content instanceof Tooltip) {
              setOptions(content, options);
              this._tooltip = content;
              content._source = this;
            } else {
              if (!this._tooltip || options) {
                this._tooltip = new Tooltip(options, this);
              }
              this._tooltip.setContent(content);
            }
            this._initTooltipInteractions();
            if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
              this.openTooltip();
            }
            return this;
          },
          unbindTooltip: function() {
            if (this._tooltip) {
              this._initTooltipInteractions(true);
              this.closeTooltip();
              this._tooltip = null;
            }
            return this;
          },
          _initTooltipInteractions: function(remove$$1) {
            if (!remove$$1 && this._tooltipHandlersAdded) {
              return;
            }
            var onOff = remove$$1 ? "off" : "on", events = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            if (!this._tooltip.options.permanent) {
              events.mouseover = this._openTooltip;
              events.mouseout = this.closeTooltip;
              if (this._tooltip.options.sticky) {
                events.mousemove = this._moveTooltip;
              }
              if (touch) {
                events.click = this._openTooltip;
              }
            } else {
              events.add = this._openTooltip;
            }
            this[onOff](events);
            this._tooltipHandlersAdded = !remove$$1;
          },
          openTooltip: function(layer, latlng) {
            if (this._tooltip && this._map) {
              latlng = this._tooltip._prepareOpen(this, layer, latlng);
              this._map.openTooltip(this._tooltip, latlng);
              if (this._tooltip.options.interactive && this._tooltip._container) {
                addClass(this._tooltip._container, "leaflet-clickable");
                this.addInteractiveTarget(this._tooltip._container);
              }
            }
            return this;
          },
          closeTooltip: function() {
            if (this._tooltip) {
              this._tooltip._close();
              if (this._tooltip.options.interactive && this._tooltip._container) {
                removeClass(this._tooltip._container, "leaflet-clickable");
                this.removeInteractiveTarget(this._tooltip._container);
              }
            }
            return this;
          },
          toggleTooltip: function(target) {
            if (this._tooltip) {
              if (this._tooltip._map) {
                this.closeTooltip();
              } else {
                this.openTooltip(target);
              }
            }
            return this;
          },
          isTooltipOpen: function() {
            return this._tooltip.isOpen();
          },
          setTooltipContent: function(content) {
            if (this._tooltip) {
              this._tooltip.setContent(content);
            }
            return this;
          },
          getTooltip: function() {
            return this._tooltip;
          },
          _openTooltip: function(e) {
            var layer = e.layer || e.target;
            if (!this._tooltip || !this._map) {
              return;
            }
            this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : void 0);
          },
          _moveTooltip: function(e) {
            var latlng = e.latlng, containerPoint, layerPoint;
            if (this._tooltip.options.sticky && e.originalEvent) {
              containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
              layerPoint = this._map.containerPointToLayerPoint(containerPoint);
              latlng = this._map.layerPointToLatLng(layerPoint);
            }
            this._tooltip.setLatLng(latlng);
          }
        });
        var DivIcon = Icon.extend({
          options: {
            iconSize: [12, 12],
            html: false,
            bgPos: null,
            className: "leaflet-div-icon"
          },
          createIcon: function(oldIcon) {
            var div = oldIcon && oldIcon.tagName === "DIV" ? oldIcon : document.createElement("div"), options = this.options;
            if (options.html instanceof Element) {
              empty(div);
              div.appendChild(options.html);
            } else {
              div.innerHTML = options.html !== false ? options.html : "";
            }
            if (options.bgPos) {
              var bgPos = toPoint(options.bgPos);
              div.style.backgroundPosition = -bgPos.x + "px " + -bgPos.y + "px";
            }
            this._setIconStyles(div, "icon");
            return div;
          },
          createShadow: function() {
            return null;
          }
        });
        function divIcon(options) {
          return new DivIcon(options);
        }
        Icon.Default = IconDefault;
        var GridLayer = Layer.extend({
          options: {
            tileSize: 256,
            opacity: 1,
            updateWhenIdle: mobile,
            updateWhenZooming: true,
            updateInterval: 200,
            zIndex: 1,
            bounds: null,
            minZoom: 0,
            maxZoom: void 0,
            maxNativeZoom: void 0,
            minNativeZoom: void 0,
            noWrap: false,
            pane: "tilePane",
            className: "",
            keepBuffer: 2
          },
          initialize: function(options) {
            setOptions(this, options);
          },
          onAdd: function() {
            this._initContainer();
            this._levels = {};
            this._tiles = {};
            this._resetView();
            this._update();
          },
          beforeAdd: function(map2) {
            map2._addZoomLimit(this);
          },
          onRemove: function(map2) {
            this._removeAllTiles();
            remove(this._container);
            map2._removeZoomLimit(this);
            this._container = null;
            this._tileZoom = void 0;
          },
          bringToFront: function() {
            if (this._map) {
              toFront(this._container);
              this._setAutoZIndex(Math.max);
            }
            return this;
          },
          bringToBack: function() {
            if (this._map) {
              toBack(this._container);
              this._setAutoZIndex(Math.min);
            }
            return this;
          },
          getContainer: function() {
            return this._container;
          },
          setOpacity: function(opacity) {
            this.options.opacity = opacity;
            this._updateOpacity();
            return this;
          },
          setZIndex: function(zIndex) {
            this.options.zIndex = zIndex;
            this._updateZIndex();
            return this;
          },
          isLoading: function() {
            return this._loading;
          },
          redraw: function() {
            if (this._map) {
              this._removeAllTiles();
              this._update();
            }
            return this;
          },
          getEvents: function() {
            var events = {
              viewprereset: this._invalidateAll,
              viewreset: this._resetView,
              zoom: this._resetView,
              moveend: this._onMoveEnd
            };
            if (!this.options.updateWhenIdle) {
              if (!this._onMove) {
                this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
              }
              events.move = this._onMove;
            }
            if (this._zoomAnimated) {
              events.zoomanim = this._animateZoom;
            }
            return events;
          },
          createTile: function() {
            return document.createElement("div");
          },
          getTileSize: function() {
            var s = this.options.tileSize;
            return s instanceof Point ? s : new Point(s, s);
          },
          _updateZIndex: function() {
            if (this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
              this._container.style.zIndex = this.options.zIndex;
            }
          },
          _setAutoZIndex: function(compare) {
            var layers2 = this.getPane().children, edgeZIndex = -compare(-Infinity, Infinity);
            for (var i = 0, len = layers2.length, zIndex; i < len; i++) {
              zIndex = layers2[i].style.zIndex;
              if (layers2[i] !== this._container && zIndex) {
                edgeZIndex = compare(edgeZIndex, +zIndex);
              }
            }
            if (isFinite(edgeZIndex)) {
              this.options.zIndex = edgeZIndex + compare(-1, 1);
              this._updateZIndex();
            }
          },
          _updateOpacity: function() {
            if (!this._map) {
              return;
            }
            if (ielt9) {
              return;
            }
            setOpacity(this._container, this.options.opacity);
            var now = +new Date(), nextFrame = false, willPrune = false;
            for (var key in this._tiles) {
              var tile = this._tiles[key];
              if (!tile.current || !tile.loaded) {
                continue;
              }
              var fade = Math.min(1, (now - tile.loaded) / 200);
              setOpacity(tile.el, fade);
              if (fade < 1) {
                nextFrame = true;
              } else {
                if (tile.active) {
                  willPrune = true;
                } else {
                  this._onOpaqueTile(tile);
                }
                tile.active = true;
              }
            }
            if (willPrune && !this._noPrune) {
              this._pruneTiles();
            }
            if (nextFrame) {
              cancelAnimFrame(this._fadeFrame);
              this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
            }
          },
          _onOpaqueTile: falseFn,
          _initContainer: function() {
            if (this._container) {
              return;
            }
            this._container = create$1("div", "leaflet-layer " + (this.options.className || ""));
            this._updateZIndex();
            if (this.options.opacity < 1) {
              this._updateOpacity();
            }
            this.getPane().appendChild(this._container);
          },
          _updateLevels: function() {
            var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom;
            if (zoom2 === void 0) {
              return void 0;
            }
            for (var z in this._levels) {
              z = Number(z);
              if (this._levels[z].el.children.length || z === zoom2) {
                this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom2 - z);
                this._onUpdateLevel(z);
              } else {
                remove(this._levels[z].el);
                this._removeTilesAtZoom(z);
                this._onRemoveLevel(z);
                delete this._levels[z];
              }
            }
            var level = this._levels[zoom2], map2 = this._map;
            if (!level) {
              level = this._levels[zoom2] = {};
              level.el = create$1("div", "leaflet-tile-container leaflet-zoom-animated", this._container);
              level.el.style.zIndex = maxZoom;
              level.origin = map2.project(map2.unproject(map2.getPixelOrigin()), zoom2).round();
              level.zoom = zoom2;
              this._setZoomTransform(level, map2.getCenter(), map2.getZoom());
              falseFn(level.el.offsetWidth);
              this._onCreateLevel(level);
            }
            this._level = level;
            return level;
          },
          _onUpdateLevel: falseFn,
          _onRemoveLevel: falseFn,
          _onCreateLevel: falseFn,
          _pruneTiles: function() {
            if (!this._map) {
              return;
            }
            var key, tile;
            var zoom2 = this._map.getZoom();
            if (zoom2 > this.options.maxZoom || zoom2 < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (key in this._tiles) {
              tile = this._tiles[key];
              tile.retain = tile.current;
            }
            for (key in this._tiles) {
              tile = this._tiles[key];
              if (tile.current && !tile.active) {
                var coords = tile.coords;
                if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
                  this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
                }
              }
            }
            for (key in this._tiles) {
              if (!this._tiles[key].retain) {
                this._removeTile(key);
              }
            }
          },
          _removeTilesAtZoom: function(zoom2) {
            for (var key in this._tiles) {
              if (this._tiles[key].coords.z !== zoom2) {
                continue;
              }
              this._removeTile(key);
            }
          },
          _removeAllTiles: function() {
            for (var key in this._tiles) {
              this._removeTile(key);
            }
          },
          _invalidateAll: function() {
            for (var z in this._levels) {
              remove(this._levels[z].el);
              this._onRemoveLevel(Number(z));
              delete this._levels[z];
            }
            this._removeAllTiles();
            this._tileZoom = void 0;
          },
          _retainParent: function(x, y, z, minZoom) {
            var x2 = Math.floor(x / 2), y2 = Math.floor(y / 2), z2 = z - 1, coords2 = new Point(+x2, +y2);
            coords2.z = +z2;
            var key = this._tileCoordsToKey(coords2), tile = this._tiles[key];
            if (tile && tile.active) {
              tile.retain = true;
              return true;
            } else if (tile && tile.loaded) {
              tile.retain = true;
            }
            if (z2 > minZoom) {
              return this._retainParent(x2, y2, z2, minZoom);
            }
            return false;
          },
          _retainChildren: function(x, y, z, maxZoom) {
            for (var i = 2 * x; i < 2 * x + 2; i++) {
              for (var j = 2 * y; j < 2 * y + 2; j++) {
                var coords = new Point(i, j);
                coords.z = z + 1;
                var key = this._tileCoordsToKey(coords), tile = this._tiles[key];
                if (tile && tile.active) {
                  tile.retain = true;
                  continue;
                } else if (tile && tile.loaded) {
                  tile.retain = true;
                }
                if (z + 1 < maxZoom) {
                  this._retainChildren(i, j, z + 1, maxZoom);
                }
              }
            }
          },
          _resetView: function(e) {
            var animating = e && (e.pinch || e.flyTo);
            this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
          },
          _animateZoom: function(e) {
            this._setView(e.center, e.zoom, true, e.noUpdate);
          },
          _clampZoom: function(zoom2) {
            var options = this.options;
            if (options.minNativeZoom !== void 0 && zoom2 < options.minNativeZoom) {
              return options.minNativeZoom;
            }
            if (options.maxNativeZoom !== void 0 && options.maxNativeZoom < zoom2) {
              return options.maxNativeZoom;
            }
            return zoom2;
          },
          _setView: function(center, zoom2, noPrune, noUpdate) {
            var tileZoom = Math.round(zoom2);
            if (this.options.maxZoom !== void 0 && tileZoom > this.options.maxZoom || this.options.minZoom !== void 0 && tileZoom < this.options.minZoom) {
              tileZoom = void 0;
            } else {
              tileZoom = this._clampZoom(tileZoom);
            }
            var tileZoomChanged = this.options.updateWhenZooming && tileZoom !== this._tileZoom;
            if (!noUpdate || tileZoomChanged) {
              this._tileZoom = tileZoom;
              if (this._abortLoading) {
                this._abortLoading();
              }
              this._updateLevels();
              this._resetGrid();
              if (tileZoom !== void 0) {
                this._update(center);
              }
              if (!noPrune) {
                this._pruneTiles();
              }
              this._noPrune = !!noPrune;
            }
            this._setZoomTransforms(center, zoom2);
          },
          _setZoomTransforms: function(center, zoom2) {
            for (var i in this._levels) {
              this._setZoomTransform(this._levels[i], center, zoom2);
            }
          },
          _setZoomTransform: function(level, center, zoom2) {
            var scale2 = this._map.getZoomScale(zoom2, level.zoom), translate = level.origin.multiplyBy(scale2).subtract(this._map._getNewPixelOrigin(center, zoom2)).round();
            if (any3d) {
              setTransform(level.el, translate, scale2);
            } else {
              setPosition(level.el, translate);
            }
          },
          _resetGrid: function() {
            var map2 = this._map, crs = map2.options.crs, tileSize2 = this._tileSize = this.getTileSize(), tileZoom = this._tileZoom;
            var bounds = this._map.getPixelWorldBounds(this._tileZoom);
            if (bounds) {
              this._globalTileRange = this._pxBoundsToTileRange(bounds);
            }
            this._wrapX = crs.wrapLng && !this.options.noWrap && [
              Math.floor(map2.project([0, crs.wrapLng[0]], tileZoom).x / tileSize2.x),
              Math.ceil(map2.project([0, crs.wrapLng[1]], tileZoom).x / tileSize2.y)
            ];
            this._wrapY = crs.wrapLat && !this.options.noWrap && [
              Math.floor(map2.project([crs.wrapLat[0], 0], tileZoom).y / tileSize2.x),
              Math.ceil(map2.project([crs.wrapLat[1], 0], tileZoom).y / tileSize2.y)
            ];
          },
          _onMoveEnd: function() {
            if (!this._map || this._map._animatingZoom) {
              return;
            }
            this._update();
          },
          _getTiledPixelBounds: function(center) {
            var map2 = this._map, mapZoom = map2._animatingZoom ? Math.max(map2._animateToZoom, map2.getZoom()) : map2.getZoom(), scale2 = map2.getZoomScale(mapZoom, this._tileZoom), pixelCenter = map2.project(center, this._tileZoom).floor(), halfSize = map2.getSize().divideBy(scale2 * 2);
            return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
          },
          _update: function(center) {
            var map2 = this._map;
            if (!map2) {
              return;
            }
            var zoom2 = this._clampZoom(map2.getZoom());
            if (center === void 0) {
              center = map2.getCenter();
            }
            if (this._tileZoom === void 0) {
              return;
            }
            var pixelBounds = this._getTiledPixelBounds(center), tileRange = this._pxBoundsToTileRange(pixelBounds), tileCenter = tileRange.getCenter(), queue = [], margin = this.options.keepBuffer, noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]), tileRange.getTopRight().add([margin, -margin]));
            if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
              throw new Error("Attempted to load an infinite number of tiles");
            }
            for (var key in this._tiles) {
              var c = this._tiles[key].coords;
              if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
                this._tiles[key].current = false;
              }
            }
            if (Math.abs(zoom2 - this._tileZoom) > 1) {
              this._setView(center, zoom2);
              return;
            }
            for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
              for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
                var coords = new Point(i, j);
                coords.z = this._tileZoom;
                if (!this._isValidTile(coords)) {
                  continue;
                }
                var tile = this._tiles[this._tileCoordsToKey(coords)];
                if (tile) {
                  tile.current = true;
                } else {
                  queue.push(coords);
                }
              }
            }
            queue.sort(function(a, b) {
              return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
            });
            if (queue.length !== 0) {
              if (!this._loading) {
                this._loading = true;
                this.fire("loading");
              }
              var fragment = document.createDocumentFragment();
              for (i = 0; i < queue.length; i++) {
                this._addTile(queue[i], fragment);
              }
              this._level.el.appendChild(fragment);
            }
          },
          _isValidTile: function(coords) {
            var crs = this._map.options.crs;
            if (!crs.infinite) {
              var bounds = this._globalTileRange;
              if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
                return false;
              }
            }
            if (!this.options.bounds) {
              return true;
            }
            var tileBounds = this._tileCoordsToBounds(coords);
            return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
          },
          _keyToBounds: function(key) {
            return this._tileCoordsToBounds(this._keyToTileCoords(key));
          },
          _tileCoordsToNwSe: function(coords) {
            var map2 = this._map, tileSize2 = this.getTileSize(), nwPoint = coords.scaleBy(tileSize2), sePoint = nwPoint.add(tileSize2), nw = map2.unproject(nwPoint, coords.z), se = map2.unproject(sePoint, coords.z);
            return [nw, se];
          },
          _tileCoordsToBounds: function(coords) {
            var bp = this._tileCoordsToNwSe(coords), bounds = new LatLngBounds(bp[0], bp[1]);
            if (!this.options.noWrap) {
              bounds = this._map.wrapLatLngBounds(bounds);
            }
            return bounds;
          },
          _tileCoordsToKey: function(coords) {
            return coords.x + ":" + coords.y + ":" + coords.z;
          },
          _keyToTileCoords: function(key) {
            var k = key.split(":"), coords = new Point(+k[0], +k[1]);
            coords.z = +k[2];
            return coords;
          },
          _removeTile: function(key) {
            var tile = this._tiles[key];
            if (!tile) {
              return;
            }
            remove(tile.el);
            delete this._tiles[key];
            this.fire("tileunload", {
              tile: tile.el,
              coords: this._keyToTileCoords(key)
            });
          },
          _initTile: function(tile) {
            addClass(tile, "leaflet-tile");
            var tileSize2 = this.getTileSize();
            tile.style.width = tileSize2.x + "px";
            tile.style.height = tileSize2.y + "px";
            tile.onselectstart = falseFn;
            tile.onmousemove = falseFn;
            if (ielt9 && this.options.opacity < 1) {
              setOpacity(tile, this.options.opacity);
            }
            if (android && !android23) {
              tile.style.WebkitBackfaceVisibility = "hidden";
            }
          },
          _addTile: function(coords, container) {
            var tilePos = this._getTilePos(coords), key = this._tileCoordsToKey(coords);
            var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));
            this._initTile(tile);
            if (this.createTile.length < 2) {
              requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
            }
            setPosition(tile, tilePos);
            this._tiles[key] = {
              el: tile,
              coords,
              current: true
            };
            container.appendChild(tile);
            this.fire("tileloadstart", {
              tile,
              coords
            });
          },
          _tileReady: function(coords, err, tile) {
            if (err) {
              this.fire("tileerror", {
                error: err,
                tile,
                coords
              });
            }
            var key = this._tileCoordsToKey(coords);
            tile = this._tiles[key];
            if (!tile) {
              return;
            }
            tile.loaded = +new Date();
            if (this._map._fadeAnimated) {
              setOpacity(tile.el, 0);
              cancelAnimFrame(this._fadeFrame);
              this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
            } else {
              tile.active = true;
              this._pruneTiles();
            }
            if (!err) {
              addClass(tile.el, "leaflet-tile-loaded");
              this.fire("tileload", {
                tile: tile.el,
                coords
              });
            }
            if (this._noTilesToLoad()) {
              this._loading = false;
              this.fire("load");
              if (ielt9 || !this._map._fadeAnimated) {
                requestAnimFrame(this._pruneTiles, this);
              } else {
                setTimeout(bind(this._pruneTiles, this), 250);
              }
            }
          },
          _getTilePos: function(coords) {
            return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
          },
          _wrapCoords: function(coords) {
            var newCoords = new Point(this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x, this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
            newCoords.z = coords.z;
            return newCoords;
          },
          _pxBoundsToTileRange: function(bounds) {
            var tileSize2 = this.getTileSize();
            return new Bounds(bounds.min.unscaleBy(tileSize2).floor(), bounds.max.unscaleBy(tileSize2).ceil().subtract([1, 1]));
          },
          _noTilesToLoad: function() {
            for (var key in this._tiles) {
              if (!this._tiles[key].loaded) {
                return false;
              }
            }
            return true;
          }
        });
        function gridLayer(options) {
          return new GridLayer(options);
        }
        var TileLayer = GridLayer.extend({
          options: {
            minZoom: 0,
            maxZoom: 18,
            subdomains: "abc",
            errorTileUrl: "",
            zoomOffset: 0,
            tms: false,
            zoomReverse: false,
            detectRetina: false,
            crossOrigin: false
          },
          initialize: function(url, options) {
            this._url = url;
            options = setOptions(this, options);
            if (options.detectRetina && retina && options.maxZoom > 0) {
              options.tileSize = Math.floor(options.tileSize / 2);
              if (!options.zoomReverse) {
                options.zoomOffset++;
                options.maxZoom--;
              } else {
                options.zoomOffset--;
                options.minZoom++;
              }
              options.minZoom = Math.max(0, options.minZoom);
            }
            if (typeof options.subdomains === "string") {
              options.subdomains = options.subdomains.split("");
            }
            if (!android) {
              this.on("tileunload", this._onTileRemove);
            }
          },
          setUrl: function(url, noRedraw) {
            if (this._url === url && noRedraw === void 0) {
              noRedraw = true;
            }
            this._url = url;
            if (!noRedraw) {
              this.redraw();
            }
            return this;
          },
          createTile: function(coords, done) {
            var tile = document.createElement("img");
            on(tile, "load", bind(this._tileOnLoad, this, done, tile));
            on(tile, "error", bind(this._tileOnError, this, done, tile));
            if (this.options.crossOrigin || this.options.crossOrigin === "") {
              tile.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
            }
            tile.alt = "";
            tile.setAttribute("role", "presentation");
            tile.src = this.getTileUrl(coords);
            return tile;
          },
          getTileUrl: function(coords) {
            var data = {
              r: retina ? "@2x" : "",
              s: this._getSubdomain(coords),
              x: coords.x,
              y: coords.y,
              z: this._getZoomForUrl()
            };
            if (this._map && !this._map.options.crs.infinite) {
              var invertedY = this._globalTileRange.max.y - coords.y;
              if (this.options.tms) {
                data["y"] = invertedY;
              }
              data["-y"] = invertedY;
            }
            return template(this._url, extend(data, this.options));
          },
          _tileOnLoad: function(done, tile) {
            if (ielt9) {
              setTimeout(bind(done, this, null, tile), 0);
            } else {
              done(null, tile);
            }
          },
          _tileOnError: function(done, tile, e) {
            var errorUrl = this.options.errorTileUrl;
            if (errorUrl && tile.getAttribute("src") !== errorUrl) {
              tile.src = errorUrl;
            }
            done(e, tile);
          },
          _onTileRemove: function(e) {
            e.tile.onload = null;
          },
          _getZoomForUrl: function() {
            var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom, zoomReverse = this.options.zoomReverse, zoomOffset = this.options.zoomOffset;
            if (zoomReverse) {
              zoom2 = maxZoom - zoom2;
            }
            return zoom2 + zoomOffset;
          },
          _getSubdomain: function(tilePoint) {
            var index2 = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
            return this.options.subdomains[index2];
          },
          _abortLoading: function() {
            var i, tile;
            for (i in this._tiles) {
              if (this._tiles[i].coords.z !== this._tileZoom) {
                tile = this._tiles[i].el;
                tile.onload = falseFn;
                tile.onerror = falseFn;
                if (!tile.complete) {
                  tile.src = emptyImageUrl;
                  remove(tile);
                  delete this._tiles[i];
                }
              }
            }
          },
          _removeTile: function(key) {
            var tile = this._tiles[key];
            if (!tile) {
              return;
            }
            if (!androidStock) {
              tile.el.setAttribute("src", emptyImageUrl);
            }
            return GridLayer.prototype._removeTile.call(this, key);
          },
          _tileReady: function(coords, err, tile) {
            if (!this._map || tile && tile.getAttribute("src") === emptyImageUrl) {
              return;
            }
            return GridLayer.prototype._tileReady.call(this, coords, err, tile);
          }
        });
        function tileLayer(url, options) {
          return new TileLayer(url, options);
        }
        var TileLayerWMS = TileLayer.extend({
          defaultWmsParams: {
            service: "WMS",
            request: "GetMap",
            layers: "",
            styles: "",
            format: "image/jpeg",
            transparent: false,
            version: "1.1.1"
          },
          options: {
            crs: null,
            uppercase: false
          },
          initialize: function(url, options) {
            this._url = url;
            var wmsParams = extend({}, this.defaultWmsParams);
            for (var i in options) {
              if (!(i in this.options)) {
                wmsParams[i] = options[i];
              }
            }
            options = setOptions(this, options);
            var realRetina = options.detectRetina && retina ? 2 : 1;
            var tileSize2 = this.getTileSize();
            wmsParams.width = tileSize2.x * realRetina;
            wmsParams.height = tileSize2.y * realRetina;
            this.wmsParams = wmsParams;
          },
          onAdd: function(map2) {
            this._crs = this.options.crs || map2.options.crs;
            this._wmsVersion = parseFloat(this.wmsParams.version);
            var projectionKey = this._wmsVersion >= 1.3 ? "crs" : "srs";
            this.wmsParams[projectionKey] = this._crs.code;
            TileLayer.prototype.onAdd.call(this, map2);
          },
          getTileUrl: function(coords) {
            var tileBounds = this._tileCoordsToNwSe(coords), crs = this._crs, bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])), min = bounds.min, max = bounds.max, bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ? [min.y, min.x, max.y, max.x] : [min.x, min.y, max.x, max.y]).join(","), url = TileLayer.prototype.getTileUrl.call(this, coords);
            return url + getParamString(this.wmsParams, url, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + bbox;
          },
          setParams: function(params, noRedraw) {
            extend(this.wmsParams, params);
            if (!noRedraw) {
              this.redraw();
            }
            return this;
          }
        });
        function tileLayerWMS(url, options) {
          return new TileLayerWMS(url, options);
        }
        TileLayer.WMS = TileLayerWMS;
        tileLayer.wms = tileLayerWMS;
        var Renderer = Layer.extend({
          options: {
            padding: 0.1,
            tolerance: 0
          },
          initialize: function(options) {
            setOptions(this, options);
            stamp(this);
            this._layers = this._layers || {};
          },
          onAdd: function() {
            if (!this._container) {
              this._initContainer();
              if (this._zoomAnimated) {
                addClass(this._container, "leaflet-zoom-animated");
              }
            }
            this.getPane().appendChild(this._container);
            this._update();
            this.on("update", this._updatePaths, this);
          },
          onRemove: function() {
            this.off("update", this._updatePaths, this);
            this._destroyContainer();
          },
          getEvents: function() {
            var events = {
              viewreset: this._reset,
              zoom: this._onZoom,
              moveend: this._update,
              zoomend: this._onZoomEnd
            };
            if (this._zoomAnimated) {
              events.zoomanim = this._onAnimZoom;
            }
            return events;
          },
          _onAnimZoom: function(ev) {
            this._updateTransform(ev.center, ev.zoom);
          },
          _onZoom: function() {
            this._updateTransform(this._map.getCenter(), this._map.getZoom());
          },
          _updateTransform: function(center, zoom2) {
            var scale2 = this._map.getZoomScale(zoom2, this._zoom), position = getPosition(this._container), viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding), currentCenterPoint = this._map.project(this._center, zoom2), destCenterPoint = this._map.project(center, zoom2), centerOffset = destCenterPoint.subtract(currentCenterPoint), topLeftOffset = viewHalf.multiplyBy(-scale2).add(position).add(viewHalf).subtract(centerOffset);
            if (any3d) {
              setTransform(this._container, topLeftOffset, scale2);
            } else {
              setPosition(this._container, topLeftOffset);
            }
          },
          _reset: function() {
            this._update();
            this._updateTransform(this._center, this._zoom);
            for (var id in this._layers) {
              this._layers[id]._reset();
            }
          },
          _onZoomEnd: function() {
            for (var id in this._layers) {
              this._layers[id]._project();
            }
          },
          _updatePaths: function() {
            for (var id in this._layers) {
              this._layers[id]._update();
            }
          },
          _update: function() {
            var p = this.options.padding, size = this._map.getSize(), min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
            this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
            this._center = this._map.getCenter();
            this._zoom = this._map.getZoom();
          }
        });
        var Canvas = Renderer.extend({
          getEvents: function() {
            var events = Renderer.prototype.getEvents.call(this);
            events.viewprereset = this._onViewPreReset;
            return events;
          },
          _onViewPreReset: function() {
            this._postponeUpdatePaths = true;
          },
          onAdd: function() {
            Renderer.prototype.onAdd.call(this);
            this._draw();
          },
          _initContainer: function() {
            var container = this._container = document.createElement("canvas");
            on(container, "mousemove", this._onMouseMove, this);
            on(container, "click dblclick mousedown mouseup contextmenu", this._onClick, this);
            on(container, "mouseout", this._handleMouseOut, this);
            this._ctx = container.getContext("2d");
          },
          _destroyContainer: function() {
            cancelAnimFrame(this._redrawRequest);
            delete this._ctx;
            remove(this._container);
            off(this._container);
            delete this._container;
          },
          _updatePaths: function() {
            if (this._postponeUpdatePaths) {
              return;
            }
            var layer;
            this._redrawBounds = null;
            for (var id in this._layers) {
              layer = this._layers[id];
              layer._update();
            }
            this._redraw();
          },
          _update: function() {
            if (this._map._animatingZoom && this._bounds) {
              return;
            }
            Renderer.prototype._update.call(this);
            var b = this._bounds, container = this._container, size = b.getSize(), m = retina ? 2 : 1;
            setPosition(container, b.min);
            container.width = m * size.x;
            container.height = m * size.y;
            container.style.width = size.x + "px";
            container.style.height = size.y + "px";
            if (retina) {
              this._ctx.scale(2, 2);
            }
            this._ctx.translate(-b.min.x, -b.min.y);
            this.fire("update");
          },
          _reset: function() {
            Renderer.prototype._reset.call(this);
            if (this._postponeUpdatePaths) {
              this._postponeUpdatePaths = false;
              this._updatePaths();
            }
          },
          _initPath: function(layer) {
            this._updateDashArray(layer);
            this._layers[stamp(layer)] = layer;
            var order = layer._order = {
              layer,
              prev: this._drawLast,
              next: null
            };
            if (this._drawLast) {
              this._drawLast.next = order;
            }
            this._drawLast = order;
            this._drawFirst = this._drawFirst || this._drawLast;
          },
          _addPath: function(layer) {
            this._requestRedraw(layer);
          },
          _removePath: function(layer) {
            var order = layer._order;
            var next = order.next;
            var prev = order.prev;
            if (next) {
              next.prev = prev;
            } else {
              this._drawLast = prev;
            }
            if (prev) {
              prev.next = next;
            } else {
              this._drawFirst = next;
            }
            delete layer._order;
            delete this._layers[stamp(layer)];
            this._requestRedraw(layer);
          },
          _updatePath: function(layer) {
            this._extendRedrawBounds(layer);
            layer._project();
            layer._update();
            this._requestRedraw(layer);
          },
          _updateStyle: function(layer) {
            this._updateDashArray(layer);
            this._requestRedraw(layer);
          },
          _updateDashArray: function(layer) {
            if (typeof layer.options.dashArray === "string") {
              var parts = layer.options.dashArray.split(/[, ]+/), dashArray = [], dashValue, i;
              for (i = 0; i < parts.length; i++) {
                dashValue = Number(parts[i]);
                if (isNaN(dashValue)) {
                  return;
                }
                dashArray.push(dashValue);
              }
              layer.options._dashArray = dashArray;
            } else {
              layer.options._dashArray = layer.options.dashArray;
            }
          },
          _requestRedraw: function(layer) {
            if (!this._map) {
              return;
            }
            this._extendRedrawBounds(layer);
            this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
          },
          _extendRedrawBounds: function(layer) {
            if (layer._pxBounds) {
              var padding = (layer.options.weight || 0) + 1;
              this._redrawBounds = this._redrawBounds || new Bounds();
              this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
              this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
            }
          },
          _redraw: function() {
            this._redrawRequest = null;
            if (this._redrawBounds) {
              this._redrawBounds.min._floor();
              this._redrawBounds.max._ceil();
            }
            this._clear();
            this._draw();
            this._redrawBounds = null;
          },
          _clear: function() {
            var bounds = this._redrawBounds;
            if (bounds) {
              var size = bounds.getSize();
              this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
            } else {
              this._ctx.save();
              this._ctx.setTransform(1, 0, 0, 1, 0, 0);
              this._ctx.clearRect(0, 0, this._container.width, this._container.height);
              this._ctx.restore();
            }
          },
          _draw: function() {
            var layer, bounds = this._redrawBounds;
            this._ctx.save();
            if (bounds) {
              var size = bounds.getSize();
              this._ctx.beginPath();
              this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
              this._ctx.clip();
            }
            this._drawing = true;
            for (var order = this._drawFirst; order; order = order.next) {
              layer = order.layer;
              if (!bounds || layer._pxBounds && layer._pxBounds.intersects(bounds)) {
                layer._updatePath();
              }
            }
            this._drawing = false;
            this._ctx.restore();
          },
          _updatePoly: function(layer, closed) {
            if (!this._drawing) {
              return;
            }
            var i, j, len2, p, parts = layer._parts, len = parts.length, ctx = this._ctx;
            if (!len) {
              return;
            }
            ctx.beginPath();
            for (i = 0; i < len; i++) {
              for (j = 0, len2 = parts[i].length; j < len2; j++) {
                p = parts[i][j];
                ctx[j ? "lineTo" : "moveTo"](p.x, p.y);
              }
              if (closed) {
                ctx.closePath();
              }
            }
            this._fillStroke(ctx, layer);
          },
          _updateCircle: function(layer) {
            if (!this._drawing || layer._empty()) {
              return;
            }
            var p = layer._point, ctx = this._ctx, r = Math.max(Math.round(layer._radius), 1), s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;
            if (s !== 1) {
              ctx.save();
              ctx.scale(1, s);
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
            if (s !== 1) {
              ctx.restore();
            }
            this._fillStroke(ctx, layer);
          },
          _fillStroke: function(ctx, layer) {
            var options = layer.options;
            if (options.fill) {
              ctx.globalAlpha = options.fillOpacity;
              ctx.fillStyle = options.fillColor || options.color;
              ctx.fill(options.fillRule || "evenodd");
            }
            if (options.stroke && options.weight !== 0) {
              if (ctx.setLineDash) {
                ctx.setLineDash(layer.options && layer.options._dashArray || []);
              }
              ctx.globalAlpha = options.opacity;
              ctx.lineWidth = options.weight;
              ctx.strokeStyle = options.color;
              ctx.lineCap = options.lineCap;
              ctx.lineJoin = options.lineJoin;
              ctx.stroke();
            }
          },
          _onClick: function(e) {
            var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;
            for (var order = this._drawFirst; order; order = order.next) {
              layer = order.layer;
              if (layer.options.interactive && layer._containsPoint(point)) {
                if (!(e.type === "click" || e.type !== "preclick") || !this._map._draggableMoved(layer)) {
                  clickedLayer = layer;
                }
              }
            }
            if (clickedLayer) {
              fakeStop(e);
              this._fireEvent([clickedLayer], e);
            }
          },
          _onMouseMove: function(e) {
            if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
              return;
            }
            var point = this._map.mouseEventToLayerPoint(e);
            this._handleMouseHover(e, point);
          },
          _handleMouseOut: function(e) {
            var layer = this._hoveredLayer;
            if (layer) {
              removeClass(this._container, "leaflet-interactive");
              this._fireEvent([layer], e, "mouseout");
              this._hoveredLayer = null;
              this._mouseHoverThrottled = false;
            }
          },
          _handleMouseHover: function(e, point) {
            if (this._mouseHoverThrottled) {
              return;
            }
            var layer, candidateHoveredLayer;
            for (var order = this._drawFirst; order; order = order.next) {
              layer = order.layer;
              if (layer.options.interactive && layer._containsPoint(point)) {
                candidateHoveredLayer = layer;
              }
            }
            if (candidateHoveredLayer !== this._hoveredLayer) {
              this._handleMouseOut(e);
              if (candidateHoveredLayer) {
                addClass(this._container, "leaflet-interactive");
                this._fireEvent([candidateHoveredLayer], e, "mouseover");
                this._hoveredLayer = candidateHoveredLayer;
              }
            }
            if (this._hoveredLayer) {
              this._fireEvent([this._hoveredLayer], e);
            }
            this._mouseHoverThrottled = true;
            setTimeout(bind(function() {
              this._mouseHoverThrottled = false;
            }, this), 32);
          },
          _fireEvent: function(layers2, e, type) {
            this._map._fireDOMEvent(e, type || e.type, layers2);
          },
          _bringToFront: function(layer) {
            var order = layer._order;
            if (!order) {
              return;
            }
            var next = order.next;
            var prev = order.prev;
            if (next) {
              next.prev = prev;
            } else {
              return;
            }
            if (prev) {
              prev.next = next;
            } else if (next) {
              this._drawFirst = next;
            }
            order.prev = this._drawLast;
            this._drawLast.next = order;
            order.next = null;
            this._drawLast = order;
            this._requestRedraw(layer);
          },
          _bringToBack: function(layer) {
            var order = layer._order;
            if (!order) {
              return;
            }
            var next = order.next;
            var prev = order.prev;
            if (prev) {
              prev.next = next;
            } else {
              return;
            }
            if (next) {
              next.prev = prev;
            } else if (prev) {
              this._drawLast = prev;
            }
            order.prev = null;
            order.next = this._drawFirst;
            this._drawFirst.prev = order;
            this._drawFirst = order;
            this._requestRedraw(layer);
          }
        });
        function canvas$1(options) {
          return canvas ? new Canvas(options) : null;
        }
        var vmlCreate = function() {
          try {
            document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml");
            return function(name) {
              return document.createElement("<lvml:" + name + ' class="lvml">');
            };
          } catch (e) {
            return function(name) {
              return document.createElement("<" + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
            };
          }
        }();
        var vmlMixin = {
          _initContainer: function() {
            this._container = create$1("div", "leaflet-vml-container");
          },
          _update: function() {
            if (this._map._animatingZoom) {
              return;
            }
            Renderer.prototype._update.call(this);
            this.fire("update");
          },
          _initPath: function(layer) {
            var container = layer._container = vmlCreate("shape");
            addClass(container, "leaflet-vml-shape " + (this.options.className || ""));
            container.coordsize = "1 1";
            layer._path = vmlCreate("path");
            container.appendChild(layer._path);
            this._updateStyle(layer);
            this._layers[stamp(layer)] = layer;
          },
          _addPath: function(layer) {
            var container = layer._container;
            this._container.appendChild(container);
            if (layer.options.interactive) {
              layer.addInteractiveTarget(container);
            }
          },
          _removePath: function(layer) {
            var container = layer._container;
            remove(container);
            layer.removeInteractiveTarget(container);
            delete this._layers[stamp(layer)];
          },
          _updateStyle: function(layer) {
            var stroke = layer._stroke, fill = layer._fill, options = layer.options, container = layer._container;
            container.stroked = !!options.stroke;
            container.filled = !!options.fill;
            if (options.stroke) {
              if (!stroke) {
                stroke = layer._stroke = vmlCreate("stroke");
              }
              container.appendChild(stroke);
              stroke.weight = options.weight + "px";
              stroke.color = options.color;
              stroke.opacity = options.opacity;
              if (options.dashArray) {
                stroke.dashStyle = isArray(options.dashArray) ? options.dashArray.join(" ") : options.dashArray.replace(/( *, *)/g, " ");
              } else {
                stroke.dashStyle = "";
              }
              stroke.endcap = options.lineCap.replace("butt", "flat");
              stroke.joinstyle = options.lineJoin;
            } else if (stroke) {
              container.removeChild(stroke);
              layer._stroke = null;
            }
            if (options.fill) {
              if (!fill) {
                fill = layer._fill = vmlCreate("fill");
              }
              container.appendChild(fill);
              fill.color = options.fillColor || options.color;
              fill.opacity = options.fillOpacity;
            } else if (fill) {
              container.removeChild(fill);
              layer._fill = null;
            }
          },
          _updateCircle: function(layer) {
            var p = layer._point.round(), r = Math.round(layer._radius), r2 = Math.round(layer._radiusY || r);
            this._setPath(layer, layer._empty() ? "M0 0" : "AL " + p.x + "," + p.y + " " + r + "," + r2 + " 0," + 65535 * 360);
          },
          _setPath: function(layer, path) {
            layer._path.v = path;
          },
          _bringToFront: function(layer) {
            toFront(layer._container);
          },
          _bringToBack: function(layer) {
            toBack(layer._container);
          }
        };
        var create$2 = vml ? vmlCreate : svgCreate;
        var SVG = Renderer.extend({
          getEvents: function() {
            var events = Renderer.prototype.getEvents.call(this);
            events.zoomstart = this._onZoomStart;
            return events;
          },
          _initContainer: function() {
            this._container = create$2("svg");
            this._container.setAttribute("pointer-events", "none");
            this._rootGroup = create$2("g");
            this._container.appendChild(this._rootGroup);
          },
          _destroyContainer: function() {
            remove(this._container);
            off(this._container);
            delete this._container;
            delete this._rootGroup;
            delete this._svgSize;
          },
          _onZoomStart: function() {
            this._update();
          },
          _update: function() {
            if (this._map._animatingZoom && this._bounds) {
              return;
            }
            Renderer.prototype._update.call(this);
            var b = this._bounds, size = b.getSize(), container = this._container;
            if (!this._svgSize || !this._svgSize.equals(size)) {
              this._svgSize = size;
              container.setAttribute("width", size.x);
              container.setAttribute("height", size.y);
            }
            setPosition(container, b.min);
            container.setAttribute("viewBox", [b.min.x, b.min.y, size.x, size.y].join(" "));
            this.fire("update");
          },
          _initPath: function(layer) {
            var path = layer._path = create$2("path");
            if (layer.options.className) {
              addClass(path, layer.options.className);
            }
            if (layer.options.interactive) {
              addClass(path, "leaflet-interactive");
            }
            this._updateStyle(layer);
            this._layers[stamp(layer)] = layer;
          },
          _addPath: function(layer) {
            if (!this._rootGroup) {
              this._initContainer();
            }
            this._rootGroup.appendChild(layer._path);
            layer.addInteractiveTarget(layer._path);
          },
          _removePath: function(layer) {
            remove(layer._path);
            layer.removeInteractiveTarget(layer._path);
            delete this._layers[stamp(layer)];
          },
          _updatePath: function(layer) {
            layer._project();
            layer._update();
          },
          _updateStyle: function(layer) {
            var path = layer._path, options = layer.options;
            if (!path) {
              return;
            }
            if (options.stroke) {
              path.setAttribute("stroke", options.color);
              path.setAttribute("stroke-opacity", options.opacity);
              path.setAttribute("stroke-width", options.weight);
              path.setAttribute("stroke-linecap", options.lineCap);
              path.setAttribute("stroke-linejoin", options.lineJoin);
              if (options.dashArray) {
                path.setAttribute("stroke-dasharray", options.dashArray);
              } else {
                path.removeAttribute("stroke-dasharray");
              }
              if (options.dashOffset) {
                path.setAttribute("stroke-dashoffset", options.dashOffset);
              } else {
                path.removeAttribute("stroke-dashoffset");
              }
            } else {
              path.setAttribute("stroke", "none");
            }
            if (options.fill) {
              path.setAttribute("fill", options.fillColor || options.color);
              path.setAttribute("fill-opacity", options.fillOpacity);
              path.setAttribute("fill-rule", options.fillRule || "evenodd");
            } else {
              path.setAttribute("fill", "none");
            }
          },
          _updatePoly: function(layer, closed) {
            this._setPath(layer, pointsToPath(layer._parts, closed));
          },
          _updateCircle: function(layer) {
            var p = layer._point, r = Math.max(Math.round(layer._radius), 1), r2 = Math.max(Math.round(layer._radiusY), 1) || r, arc = "a" + r + "," + r2 + " 0 1,0 ";
            var d = layer._empty() ? "M0 0" : "M" + (p.x - r) + "," + p.y + arc + r * 2 + ",0 " + arc + -r * 2 + ",0 ";
            this._setPath(layer, d);
          },
          _setPath: function(layer, path) {
            layer._path.setAttribute("d", path);
          },
          _bringToFront: function(layer) {
            toFront(layer._path);
          },
          _bringToBack: function(layer) {
            toBack(layer._path);
          }
        });
        if (vml) {
          SVG.include(vmlMixin);
        }
        function svg$1(options) {
          return svg || vml ? new SVG(options) : null;
        }
        Map2.include({
          getRenderer: function(layer) {
            var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;
            if (!renderer) {
              renderer = this._renderer = this._createRenderer();
            }
            if (!this.hasLayer(renderer)) {
              this.addLayer(renderer);
            }
            return renderer;
          },
          _getPaneRenderer: function(name) {
            if (name === "overlayPane" || name === void 0) {
              return false;
            }
            var renderer = this._paneRenderers[name];
            if (renderer === void 0) {
              renderer = this._createRenderer({ pane: name });
              this._paneRenderers[name] = renderer;
            }
            return renderer;
          },
          _createRenderer: function(options) {
            return this.options.preferCanvas && canvas$1(options) || svg$1(options);
          }
        });
        var Rectangle = Polygon.extend({
          initialize: function(latLngBounds, options) {
            Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
          },
          setBounds: function(latLngBounds) {
            return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
          },
          _boundsToLatLngs: function(latLngBounds) {
            latLngBounds = toLatLngBounds(latLngBounds);
            return [
              latLngBounds.getSouthWest(),
              latLngBounds.getNorthWest(),
              latLngBounds.getNorthEast(),
              latLngBounds.getSouthEast()
            ];
          }
        });
        function rectangle(latLngBounds, options) {
          return new Rectangle(latLngBounds, options);
        }
        SVG.create = create$2;
        SVG.pointsToPath = pointsToPath;
        GeoJSON.geometryToLayer = geometryToLayer;
        GeoJSON.coordsToLatLng = coordsToLatLng;
        GeoJSON.coordsToLatLngs = coordsToLatLngs;
        GeoJSON.latLngToCoords = latLngToCoords;
        GeoJSON.latLngsToCoords = latLngsToCoords;
        GeoJSON.getFeature = getFeature;
        GeoJSON.asFeature = asFeature;
        Map2.mergeOptions({
          boxZoom: true
        });
        var BoxZoom = Handler.extend({
          initialize: function(map2) {
            this._map = map2;
            this._container = map2._container;
            this._pane = map2._panes.overlayPane;
            this._resetStateTimeout = 0;
            map2.on("unload", this._destroy, this);
          },
          addHooks: function() {
            on(this._container, "mousedown", this._onMouseDown, this);
          },
          removeHooks: function() {
            off(this._container, "mousedown", this._onMouseDown, this);
          },
          moved: function() {
            return this._moved;
          },
          _destroy: function() {
            remove(this._pane);
            delete this._pane;
          },
          _resetState: function() {
            this._resetStateTimeout = 0;
            this._moved = false;
          },
          _clearDeferredResetState: function() {
            if (this._resetStateTimeout !== 0) {
              clearTimeout(this._resetStateTimeout);
              this._resetStateTimeout = 0;
            }
          },
          _onMouseDown: function(e) {
            if (!e.shiftKey || e.which !== 1 && e.button !== 1) {
              return false;
            }
            this._clearDeferredResetState();
            this._resetState();
            disableTextSelection();
            disableImageDrag();
            this._startPoint = this._map.mouseEventToContainerPoint(e);
            on(document, {
              contextmenu: stop,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown
            }, this);
          },
          _onMouseMove: function(e) {
            if (!this._moved) {
              this._moved = true;
              this._box = create$1("div", "leaflet-zoom-box", this._container);
              addClass(this._container, "leaflet-crosshair");
              this._map.fire("boxzoomstart");
            }
            this._point = this._map.mouseEventToContainerPoint(e);
            var bounds = new Bounds(this._point, this._startPoint), size = bounds.getSize();
            setPosition(this._box, bounds.min);
            this._box.style.width = size.x + "px";
            this._box.style.height = size.y + "px";
          },
          _finish: function() {
            if (this._moved) {
              remove(this._box);
              removeClass(this._container, "leaflet-crosshair");
            }
            enableTextSelection();
            enableImageDrag();
            off(document, {
              contextmenu: stop,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown
            }, this);
          },
          _onMouseUp: function(e) {
            if (e.which !== 1 && e.button !== 1) {
              return;
            }
            this._finish();
            if (!this._moved) {
              return;
            }
            this._clearDeferredResetState();
            this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);
            var bounds = new LatLngBounds(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));
            this._map.fitBounds(bounds).fire("boxzoomend", { boxZoomBounds: bounds });
          },
          _onKeyDown: function(e) {
            if (e.keyCode === 27) {
              this._finish();
            }
          }
        });
        Map2.addInitHook("addHandler", "boxZoom", BoxZoom);
        Map2.mergeOptions({
          doubleClickZoom: true
        });
        var DoubleClickZoom = Handler.extend({
          addHooks: function() {
            this._map.on("dblclick", this._onDoubleClick, this);
          },
          removeHooks: function() {
            this._map.off("dblclick", this._onDoubleClick, this);
          },
          _onDoubleClick: function(e) {
            var map2 = this._map, oldZoom = map2.getZoom(), delta = map2.options.zoomDelta, zoom2 = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;
            if (map2.options.doubleClickZoom === "center") {
              map2.setZoom(zoom2);
            } else {
              map2.setZoomAround(e.containerPoint, zoom2);
            }
          }
        });
        Map2.addInitHook("addHandler", "doubleClickZoom", DoubleClickZoom);
        Map2.mergeOptions({
          dragging: true,
          inertia: !android23,
          inertiaDeceleration: 3400,
          inertiaMaxSpeed: Infinity,
          easeLinearity: 0.2,
          worldCopyJump: false,
          maxBoundsViscosity: 0
        });
        var Drag = Handler.extend({
          addHooks: function() {
            if (!this._draggable) {
              var map2 = this._map;
              this._draggable = new Draggable(map2._mapPane, map2._container);
              this._draggable.on({
                dragstart: this._onDragStart,
                drag: this._onDrag,
                dragend: this._onDragEnd
              }, this);
              this._draggable.on("predrag", this._onPreDragLimit, this);
              if (map2.options.worldCopyJump) {
                this._draggable.on("predrag", this._onPreDragWrap, this);
                map2.on("zoomend", this._onZoomEnd, this);
                map2.whenReady(this._onZoomEnd, this);
              }
            }
            addClass(this._map._container, "leaflet-grab leaflet-touch-drag");
            this._draggable.enable();
            this._positions = [];
            this._times = [];
          },
          removeHooks: function() {
            removeClass(this._map._container, "leaflet-grab");
            removeClass(this._map._container, "leaflet-touch-drag");
            this._draggable.disable();
          },
          moved: function() {
            return this._draggable && this._draggable._moved;
          },
          moving: function() {
            return this._draggable && this._draggable._moving;
          },
          _onDragStart: function() {
            var map2 = this._map;
            map2._stop();
            if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
              var bounds = toLatLngBounds(this._map.options.maxBounds);
              this._offsetLimit = toBounds(this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1).add(this._map.getSize()));
              this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
            } else {
              this._offsetLimit = null;
            }
            map2.fire("movestart").fire("dragstart");
            if (map2.options.inertia) {
              this._positions = [];
              this._times = [];
            }
          },
          _onDrag: function(e) {
            if (this._map.options.inertia) {
              var time = this._lastTime = +new Date(), pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;
              this._positions.push(pos);
              this._times.push(time);
              this._prunePositions(time);
            }
            this._map.fire("move", e).fire("drag", e);
          },
          _prunePositions: function(time) {
            while (this._positions.length > 1 && time - this._times[0] > 50) {
              this._positions.shift();
              this._times.shift();
            }
          },
          _onZoomEnd: function() {
            var pxCenter = this._map.getSize().divideBy(2), pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
            this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
            this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
          },
          _viscousLimit: function(value, threshold) {
            return value - (value - threshold) * this._viscosity;
          },
          _onPreDragLimit: function() {
            if (!this._viscosity || !this._offsetLimit) {
              return;
            }
            var offset = this._draggable._newPos.subtract(this._draggable._startPos);
            var limit = this._offsetLimit;
            if (offset.x < limit.min.x) {
              offset.x = this._viscousLimit(offset.x, limit.min.x);
            }
            if (offset.y < limit.min.y) {
              offset.y = this._viscousLimit(offset.y, limit.min.y);
            }
            if (offset.x > limit.max.x) {
              offset.x = this._viscousLimit(offset.x, limit.max.x);
            }
            if (offset.y > limit.max.y) {
              offset.y = this._viscousLimit(offset.y, limit.max.y);
            }
            this._draggable._newPos = this._draggable._startPos.add(offset);
          },
          _onPreDragWrap: function() {
            var worldWidth = this._worldWidth, halfWidth = Math.round(worldWidth / 2), dx = this._initialWorldOffset, x = this._draggable._newPos.x, newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx, newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx, newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
            this._draggable._absPos = this._draggable._newPos.clone();
            this._draggable._newPos.x = newX;
          },
          _onDragEnd: function(e) {
            var map2 = this._map, options = map2.options, noInertia = !options.inertia || this._times.length < 2;
            map2.fire("dragend", e);
            if (noInertia) {
              map2.fire("moveend");
            } else {
              this._prunePositions(+new Date());
              var direction = this._lastPos.subtract(this._positions[0]), duration = (this._lastTime - this._times[0]) / 1e3, ease = options.easeLinearity, speedVector = direction.multiplyBy(ease / duration), speed = speedVector.distanceTo([0, 0]), limitedSpeed = Math.min(options.inertiaMaxSpeed, speed), limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed), decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease), offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
              if (!offset.x && !offset.y) {
                map2.fire("moveend");
              } else {
                offset = map2._limitOffset(offset, map2.options.maxBounds);
                requestAnimFrame(function() {
                  map2.panBy(offset, {
                    duration: decelerationDuration,
                    easeLinearity: ease,
                    noMoveStart: true,
                    animate: true
                  });
                });
              }
            }
          }
        });
        Map2.addInitHook("addHandler", "dragging", Drag);
        Map2.mergeOptions({
          keyboard: true,
          keyboardPanDelta: 80
        });
        var Keyboard = Handler.extend({
          keyCodes: {
            left: [37],
            right: [39],
            down: [40],
            up: [38],
            zoomIn: [187, 107, 61, 171],
            zoomOut: [189, 109, 54, 173]
          },
          initialize: function(map2) {
            this._map = map2;
            this._setPanDelta(map2.options.keyboardPanDelta);
            this._setZoomDelta(map2.options.zoomDelta);
          },
          addHooks: function() {
            var container = this._map._container;
            if (container.tabIndex <= 0) {
              container.tabIndex = "0";
            }
            on(container, {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown
            }, this);
            this._map.on({
              focus: this._addHooks,
              blur: this._removeHooks
            }, this);
          },
          removeHooks: function() {
            this._removeHooks();
            off(this._map._container, {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown
            }, this);
            this._map.off({
              focus: this._addHooks,
              blur: this._removeHooks
            }, this);
          },
          _onMouseDown: function() {
            if (this._focused) {
              return;
            }
            var body = document.body, docEl = document.documentElement, top = body.scrollTop || docEl.scrollTop, left = body.scrollLeft || docEl.scrollLeft;
            this._map._container.focus();
            window.scrollTo(left, top);
          },
          _onFocus: function() {
            this._focused = true;
            this._map.fire("focus");
          },
          _onBlur: function() {
            this._focused = false;
            this._map.fire("blur");
          },
          _setPanDelta: function(panDelta) {
            var keys = this._panKeys = {}, codes = this.keyCodes, i, len;
            for (i = 0, len = codes.left.length; i < len; i++) {
              keys[codes.left[i]] = [-1 * panDelta, 0];
            }
            for (i = 0, len = codes.right.length; i < len; i++) {
              keys[codes.right[i]] = [panDelta, 0];
            }
            for (i = 0, len = codes.down.length; i < len; i++) {
              keys[codes.down[i]] = [0, panDelta];
            }
            for (i = 0, len = codes.up.length; i < len; i++) {
              keys[codes.up[i]] = [0, -1 * panDelta];
            }
          },
          _setZoomDelta: function(zoomDelta) {
            var keys = this._zoomKeys = {}, codes = this.keyCodes, i, len;
            for (i = 0, len = codes.zoomIn.length; i < len; i++) {
              keys[codes.zoomIn[i]] = zoomDelta;
            }
            for (i = 0, len = codes.zoomOut.length; i < len; i++) {
              keys[codes.zoomOut[i]] = -zoomDelta;
            }
          },
          _addHooks: function() {
            on(document, "keydown", this._onKeyDown, this);
          },
          _removeHooks: function() {
            off(document, "keydown", this._onKeyDown, this);
          },
          _onKeyDown: function(e) {
            if (e.altKey || e.ctrlKey || e.metaKey) {
              return;
            }
            var key = e.keyCode, map2 = this._map, offset;
            if (key in this._panKeys) {
              if (!map2._panAnim || !map2._panAnim._inProgress) {
                offset = this._panKeys[key];
                if (e.shiftKey) {
                  offset = toPoint(offset).multiplyBy(3);
                }
                map2.panBy(offset);
                if (map2.options.maxBounds) {
                  map2.panInsideBounds(map2.options.maxBounds);
                }
              }
            } else if (key in this._zoomKeys) {
              map2.setZoom(map2.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
            } else if (key === 27 && map2._popup && map2._popup.options.closeOnEscapeKey) {
              map2.closePopup();
            } else {
              return;
            }
            stop(e);
          }
        });
        Map2.addInitHook("addHandler", "keyboard", Keyboard);
        Map2.mergeOptions({
          scrollWheelZoom: true,
          wheelDebounceTime: 40,
          wheelPxPerZoomLevel: 60
        });
        var ScrollWheelZoom = Handler.extend({
          addHooks: function() {
            on(this._map._container, "wheel", this._onWheelScroll, this);
            this._delta = 0;
          },
          removeHooks: function() {
            off(this._map._container, "wheel", this._onWheelScroll, this);
          },
          _onWheelScroll: function(e) {
            var delta = getWheelDelta(e);
            var debounce = this._map.options.wheelDebounceTime;
            this._delta += delta;
            this._lastMousePos = this._map.mouseEventToContainerPoint(e);
            if (!this._startTime) {
              this._startTime = +new Date();
            }
            var left = Math.max(debounce - (+new Date() - this._startTime), 0);
            clearTimeout(this._timer);
            this._timer = setTimeout(bind(this._performZoom, this), left);
            stop(e);
          },
          _performZoom: function() {
            var map2 = this._map, zoom2 = map2.getZoom(), snap = this._map.options.zoomSnap || 0;
            map2._stop();
            var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2, d4 = snap ? Math.ceil(d3 / snap) * snap : d3, delta = map2._limitZoom(zoom2 + (this._delta > 0 ? d4 : -d4)) - zoom2;
            this._delta = 0;
            this._startTime = null;
            if (!delta) {
              return;
            }
            if (map2.options.scrollWheelZoom === "center") {
              map2.setZoom(zoom2 + delta);
            } else {
              map2.setZoomAround(this._lastMousePos, zoom2 + delta);
            }
          }
        });
        Map2.addInitHook("addHandler", "scrollWheelZoom", ScrollWheelZoom);
        Map2.mergeOptions({
          tap: true,
          tapTolerance: 15
        });
        var Tap = Handler.extend({
          addHooks: function() {
            on(this._map._container, "touchstart", this._onDown, this);
          },
          removeHooks: function() {
            off(this._map._container, "touchstart", this._onDown, this);
          },
          _onDown: function(e) {
            if (!e.touches) {
              return;
            }
            preventDefault(e);
            this._fireClick = true;
            if (e.touches.length > 1) {
              this._fireClick = false;
              clearTimeout(this._holdTimeout);
              return;
            }
            var first = e.touches[0], el = first.target;
            this._startPos = this._newPos = new Point(first.clientX, first.clientY);
            if (el.tagName && el.tagName.toLowerCase() === "a") {
              addClass(el, "leaflet-active");
            }
            this._holdTimeout = setTimeout(bind(function() {
              if (this._isTapValid()) {
                this._fireClick = false;
                this._onUp();
                this._simulateEvent("contextmenu", first);
              }
            }, this), 1e3);
            this._simulateEvent("mousedown", first);
            on(document, {
              touchmove: this._onMove,
              touchend: this._onUp
            }, this);
          },
          _onUp: function(e) {
            clearTimeout(this._holdTimeout);
            off(document, {
              touchmove: this._onMove,
              touchend: this._onUp
            }, this);
            if (this._fireClick && e && e.changedTouches) {
              var first = e.changedTouches[0], el = first.target;
              if (el && el.tagName && el.tagName.toLowerCase() === "a") {
                removeClass(el, "leaflet-active");
              }
              this._simulateEvent("mouseup", first);
              if (this._isTapValid()) {
                this._simulateEvent("click", first);
              }
            }
          },
          _isTapValid: function() {
            return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
          },
          _onMove: function(e) {
            var first = e.touches[0];
            this._newPos = new Point(first.clientX, first.clientY);
            this._simulateEvent("mousemove", first);
          },
          _simulateEvent: function(type, e) {
            var simulatedEvent = document.createEvent("MouseEvents");
            simulatedEvent._simulated = true;
            e.target._simulatedClick = true;
            simulatedEvent.initMouseEvent(type, true, true, window, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
            e.target.dispatchEvent(simulatedEvent);
          }
        });
        if (touch && (!pointer || safari)) {
          Map2.addInitHook("addHandler", "tap", Tap);
        }
        Map2.mergeOptions({
          touchZoom: touch && !android23,
          bounceAtZoomLimits: true
        });
        var TouchZoom = Handler.extend({
          addHooks: function() {
            addClass(this._map._container, "leaflet-touch-zoom");
            on(this._map._container, "touchstart", this._onTouchStart, this);
          },
          removeHooks: function() {
            removeClass(this._map._container, "leaflet-touch-zoom");
            off(this._map._container, "touchstart", this._onTouchStart, this);
          },
          _onTouchStart: function(e) {
            var map2 = this._map;
            if (!e.touches || e.touches.length !== 2 || map2._animatingZoom || this._zooming) {
              return;
            }
            var p1 = map2.mouseEventToContainerPoint(e.touches[0]), p2 = map2.mouseEventToContainerPoint(e.touches[1]);
            this._centerPoint = map2.getSize()._divideBy(2);
            this._startLatLng = map2.containerPointToLatLng(this._centerPoint);
            if (map2.options.touchZoom !== "center") {
              this._pinchStartLatLng = map2.containerPointToLatLng(p1.add(p2)._divideBy(2));
            }
            this._startDist = p1.distanceTo(p2);
            this._startZoom = map2.getZoom();
            this._moved = false;
            this._zooming = true;
            map2._stop();
            on(document, "touchmove", this._onTouchMove, this);
            on(document, "touchend", this._onTouchEnd, this);
            preventDefault(e);
          },
          _onTouchMove: function(e) {
            if (!e.touches || e.touches.length !== 2 || !this._zooming) {
              return;
            }
            var map2 = this._map, p1 = map2.mouseEventToContainerPoint(e.touches[0]), p2 = map2.mouseEventToContainerPoint(e.touches[1]), scale2 = p1.distanceTo(p2) / this._startDist;
            this._zoom = map2.getScaleZoom(scale2, this._startZoom);
            if (!map2.options.bounceAtZoomLimits && (this._zoom < map2.getMinZoom() && scale2 < 1 || this._zoom > map2.getMaxZoom() && scale2 > 1)) {
              this._zoom = map2._limitZoom(this._zoom);
            }
            if (map2.options.touchZoom === "center") {
              this._center = this._startLatLng;
              if (scale2 === 1) {
                return;
              }
            } else {
              var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
              if (scale2 === 1 && delta.x === 0 && delta.y === 0) {
                return;
              }
              this._center = map2.unproject(map2.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
            }
            if (!this._moved) {
              map2._moveStart(true, false);
              this._moved = true;
            }
            cancelAnimFrame(this._animRequest);
            var moveFn = bind(map2._move, map2, this._center, this._zoom, { pinch: true, round: false });
            this._animRequest = requestAnimFrame(moveFn, this, true);
            preventDefault(e);
          },
          _onTouchEnd: function() {
            if (!this._moved || !this._zooming) {
              this._zooming = false;
              return;
            }
            this._zooming = false;
            cancelAnimFrame(this._animRequest);
            off(document, "touchmove", this._onTouchMove, this);
            off(document, "touchend", this._onTouchEnd, this);
            if (this._map.options.zoomAnimation) {
              this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
            } else {
              this._map._resetView(this._center, this._map._limitZoom(this._zoom));
            }
          }
        });
        Map2.addInitHook("addHandler", "touchZoom", TouchZoom);
        Map2.BoxZoom = BoxZoom;
        Map2.DoubleClickZoom = DoubleClickZoom;
        Map2.Drag = Drag;
        Map2.Keyboard = Keyboard;
        Map2.ScrollWheelZoom = ScrollWheelZoom;
        Map2.Tap = Tap;
        Map2.TouchZoom = TouchZoom;
        exports2.version = version;
        exports2.Control = Control;
        exports2.control = control;
        exports2.Browser = Browser;
        exports2.Evented = Evented;
        exports2.Mixin = Mixin;
        exports2.Util = Util;
        exports2.Class = Class;
        exports2.Handler = Handler;
        exports2.extend = extend;
        exports2.bind = bind;
        exports2.stamp = stamp;
        exports2.setOptions = setOptions;
        exports2.DomEvent = DomEvent;
        exports2.DomUtil = DomUtil;
        exports2.PosAnimation = PosAnimation;
        exports2.Draggable = Draggable;
        exports2.LineUtil = LineUtil;
        exports2.PolyUtil = PolyUtil;
        exports2.Point = Point;
        exports2.point = toPoint;
        exports2.Bounds = Bounds;
        exports2.bounds = toBounds;
        exports2.Transformation = Transformation;
        exports2.transformation = toTransformation;
        exports2.Projection = index;
        exports2.LatLng = LatLng;
        exports2.latLng = toLatLng;
        exports2.LatLngBounds = LatLngBounds;
        exports2.latLngBounds = toLatLngBounds;
        exports2.CRS = CRS;
        exports2.GeoJSON = GeoJSON;
        exports2.geoJSON = geoJSON;
        exports2.geoJson = geoJson;
        exports2.Layer = Layer;
        exports2.LayerGroup = LayerGroup;
        exports2.layerGroup = layerGroup;
        exports2.FeatureGroup = FeatureGroup;
        exports2.featureGroup = featureGroup;
        exports2.ImageOverlay = ImageOverlay;
        exports2.imageOverlay = imageOverlay;
        exports2.VideoOverlay = VideoOverlay;
        exports2.videoOverlay = videoOverlay;
        exports2.SVGOverlay = SVGOverlay;
        exports2.svgOverlay = svgOverlay;
        exports2.DivOverlay = DivOverlay;
        exports2.Popup = Popup;
        exports2.popup = popup;
        exports2.Tooltip = Tooltip;
        exports2.tooltip = tooltip;
        exports2.Icon = Icon;
        exports2.icon = icon;
        exports2.DivIcon = DivIcon;
        exports2.divIcon = divIcon;
        exports2.Marker = Marker;
        exports2.marker = marker;
        exports2.TileLayer = TileLayer;
        exports2.tileLayer = tileLayer;
        exports2.GridLayer = GridLayer;
        exports2.gridLayer = gridLayer;
        exports2.SVG = SVG;
        exports2.svg = svg$1;
        exports2.Renderer = Renderer;
        exports2.Canvas = Canvas;
        exports2.canvas = canvas$1;
        exports2.Path = Path;
        exports2.CircleMarker = CircleMarker;
        exports2.circleMarker = circleMarker;
        exports2.Circle = Circle;
        exports2.circle = circle;
        exports2.Polyline = Polyline;
        exports2.polyline = polyline;
        exports2.Polygon = Polygon;
        exports2.polygon = polygon;
        exports2.Rectangle = Rectangle;
        exports2.rectangle = rectangle;
        exports2.Map = Map2;
        exports2.map = createMap;
        var oldL = window.L;
        exports2.noConflict = function() {
          window.L = oldL;
          return this;
        };
        window.L = exports2;
      });
    }
  });

  // src_example/index.ts
  var import_leaflet4 = __toModule(require_leaflet_src());

  // src/wxtiles.ts
  var import_leaflet2 = __toModule(require_leaflet_src());

  // src/defaults/uconv.ts
  var __units_default_preset = {
    comment1: ["'degC': ['K', 1, 273.15] -> degC = K * 1 + 273.15", 0],
    comment2: ["'hPa': ['Pa', 1000]' -> hPa = Pa * 1000 + 0 (0 - could be ommited)", 0],
    K: ["K", 1],
    kelvin: ["K", 1],
    F: ["K", 0.5555555555, 255.372222222],
    C: ["K", 1, 273.15],
    degC: ["K", 1, 273.15],
    "kg/m^2/s": ["kg/m^2/s", 1],
    "Kg/m^2/s": ["kg/m^2/s", 1],
    "Kg m**-2 s**-1": ["kg/m^2/s", 1],
    "Kg m^-2 s^-1": ["kg/m^2/s", 1],
    "Kg m^{-2} s^-1": ["kg/m^2/s", 1],
    "mm/h": ["kg/m^2/s", 27777777e-11],
    "mm/hr": ["kg/m^2/s", 27777777e-11],
    "W/m^2": ["W/m^2", 1],
    "W m^-2": ["W/m^2", 1],
    "W m^{-2}": ["W/m^2", 1],
    "W/m**2": ["W/m^2", 1],
    "W m**-2": ["W/m^2", 1],
    "m/s": ["m/s", 1],
    "m s**-1": ["m/s", 1],
    "m s^-1": ["m/s", 1],
    "m.s^{-1}": ["m/s", 1],
    knot: ["m/s", 0.514444],
    knots: ["m/s", 0.514444],
    "km/h": ["m/s", 0.27777777777],
    "km h^-1": ["m/s", 0.27777777777],
    "km h**-1": ["m/s", 0.27777777777],
    s: ["s", 1],
    sec: ["s", 1],
    h: ["s", 3600],
    min: ["s", 60],
    m: ["m", 1],
    cm: ["m", 0.01],
    inch: ["m", 0.0254],
    Pa: ["Pa", 1],
    hPa: ["Pa", 100],
    degree: ["degree", 1],
    radian: ["degree", 57.3],
    "mg/m^3": ["mg/m^3", 1],
    "mg m^-3": ["mg/m^3", 1],
    "mg.m^-3": ["mg/m^3", 1],
    "%": ["%", 1],
    "(0 - 1)": ["%", 100]
  };

  // src/defaults/colorschemes.ts
  var __colorSchemes_default_preset = {
    none: ["#00000000", "#00000000"],
    rainbow: ["#ff0000ff", "#ffff00ff", "#00ff00ff", "#00ffffff", "#0000ffff", "#ff00ffff"],
    rainbowzerro: ["#ff000000", "#ff0000ff", "#ffff00ff", "#00ff00ff", "#00ffffff", "#0000ffff", "#ff00ffff"],
    rainbow2: ["#ff0000ff", "#ffff00ff", "#00ff00ff", "#00ffffff", "#0000ffff", "#ff00ffff", "#ff0000ff"],
    bluebird: ["#0000ffff", "#ff00ffff", "#00ffffff", "#9000ffff", "#9090ffff"],
    bluebirdzerro: ["#0000ff00", "#0000ffff", "#ff00ffff", "#00ffffff", "#9000ffff", "#9090ffff"],
    bw: ["#000000ff", "#ffffffff"],
    wb: ["#ffffffff", "#000000ff"],
    redish: ["#ff00ffff", "#ff0000ff", "#ffff00ff"],
    greenish: ["#ffff00ff", "#00ff00ff", "#00ffffff"],
    blueish: ["#ff00ffff", "#0000ffff", "#00ffffff"],
    hspastel: ["#AC6EA4FF", "#8E92BDFF", "#ACD4DEFF", "#E9DC8EFF", "#E7A97DFF", "#E59074FF", "#BE7E68FF", "#A88F86FF"]
  };

  // src/defaults/styles.ts
  var __colorStyles_default_preset = {
    base: {
      parent: void 0,
      name: "base",
      fill: "gradient",
      isolineColor: "inverted",
      isolineText: true,
      vectorType: "arrows",
      vectorColor: "inverted",
      streamLineColor: "#777",
      streamLineSpeedFactor: 1,
      streamLineStatic: false,
      showBelowMin: true,
      showAboveMax: true,
      colorScheme: "rainbow",
      colors: void 0,
      colorMap: void 0,
      levels: void 0,
      blurRadius: 0,
      addDegrees: 0,
      units: "",
      extraUnits: void 0,
      mask: "none"
    },
    custom: {
      parent: void 0,
      name: "custom",
      fill: "gradient",
      isolineColor: "inverted",
      isolineText: true,
      vectorType: "arrows",
      vectorColor: "inverted",
      streamLineColor: "#777",
      streamLineSpeedFactor: 1,
      streamLineStatic: false,
      showBelowMin: true,
      showAboveMax: true,
      colorScheme: "rainbow",
      colors: void 0,
      colorMap: void 0,
      levels: void 0,
      blurRadius: 0,
      addDegrees: 0,
      units: "",
      extraUnits: void 0,
      mask: "none"
    }
  };

  // src/wxtools.ts
  var _units;
  var _colorSchemes;
  var _colorStylesUnrolled;
  function WxTilesLibSetup({ colorStyles = {}, units = {}, colorSchemes = {} } = {}) {
    WXLOG("WxTile lib setup: start");
    _units = Object.assign({}, __units_default_preset, units);
    _colorSchemes = Object.assign({}, colorSchemes, __colorSchemes_default_preset);
    const toUnroll = Object.assign({}, colorStyles, __colorStyles_default_preset);
    _colorStylesUnrolled = unrollStylesParent(toUnroll);
    WXLOG("WxTile lib setup: styles unrolled");
    document.fonts.load("32px barbs");
    document.fonts.load("32px arrows");
    WXLOG("WxTile lib setup is done.");
  }
  function WxGetColorStyles() {
    return _colorStylesUnrolled;
  }
  function getColorSchemes() {
    return _colorSchemes;
  }
  function makeConverter(from, to, customUnits) {
    const localUnitsCopy = customUnits ? Object.assign({}, _units, customUnits) : _units;
    if (!localUnitsCopy || !from || !to || from === to || !localUnitsCopy[from] || !localUnitsCopy[to] || localUnitsCopy[from][0] !== localUnitsCopy[to][0]) {
      WXLOG(from === to ? "Trivial converter:" : "Inconvertible units. Default converter is used:", from, " -> ", to);
      const c = (x) => x;
      c.trivial = true;
      return c;
    }
    WXLOG("Converter: From:", from, " To:", to);
    const a = localUnitsCopy[from][1] / localUnitsCopy[to][1];
    const b = (localUnitsCopy[from][2] || 0) / localUnitsCopy[to][1] - (localUnitsCopy[to][2] || 0) / localUnitsCopy[to][1];
    return b ? (x) => a * x + b : (x) => a * x;
  }
  function unrollStylesParent(stylesArrInc) {
    const stylesInc = Object.assign({}, __colorStyles_default_preset);
    for (const name in stylesArrInc) {
      const styleA = stylesArrInc[name];
      if (Array.isArray(styleA)) {
        for (let i = 0; i < styleA.length; ++i) {
          stylesInc[name + "[" + i + "]"] = Object.assign({}, styleA[i]);
        }
      } else {
        stylesInc[name] = Object.assign({}, styleA);
      }
    }
    const inherit = (stylesInc2, name) => {
      if (name === "base")
        return __colorStyles_default_preset.base;
      const style = stylesInc2[name];
      if (!style.parent || !(style.parent in stylesInc2))
        style.parent = "base";
      const parent = inherit(stylesInc2, style.parent);
      return Object.assign(style, Object.assign({}, parent, style, { parent: "base" }));
    };
    const styles2 = {};
    for (const name in stylesInc) {
      styles2[name] = inherit(stylesInc, name);
    }
    return styles2;
  }
  function cacheIt(fn) {
    const cache = new Map();
    return (url) => {
      let res = cache.get(url);
      if (res === void 0) {
        res = fn(url);
        cache.set(url, res);
        if (res instanceof Promise)
          res.catch((e) => {
            if (e instanceof DOMException) {
              cache.delete(url);
            }
          });
      }
      return res;
    };
  }
  async function loadImage(url, controllerHolder) {
    const { signal } = controllerHolder.controller;
    var t;
    const blob = await (await fetch(url, { signal })).blob();
    const img = new Image();
    if (!signal.aborted) {
      const imageObjectURL = URL.createObjectURL(blob);
      img.src = imageObjectURL;
      await img.decode();
      URL.revokeObjectURL(imageObjectURL);
    }
    return img;
  }
  function imageToData(image) {
    const { width, height } = image;
    const context = Object.assign(document.createElement("canvas"), { width, height, imageSmoothingEnabled: false }).getContext("2d");
    if (!context)
      throw "catastrophe";
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, width, height);
  }
  async function loadImageData(url, controllerHolder) {
    return imageToData(await loadImage(url, controllerHolder));
  }
  function loadDataIntegral(url, controllerHolder) {
    const dataToIntegral = (imData) => {
      const imbuf = new Uint16Array(imData.data.buffer);
      const raw = new Uint16Array(imbuf.length / 2);
      for (let i = 0; i < raw.length; i++) {
        raw[i] = imbuf[i * 2];
      }
      const minmaxbuf = new Uint8Array(imData.data.buffer);
      for (let i = 0; i < 8; ++i) {
        minmaxbuf[i] = minmaxbuf[i * 4 + 2];
      }
      const view = new DataView(imData.data.buffer);
      const dmin = view.getFloat32(0, true);
      const dmax = view.getFloat32(4, true);
      const dmul = (dmax - dmin) / 65535;
      const integral = integralImage(raw);
      return { raw, dmin, dmax, dmul, integral, radius: 0 };
    };
    return loadImageData(url, controllerHolder).then(dataToIntegral);
  }
  function loadDataPictureCachedAbortable() {
    const controllerHolder = { controller: new AbortController() };
    const func = cacheIt((url) => loadDataIntegral(url, controllerHolder));
    func.controllerHolder = controllerHolder;
    return func;
  }
  function loadImageDataCachedAbortable(controller) {
    const controllerHolder = { controller };
    const func = cacheIt((url) => loadImageData(url, controllerHolder));
    func.controllerHolder = controllerHolder;
    return func;
  }
  function integralImage(raw) {
    const integral = new Uint32Array(258 * 258);
    const integralNZ = new Uint32Array(258 * 258);
    integral[0] = raw[0];
    integralNZ[0] = raw[0] === 0 ? 0 : 1;
    for (let i = 1; i < 258; ++i) {
      integral[i] = raw[i] + integral[i - 1];
      integral[258 * i] = raw[258 * i] + integral[258 * i - 258];
      integralNZ[i] = (raw[i] === 0 ? 0 : 1) + integralNZ[i - 1];
      integralNZ[258 * i] = (raw[258 * i] === 0 ? 0 : 1) + integralNZ[258 * i - 258];
    }
    for (let y = 1, i = 259; y < 258; ++y, ++i) {
      for (let x = 1; x < 258; ++x, ++i) {
        integral[i] = raw[i] + integral[i - 258] + integral[i - 1] - integral[i - 258 - 1];
        integralNZ[i] = (raw[i] === 0 ? 0 : 1) + integralNZ[i - 258] + integralNZ[i - 1] - integralNZ[i - 258 - 1];
      }
    }
    return { integral, integralNZ };
  }
  function blurData(im, radius) {
    if (radius < 0 || radius === im.radius)
      return im;
    im.radius = radius;
    const s = 258;
    const { integral, integralNZ } = im.integral;
    for (let y = 1; y < s; y++) {
      for (let x = 1; x < s; x++) {
        if (!im.raw[s * y + x]) {
          continue;
        }
        const rx = Math.min(radius, x - 1, s - 1 - x);
        const ry = Math.min(radius, y - 1, s - 1 - y);
        const i1 = s * (y - ry - 1) + x;
        const i2 = s * (y + ry) + x;
        const ANZ = integralNZ[i1 - rx - 1];
        const BNZ = integralNZ[i1 + rx];
        const CNZ = integralNZ[i2 - rx - 1];
        const DNZ = integralNZ[i2 + rx];
        const sumNZ = ANZ + DNZ - BNZ - CNZ;
        const A = integral[i1 - rx - 1];
        const B = integral[i1 + rx];
        const C = integral[i2 - rx - 1];
        const D = integral[i2 + rx];
        const sum = A + D - B - C;
        im.raw[y * s + x] = sum / sumNZ;
      }
    }
    return im;
  }
  function RGBtoHEX(rgb) {
    const r = rgb >> 0 & 255;
    const g = rgb >> 8 & 255;
    const b = rgb >> 16 & 255;
    let rs = r.toString(16);
    let gs = g.toString(16);
    let bs = b.toString(16);
    rs = rs.length === 2 ? rs : "0" + rs;
    gs = gs.length === 2 ? gs : "0" + gs;
    bs = bs.length === 2 ? bs : "0" + bs;
    return "#" + rs + gs + bs;
  }
  function HEXtoRGBA(c) {
    if (c[0] === "#") {
      if (c.length === 4)
        return +("0xff" + c[3] + c[3] + c[2] + c[2] + c[1] + c[1]);
      if (c.length === 7)
        return +("0xff" + c[5] + c[6] + c[3] + c[4] + c[1] + c[2]);
      if (c.length === 9)
        return +("0x" + c[7] + c[8] + c[5] + c[6] + c[3] + c[4] + c[1] + c[2]);
    }
    WXLOG("wrong color format", c);
    return 0;
  }
  async function fetchJson(url, init) {
    return (await fetch(url, init)).json();
  }
  function createEl(tagName, className = "", container) {
    var _a;
    const el = document.createElement(tagName);
    el.className = className;
    container && ((_a = container.appendChild) == null ? void 0 : _a.call(container, el));
    return el;
  }
  function mixColor(c1, c2, t) {
    const r1 = c1 >> 0 & 255;
    const g1 = c1 >> 8 & 255;
    const b1 = c1 >> 16 & 255;
    const a1 = c1 >>> 24;
    const r2 = c2 >> 0 & 255;
    const g2 = c2 >> 8 & 255;
    const b2 = c2 >> 16 & 255;
    const a2 = c2 >>> 24;
    const r = r1 + t * (r2 - r1);
    const g = g1 + t * (g2 - g1);
    const b = b1 + t * (b2 - b1);
    const a = a1 + t * (a2 - a1);
    return r | g << 8 | b << 16 | a << 24;
  }
  function createLevels(min, max, n) {
    const levels = [];
    for (let i = 0; i < n; ++i) {
      levels.push(i * (max - min) / (n - 1) + min);
    }
    return levels;
  }
  function getClosestTimeString(times, time) {
    let unixTime = typeof time === "number" ? time : typeof time === "string" ? new Date(time).getTime() : time.getTime();
    return times.find((stime) => new Date(stime).getTime() >= unixTime) || times[times.length - 1];
  }
  var wxlogging = false;
  function WxTilesLogging(on) {
    if (on) {
      console.log("Logging on");
    } else {
      console.log("Logging off");
    }
    wxlogging = on;
  }
  function WXLOG(...str) {
    if (wxlogging) {
      console.trace(...str);
    }
  }

  // src/tilesLayer.ts
  var import_leaflet = __toModule(require_leaflet_src());

  // src/RawCLUT.ts
  function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
  }
  var RawCLUT = class {
    constructor(style, dUnits, [dMin, dMax], vector) {
      const dDif = dMax - dMin;
      this.levelIndex = new Uint32Array(65536);
      this.colorsI = new Uint32Array(65536);
      const levels = [];
      this.DataToStyle = makeConverter(dUnits, style.units, style.extraUnits);
      if (this.DataToStyle.trivial)
        style.units = dUnits;
      vector && (this.DataToKnots = makeConverter(dUnits, "knot"));
      const styleValToData = makeConverter(style.units, dUnits, style.extraUnits);
      const styleValToRAW = (x) => ~~(65535 * clamp((styleValToData(x) - dMin) / (dMax - dMin), 0, 1));
      if (Array.isArray(style.colorMap)) {
        style.colorMap.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
        for (const [val] of style.colorMap) {
          levels.push(styleValToRAW(val));
        }
      } else {
        if (!style.levels) {
          style.levels = createLevels(this.DataToStyle(dMin), this.DataToStyle(dMax), 10);
        }
        style.levels.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        if (!style.colors) {
          const colorSchemes = getColorSchemes();
          if (style.colorScheme && style.colorScheme in colorSchemes) {
            style.colors = colorSchemes[style.colorScheme];
          } else {
            style.colors = colorSchemes.wb;
          }
        }
        for (const val of style.levels) {
          levels.push(styleValToRAW(val));
        }
      }
      const lSize = 65536;
      const legend = createLegend(lSize, style);
      this.ticks = legend.ticks;
      const lMin = legend.ticks[0].data;
      const lMax = legend.ticks[legend.ticks.length - 1].data;
      const lDif = lMax - lMin;
      for (let i = 0; i < 65536; ++i) {
        const d = dDif * i / 65535 + dMin;
        const l = this.DataToStyle(d);
        const li = Math.round((lSize - 1) * (l - lMin) / lDif);
        if (li <= 0) {
          this.colorsI[i] = style.showBelowMin ? legend.colors[0] : 0;
        } else if (li >= lSize) {
          this.colorsI[i] = style.showAboveMax ? legend.colors[lSize - 1] : 0;
        } else {
          this.colorsI[i] = legend.colors[li];
        }
      }
      this.colorsI[0] = 0;
      for (let i = 0; i < levels[0]; ++i) {
        this.levelIndex[i] = 0;
      }
      for (let li = 0; li < levels.length - 1; li++) {
        for (let i = levels[li]; i < levels[li + 1] + 1; ++i) {
          this.levelIndex[i] = li;
        }
      }
      for (let i = levels[levels.length - 1]; i < 65536; ++i) {
        this.levelIndex[i] = levels.length - 1;
      }
    }
  };
  function numToString(n) {
    var _a;
    if (n !== 0 && -0.1 < n && n < 0.1)
      return n.toExponential(2);
    const ns = n.toString();
    if (((_a = ns.split(".")[1]) == null ? void 0 : _a.length) > 2)
      return n.toFixed(2);
    return ns;
  }
  function createLegend(size, style) {
    const legend = {
      size,
      showBelowMin: style.showBelowMin,
      showAboveMax: style.showAboveMax,
      units: style.units,
      colors: new Uint32Array(size),
      ticks: []
    };
    const { colorMap, levels, colors } = style;
    const gradient = style.fill !== "solid";
    if (colorMap) {
      const dMin2 = colorMap[0][0];
      const dDif = colorMap[colorMap.length - 1][0] - dMin2;
      for (const [data, color] of colorMap) {
        const pos = ~~((data - dMin2) / dDif * (size - 1));
        const tick = { data, dataString: numToString(data), color, pos };
        legend.ticks.push(tick);
      }
      for (let li = 0; li < colorMap.length - 1; li++) {
        const pos0 = legend.ticks[li].pos;
        const pos1 = legend.ticks[li + 1].pos;
        const c02 = HEXtoRGBA(colorMap[li][1]);
        const c12 = gradient ? HEXtoRGBA(colorMap[li + 1][1]) : 0;
        for (let i = pos0; i < pos1; ++i) {
          legend.colors[i] = gradient ? mixColor(c02, c12, (i - pos0) / (pos1 - pos0)) : c02;
        }
      }
      legend.colors[size - 1] = HEXtoRGBA(colorMap[colorMap.length - 1][1]);
      return legend;
    }
    if (!colors || !levels)
      return legend;
    let c0 = 0;
    let c1 = 0;
    let ci = -1;
    for (let i = 0; i < size; ++i) {
      const cf = i * (colors.length - 1) / size;
      if (ci !== ~~cf) {
        ci = ~~cf;
        c0 = HEXtoRGBA(colors[ci]);
        c1 = colors.length > ci + 1 ? HEXtoRGBA(colors[ci + 1]) : c0;
      }
      legend.colors[i] = gradient ? mixColor(c0, c1, cf - ci) : c0;
    }
    legend.colors[size - 1] = HEXtoRGBA(colors[colors.length - 1]);
    const dMin = levels[0];
    const dMul = (size - 1) / (levels[levels.length - 1] - dMin);
    for (const data of levels) {
      const pos = ~~((data - dMin) * dMul);
      const tick = { data, dataString: numToString(data), color: RGBtoHEX(legend.colors[pos]), pos };
      legend.ticks.push(tick);
    }
    return legend;
  }

  // src/mercator.ts
  var tileSize = 256;
  var initialResolution = 2 * Math.PI * 6378137 / tileSize;
  var originShift = 2 * Math.PI * 6378137 / 2;
  function MetersToLatLon(x, y) {
    let lon = x / originShift * 180;
    let lat = y / originShift * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return [lat, lon];
  }
  function PixelsToMeters(px, py, zoom) {
    const res = Resolution(zoom);
    const x = px * res - originShift;
    const y = py * res - originShift;
    return [x, y];
  }
  function Resolution(zoom) {
    return initialResolution / Math.pow(2, zoom);
  }
  function PixelsToLonLat(px, py, zoom) {
    const [lat, lon] = MetersToLatLon(...PixelsToMeters(px, py, zoom));
    return [lon, -lat];
  }
  function coordToPixel(x, y) {
    return [x * tileSize, y * tileSize];
  }

  // src/qtree.ts
  var fullSimbol = "A".charCodeAt(0);
  var qtree;
  var qtreedepth = 0;
  async function LoadQTree(input, init) {
    let _seamask;
    try {
      _seamask = await (await fetch(input, init)).json();
    } catch (e) {
      console.log("Can't load QTree:", e);
      return;
    }
    qtree = QTFromString(_seamask, { pos: 0 });
    qtreedepth = Depth(qtree);
    console.log("Loaded QTree, depth:", qtreedepth);
  }
  function QTFromString(s, o) {
    const code = s.charCodeAt(o.pos) - fullSimbol;
    o.pos++;
    const sub1 = code & 1 ? QTFromString(s, o) : null;
    const sub2 = code & 2 ? QTFromString(s, o) : null;
    const sub4 = code & 4 ? QTFromString(s, o) : null;
    const sub8 = code & 8 ? QTFromString(s, o) : null;
    const sub = sub1 || sub2 || sub4 || sub8 ? [sub1, sub2, sub4, sub8] : null;
    return { sub };
  }
  function Depth(tree) {
    let d = 0;
    if (tree == null ? void 0 : tree.sub) {
      for (let i = 0; i < 4; i++) {
        if (tree.sub[i] !== null) {
          const d1 = Depth(tree.sub[i]) + 1;
          if (d < d1) {
            d = d1;
          }
        }
      }
    }
    return d;
  }
  var TileType;
  (function(TileType2) {
    TileType2["Land"] = "land";
    TileType2["Mixed"] = "mixed";
    TileType2["Sea"] = "sea";
  })(TileType || (TileType = {}));
  function QTreeCheckCoord(coord) {
    if (!qtreedepth)
      return TileType.Mixed;
    let c = __spreadValues({}, coord);
    let deepest = false;
    if (qtreedepth <= coord.z) {
      deepest = true;
      const d = coord.z - qtreedepth;
      c = { x: coord.x >> d, y: coord.y >> d, z: qtreedepth };
    }
    return qTreeCheckCoord(qtree, c, deepest);
  }
  function qTreeCheckCoord(qt, c, deepest) {
    if (qt === null)
      return TileType.Land;
    if (deepest && c.z === 0)
      return TileType.Mixed;
    if (qt.sub === null)
      return TileType.Sea;
    if (c.z === 0)
      return TileType.Mixed;
    c.z--;
    const subx = c.x >> c.z & 1;
    const suby = c.y >> c.z & 1;
    const ind = suby << 1 | subx;
    return qTreeCheckCoord(qt.sub[ind], c, deepest);
  }

  // src/tile.ts
  function subDataDegree(data, subCoords) {
    if (!subCoords)
      return data;
    const s = 0.9999999 / Math.pow(2, subCoords.z);
    const sx = subCoords.x * 256 * s;
    const sy = subCoords.y * 256 * s;
    const subData2 = { raw: new Uint16Array(258 * 258), dmin: data.dmin, dmax: data.dmax, dmul: data.dmul };
    const { raw } = subData2;
    for (let y = -1, i = 0; y <= 256; y++) {
      const dy = sy + y * s;
      const dyi = Math.floor(dy);
      const dyt = dy - dyi;
      for (let x = -1; x <= 256; x++, i++) {
        const dx = sx + x * s;
        const dxi = Math.floor(dx);
        const dxt = dx - dxi;
        const di = dxi + 1 + (dyi + 1) * 258;
        let a = data.raw[di];
        let b = data.raw[di + 1];
        let c = data.raw[di + 258];
        let d = data.raw[di + 258 + 1];
        const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
        switch (sq) {
          case 0:
            raw[i] = 0;
            continue;
          case 1:
            raw[i] = a;
            continue;
          case 2:
            raw[i] = b;
            continue;
          case 3:
            c = a;
            d = b;
            break;
          case 4:
            raw[i] = c;
            continue;
          case 5:
            b = a;
            d = c;
            break;
          case 6:
            d = b + c >> 1;
            a = d;
            break;
          case 7:
            d = b + c >> 1;
            break;
          case 8:
            raw[i] = d;
            continue;
          case 9:
            b = a + d >> 1;
            c = b;
            break;
          case 10:
            a = b;
            c = d;
            break;
          case 11:
            c = a + d >> 1;
            break;
          case 12:
            a = c;
            b = d;
            break;
          case 13:
            b = a + d >> 1;
            break;
          case 14:
            a = b + c >> 1;
            break;
        }
        a = data.dmin + data.dmul * a;
        b = data.dmin + data.dmul * b;
        c = data.dmin + data.dmul * c;
        d = data.dmin + data.dmul * d;
        const u = linearInterpDegree(a, b, dxt);
        const l = linearInterpDegree(c, d, dxt);
        raw[i] = (linearInterpDegree(u, l, dyt) - data.dmin) / data.dmul;
        if (raw[i] === 0)
          raw[i] = 1;
      }
    }
    return subData2;
  }
  function linearInterpDegree(start2, end, amount) {
    const shortestAngle = ((end - start2) % 360 + 540) % 360 - 180;
    return (start2 + shortestAngle * amount + 360) % 360;
  }
  function subData(data, subCoords) {
    if (!subCoords)
      return data;
    const s = 0.9999999 / Math.pow(2, subCoords.z);
    const sx = subCoords.x * 256 * s;
    const sy = subCoords.y * 256 * s;
    const subData2 = { raw: new Uint16Array(258 * 258), dmin: data.dmin, dmax: data.dmax, dmul: data.dmul };
    const { raw } = subData2;
    for (let y = -1, i = 0; y <= 256; y++) {
      const dy = sy + y * s;
      const dyi = Math.floor(dy);
      const dyt = dy - dyi;
      for (let x = -1; x <= 256; x++, i++) {
        const dx = sx + x * s;
        const dxi = Math.floor(dx);
        const dxt = dx - dxi;
        const di = dxi + 1 + (dyi + 1) * 258;
        const a = data.raw[di];
        const b = data.raw[di + 1];
        const c = data.raw[di + 258];
        const d = data.raw[di + 258 + 1];
        const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
        switch (sq) {
          case 7:
            raw[i] = dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : 0;
            continue;
          case 14:
            raw[i] = dxt + dyt < 1 ? 0 : dxt * (d - c) + dyt * (d - b) + b + c - d;
            continue;
          case 11:
            raw[i] = dyt < dxt ? (1 - dxt) * (a - b) + dyt * (d - b) + b : 0;
            continue;
          case 13:
            raw[i] = dyt < dxt ? 0 : (1 - dxt) * (c - d) + dyt * (c - a) + a + d - c;
            continue;
          case 15:
            raw[i] = dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : dxt * (d - c) + dyt * (d - b) + b + c - d;
            continue;
          default:
            raw[i] = 0;
        }
      }
    }
    return subData2;
  }
  function applyMask(data, mask, maskType) {
    const t = maskType === "land" ? 1 : 0;
    for (let maskIndex = 3, y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++, maskIndex += 4) {
        const m = mask.data[maskIndex] ? 1 : 0;
        if (t ^ m) {
          data.raw[(y + 1) * 258 + (x + 1)] = 0;
        }
      }
    }
    return data;
  }
  function makeBox(coords) {
    const [px, py] = coordToPixel(coords.x, coords.y);
    const [west, north] = PixelsToLonLat(px, py, coords.z);
    const [east, south] = PixelsToLonLat(px + 256, py + 256, coords.z);
    return { west, north, east, south };
  }
  function TileCreate({ layer, coords, done }) {
    const tileEl = createEl("div", "leaflet-tile s-tile");
    tileEl.wxtile = new WxTile({ layer, coords, tileEl });
    tileEl.wxtile.load().then((wxtile) => {
      wxtile.draw();
      done();
    });
    return tileEl;
  }
  var WxTile = class {
    constructor({ layer, coords, tileEl }) {
      this.data = [];
      this.sLines = [];
      this.coords = coords;
      this.layer = layer;
      this.canvasFill = createEl("canvas", "s-tile canvas-fill", tileEl);
      this.canvasSlines = createEl("canvas", "s-tile canvas-slines", tileEl);
      this.canvasVector = this.canvasFill;
      this.canvasFill.width = this.canvasFill.height = this.canvasSlines.width = this.canvasSlines.height = 256;
      function getCtx(el) {
        const ctx = el.getContext("2d");
        if (!ctx)
          throw "error";
        return ctx;
      }
      this.canvasFillCtx = getCtx(this.canvasFill);
      this.imData = this.canvasFillCtx.createImageData(256, 256);
      this.canvasSlinesCtx = getCtx(this.canvasSlines);
      this.canvasVectorCtx = this.canvasFillCtx;
    }
    draw() {
      this.canvasFillCtx.clearRect(0, 0, 256, 256);
      this.canvasSlinesCtx.clearRect(0, 0, 256, 256);
      if (!this.data.length) {
        return;
      }
      this._drawFillAndIsolines();
      this._drawVector();
      this._drawDegree();
      this._drawStaticSlines();
    }
    clearSLinesCanvas() {
      this.canvasSlinesCtx.clearRect(0, 0, 256, 256);
    }
    drawSLines(timeStemp) {
      if (this.sLines.length === 0)
        return;
      const ctx = this.canvasSlinesCtx;
      ctx.clearRect(0, 0, 256, 256);
      if (this.layer.style.streamLineColor === "none") {
        this.sLines = [];
        return;
      }
      const baseColor = this.layer.style.streamLineColor.substr(0, 7);
      timeStemp = timeStemp >> 7;
      for (let i = 0; i < this.sLines.length; ++i) {
        const sLine = this.sLines[i];
        const sSize = sLine.length - 1;
        let seed = (timeStemp + (1 + sLine[0].x) * (1 + sLine[0].y)) % 30;
        for (let k = 0; k < sSize; ++k) {
          const p0 = sLine[k];
          const p1 = sLine[k + 1];
          let t = 1 - (seed - k) / sSize;
          if (t < 0 || t > 1)
            t = 0;
          const col = (~~(t * 255)).toString(16);
          ctx.strokeStyle = baseColor + (col.length < 2 ? "0" + col : col);
          const w = 1 + ~~((1.2 - t) * 5);
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }
    }
    getData({ x, y }) {
      if (!this.data.length)
        return;
      const raw = this.data[0].raw[(y + 1) * 258 + (x + 1)];
      return { raw, data: this.data[0].dmin + this.data[0].dmul * raw };
    }
    async load() {
      var _a;
      const { coords, layer } = this;
      const { boundaries } = layer.state.meta;
      const maskType = this.layer.style.mask;
      var tileType;
      if (maskType === "land" || maskType === "sea") {
        tileType = QTreeCheckCoord(coords);
        if (maskType === tileType) {
          this.data = [];
          this.sLines = [];
          return this;
        }
      }
      if (boundaries == null ? void 0 : boundaries.boundaries180) {
        const bbox = makeBox(coords);
        const rectIntersect = (b) => !(bbox.west > b.east || b.west > bbox.east || bbox.south > b.north || b.south > bbox.north);
        if (!boundaries.boundaries180.some(rectIntersect)) {
          this.data = [];
          this.sLines = [];
          return this;
        }
      }
      const { upCoords, subCoords } = this._splitCoords(coords);
      const URLs = this._coordsToURLs(upCoords);
      let data;
      try {
        data = await Promise.all(URLs.map(layer.loadData));
      } catch (e) {
        return this;
      }
      const interpolator = ((_a = layer.state) == null ? void 0 : _a.units) === "degree" ? subDataDegree : subData;
      this.data = data.map((d) => interpolator(blurData(d, this.layer.style.blurRadius), subCoords));
      if (this.layer.vector) {
        this._vectorPrepare();
      }
      if (maskType && tileType === TileType.Mixed) {
        const url = layer.state.maskServerURI.replace("{z}", String(coords.z)).replace("{x}", String(coords.x)).replace("{y}", String(coords.y));
        try {
          const mask = await layer.loadMask(url);
          applyMask(this.data[0], mask, maskType);
        } catch (e) {
          this.layer.style.mask = void 0;
          WXLOG("Can't load Mask. Turned off");
        }
      }
      if (this.layer.vector) {
        this._createSLines();
      }
      return this;
    }
    _splitCoords(coords) {
      const zDif = coords.z - this.layer.state.meta.maxZoom;
      if (zDif <= 0) {
        return { upCoords: coords };
      }
      const upCoords = { x: coords.x >>> zDif, y: coords.y >>> zDif, z: this.layer.state.meta.maxZoom };
      const subCoords = { x: coords.x & (1 << zDif) - 1, y: coords.y & (1 << zDif) - 1, z: zDif };
      return { upCoords, subCoords };
    }
    _coordsToURLs(upCoords) {
      const u = this.layer.state.baseURL.replace("{z}", String(upCoords.z)).replace("{x}", String(upCoords.x)).replace("{y}", String(upCoords.y));
      return this.layer.dataSource.variables.map((v) => u.replace("{var}", v));
    }
    _vectorPrepare() {
      if (this.data.length !== 2)
        throw "this.data !== 2";
      this.data.unshift({ raw: new Uint16Array(258 * 258), dmin: 0, dmax: 0, dmul: 0 });
      const [l, u, v] = this.data;
      l.dmax = 1.42 * Math.max(-u.dmin, u.dmax, -v.dmin, v.dmax);
      l.dmul = (l.dmax - l.dmin) / 65535;
      for (let i = 0; i < 258 * 258; ++i) {
        if (!u.raw[i] || !v.raw[i]) {
          l.raw[i] = 0;
          continue;
        }
        const _u = u.dmin + u.dmul * u.raw[i];
        const _v = v.dmin + v.dmul * v.raw[i];
        l.raw[i] = Math.sqrt(_v * _v + _u * _u) / l.dmul;
      }
    }
    _drawFillAndIsolines() {
      const { imData } = this;
      const { canvasFillCtx } = this;
      const im = new Uint32Array(imData.data.buffer);
      const { raw } = this.data[0];
      const { clut, style } = this.layer;
      const { levelIndex, colorsI } = clut;
      if (style.fill !== "none") {
        const fillC = colorsI;
        for (let y = 0, i = 0, di = 259; y < 256; ++y, di += 2) {
          for (let x = 0; x < 256; ++x, ++i, ++di) {
            im[i] = fillC[raw[di]];
          }
        }
      } else {
        im.fill(0);
      }
      const info = [];
      if (style.isolineColor !== "none") {
        const flatColor = style.isolineColor[0] === "#" ? HEXtoRGBA(style.isolineColor) : 0;
        for (let y = 0, t = 0; y < 256; y += 1) {
          for (let x = 0; x < 256; x += 1) {
            const i = (y + 1) * 258 + (x + 1);
            const d = raw[i];
            const dr = raw[i + 1];
            const db = raw[i + 258];
            if (!d || !dr || !db)
              continue;
            const lic = levelIndex[d];
            const lir = levelIndex[dr];
            const lib = levelIndex[db];
            if (lic !== lir || lic !== lib) {
              const mli = Math.max(lic, lir, lib);
              const md = Math.max(d, dr, db);
              const ii = y * 256 + x;
              switch (style.isolineColor) {
                case "inverted":
                  im[ii] = ~colorsI[md] | 4278190080;
                  break;
                case "fill":
                  im[ii] = colorsI[md] | 4278190080;
                  break;
                default:
                  im[ii] = flatColor;
                  break;
              }
              if (style.isolineText && !(++t % 255) && x > 20 && x < 235 && y > 20 && y < 235) {
                info.push({ x, y, d, dr, db, mli });
              }
            }
          }
        }
      }
      canvasFillCtx.putImageData(imData, 0, 0);
      if (!info.length) {
        canvasFillCtx.font = "1.1em Sans-serif";
        canvasFillCtx.lineWidth = 2;
        canvasFillCtx.strokeStyle = "white";
        canvasFillCtx.fillStyle = "black";
        canvasFillCtx.textAlign = "center";
        canvasFillCtx.textBaseline = "middle";
        for (const { x, y, d, dr, db, mli } of info) {
          const val = this.layer.clut.ticks[mli].dataString;
          const angle = Math.atan2(d - dr, db - d);
          canvasFillCtx.save();
          canvasFillCtx.translate(x, y);
          canvasFillCtx.rotate(angle < -1.57 || angle > 1.57 ? angle + 3.14 : angle);
          canvasFillCtx.strokeText(val, 0, 0);
          canvasFillCtx.fillText(val, 0, 0);
          canvasFillCtx.restore();
        }
      }
    }
    _drawStaticSlines() {
      if (!this.sLines.length || !this.layer.style.streamLineStatic)
        return;
      const { canvasSlinesCtx } = this;
      if (this.layer.style.streamLineColor === "none") {
        this.sLines = [];
        return;
      }
      canvasSlinesCtx.lineWidth = 2;
      canvasSlinesCtx.strokeStyle = this.layer.style.streamLineColor;
      canvasSlinesCtx.beginPath();
      for (let i = this.sLines.length; i--; ) {
        const sLine = this.sLines[i];
        for (let k = 0; k < sLine.length - 1; ++k) {
          const p0 = sLine[k];
          const p1 = sLine[k + 1];
          canvasSlinesCtx.moveTo(p0.x, p0.y);
          canvasSlinesCtx.lineTo(p1.x, p1.y);
        }
      }
      canvasSlinesCtx.stroke();
    }
    _drawVector() {
      if (!this.layer.vector || !this.layer.clut.DataToKnots)
        return;
      if (!this.layer.style.vectorColor || this.layer.style.vectorColor === "none")
        return;
      if (!this.layer.style.vectorType || this.layer.style.vectorType === "none")
        return;
      if (this.data.length !== 3)
        throw "this.data.length !== 3";
      const [l, u, v] = this.data;
      const { canvasVectorCtx } = this;
      switch (this.layer.style.vectorType) {
        case "barbs":
          canvasVectorCtx.font = "40px barbs";
          break;
        case "arrows":
          canvasVectorCtx.font = "50px arrows";
          break;
        default:
          canvasVectorCtx.font = this.layer.style.vectorType;
      }
      canvasVectorCtx.textAlign = "center";
      canvasVectorCtx.textBaseline = "middle";
      const addDegrees = this.layer.style.addDegrees ? 0.017453292519943 * this.layer.style.addDegrees : 0;
      const gridStep = 32;
      for (let y = gridStep / 2; y < 256; y += gridStep) {
        for (let x = gridStep / 2; x < 256; x += gridStep) {
          const di = x + 1 + (y + 1) * 258;
          if (!l.raw[di])
            continue;
          const ang = Math.atan2(u.dmin + u.raw[di] * u.dmul, v.dmin + v.raw[di] * v.dmul);
          const vecLen = l.dmin + l.raw[di] * l.dmul;
          const sm = this.layer.dataSource.variables[0].includes("current") ? 5 : 0.2;
          const vecCode = Math.min(this.layer.clut.DataToKnots(vecLen) * sm, 25) + 65;
          const vecChar = String.fromCharCode(vecCode);
          switch (this.layer.style.vectorColor) {
            case "inverted":
              canvasVectorCtx.fillStyle = RGBtoHEX(~this.layer.clut.colorsI[l.raw[di]]);
              break;
            case "fill":
              canvasVectorCtx.fillStyle = RGBtoHEX(this.layer.clut.colorsI[l.raw[di]]);
              break;
            default:
              canvasVectorCtx.fillStyle = this.layer.style.vectorColor;
              break;
          }
          canvasVectorCtx.save();
          canvasVectorCtx.translate(x, y);
          canvasVectorCtx.rotate(ang + addDegrees);
          canvasVectorCtx.fillText(vecChar, 0, 0);
          canvasVectorCtx.restore();
        }
      }
    }
    _drawDegree() {
      if (this.layer.state.units !== "degree")
        return;
      const { canvasVectorCtx } = this;
      const addDegrees = this.layer.style.addDegrees ? 0.017453292519943 * this.layer.style.addDegrees : 0;
      canvasVectorCtx.font = "50px arrows";
      canvasVectorCtx.textAlign = "center";
      canvasVectorCtx.textBaseline = "middle";
      const l = this.data[0];
      const vecChar = "L";
      const gridStep = 32;
      for (let y = gridStep / 2; y < 256; y += gridStep) {
        for (let x = gridStep / 2; x < 256; x += gridStep) {
          const di = x + 1 + (y + 1) * 258;
          if (!l.raw[di])
            continue;
          const angDeg = l.dmin + l.raw[di] * l.dmul + 180;
          const ang = angDeg * 0.01745329251;
          switch (this.layer.style.vectorColor) {
            case "inverted":
              canvasVectorCtx.fillStyle = RGBtoHEX(~this.layer.clut.colorsI[l.raw[di]]);
              break;
            case "fill":
              canvasVectorCtx.fillStyle = RGBtoHEX(this.layer.clut.colorsI[l.raw[di]]);
              break;
            default:
              canvasVectorCtx.fillStyle = this.layer.style.vectorColor;
              break;
          }
          canvasVectorCtx.save();
          canvasVectorCtx.translate(x, y);
          canvasVectorCtx.rotate(ang + addDegrees);
          canvasVectorCtx.fillText(vecChar, 0, 0);
          canvasVectorCtx.restore();
        }
      }
    }
    _createSLines() {
      if (this.data.length !== 3)
        throw "this.data.length !== 3";
      if (!this.layer.style.streamLineColor || this.layer.style.streamLineColor === "none")
        return;
      const factor = this.layer.style.streamLineSpeedFactor || 1;
      this.sLines = [];
      const [l, u, v] = this.data;
      const zdif = Math.max(this.coords.z - this.layer.state.meta.maxZoom, 0);
      const gridStep = Math.min(2 ** (zdif + 5), 128);
      const steps = ~~(120 + zdif * 60);
      for (let y = 0; y <= 256; y += gridStep) {
        for (let x = 0; x <= 256; x += gridStep) {
          if (!l.raw[1 + x + (1 + y) * 258])
            continue;
          const sLine = [];
          let xf = x;
          let yf = y;
          for (let i = 0; i <= steps && xf >= 0 && xf <= 256 && yf >= 0 && yf <= 256; i++) {
            !(i % (steps / 6)) && sLine.push({ x: ~~xf, y: ~~yf });
            const di = ~~xf + 1 + (~~yf + 1) * 258;
            if (!l.raw[di])
              break;
            xf += factor * (u.dmin + u.raw[di] * u.dmul) / l.dmax;
            yf -= factor * (v.dmin + v.raw[di] * v.dmul) / l.dmax;
          }
          xf = x;
          yf = y;
          for (let i = 1; i <= steps && xf >= 0 && xf <= 256 && yf >= 0 && yf <= 256; i++) {
            !(i % (steps / 6)) && sLine.unshift({ x: ~~xf, y: ~~yf });
            const di = ~~xf + 1 + (~~yf + 1) * 258;
            if (!l.raw[di])
              break;
            xf -= factor * (u.dmin + u.raw[di] * u.dmul) / l.dmax;
            yf += factor * (v.dmin + v.raw[di] * v.dmul) / l.dmax;
          }
          sLine.length > 2 && this.sLines.push(sLine);
        }
      }
    }
  };

  // src/tilesLayer.ts
  var incompleteSetup = "setup not complete";
  var loadMask = loadImageDataCachedAbortable(new AbortController());
  var WxTilesLayer = class extends import_leaflet.default.GridLayer {
    constructor({ dataSource, options, lazy }) {
      super(options);
      this.styles = WxGetColorStyles();
      this.style = Object.assign({}, this.styles["base"]);
      this.loadData = loadDataPictureCachedAbortable();
      this.loadMask = loadMask;
      this.error = incompleteSetup;
      this.vector = false;
      this.clut = new RawCLUT(this.style, "", [0, 2], false);
      this.animation = false;
      this.lastBaseURL = "";
      this.animationRedrawID = 0;
      this.animFrame = 0;
      this.oldMaxZoom = 0;
      WXLOG("Creating a WxTilex layer:", dataSource.name, ". Params:", JSON.stringify({ dataSource, options }));
      if (!dataSource || !dataSource.ext || !dataSource.dataset || !dataSource.name || !dataSource.serverURI || !dataSource.styleName || !Array.isArray(dataSource.variables)) {
        WXLOG("dataSource is wrong!");
        throw "dataSource is wrong!";
      }
      this.dataSource = dataSource;
      this.state = {
        maskServerURI: dataSource.maskServerURI || dataSource.serverURI.replace(/\/data\/?/i, "/mask/{z}/{x}/{y}"),
        units: "undefined",
        baseURL: "undefined",
        meta: { maxZoom: 0, times: ["undefined"], variables: ["undefined"], variablesMeta: {} },
        instance: "undefined",
        minmax: [[0, 1]],
        originURI: "undefined",
        time: "undefined"
      };
      this.setupCompletePromise = new Promise((resolve) => {
        const lazySetup = () => {
          WXLOG("Setup:", dataSource.name);
          this.on("remove", this._onRemoveLayer, this);
          this.on("add", this._onAddLayer, this);
          this._setUpDataSet(dataSource).then((res) => {
            WXLOG("Setup complete:", this.dataSource.name, ". Result:", res);
            if (this._map && lazy) {
              this._onAddLayer();
            }
            this.fire("setupcomplete", { layer: this });
            resolve(res);
          });
        };
        if (lazy) {
          this.once("add", lazySetup);
        } else {
          lazySetup();
        }
      });
    }
    createTile(coords, done) {
      if (this.error && this.error !== incompleteSetup) {
        setTimeout(done);
        return Object.assign(createEl("div", "error-tile"), { innerHTML: this.error });
      }
      if (this.state.baseURL === "undefined") {
        setTimeout(done);
        return createEl("div", "error-tile");
      }
      return TileCreate({ layer: this, coords, done });
    }
    getSetupCompletePromise() {
      return this.setupCompletePromise;
    }
    getTile(latlng) {
      if (!this._map || this.error)
        return;
      const zoom = this._map.getZoom();
      const { x, y } = this._map.project(latlng, zoom);
      const coords = { x: ~~(x / 256), y: ~~(y / 256) };
      const wxtile = this._getCachedTile(coords.x, coords.y, zoom);
      if (!wxtile)
        return;
      const tilePoint = { x: ~~(x - coords.x * 256), y: ~~(y - coords.y * 256) };
      const tileData = wxtile.getData(tilePoint);
      if (!tileData)
        return;
      const { raw, data } = tileData;
      const rgba = this.clut.colorsI[raw];
      const hexColor = RGBtoHEX(rgba);
      const inStyleUnits = this.clut.DataToStyle(data);
      return { tile: wxtile, data, raw, rgba, hexColor, inStyleUnits, tilePoint, units: this.style.units };
    }
    setStyle(name) {
      WXLOG("setStyle(", name, ") for ", this.dataSource.name);
      if (this.error) {
        WXLOG("setStyle: failed: " + this.error);
        return;
      }
      if (this.dataSource.styleName === name && name !== "custom")
        return;
      if (name)
        this.dataSource.styleName = name;
      if (name === "custom" && this.styles.custom) {
        if (!this.styles.custom.parent || !(this.styles.custom.parent in this.styles)) {
          this.styles.custom.parent = "base";
        }
        const parentStyle = this.styles[this.styles.custom.parent];
        this.styles.custom = Object.assign(Object.assign({}, parentStyle), this.styles.custom);
      }
      if (this.dataSource.styleName in this.styles) {
        if (Array.isArray(this.styles[this.dataSource.styleName])) {
          this.dataSource.styleName += "[0]";
        }
      } else {
        WXLOG(`cant find the style (${this.dataSource.styleName})`);
        this.dataSource.styleName += "[0]";
        if (!(this.dataSource.styleName in this.styles)) {
          WXLOG(`cant find the style (${this.dataSource.styleName}), default is used`);
          this.dataSource.styleName = "base";
        }
      }
      try {
        const ustyle = this.styles[this.dataSource.styleName];
        this.style = Object.assign({}, ustyle);
        const c = this.style.streamLineColor;
        if (c !== "none" && c.length < 7) {
          this.style.streamLineColor = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
        }
        const minmax = this.state.minmax[0];
        this.clut = new RawCLUT(this.style, this.state.units, minmax, this.vector);
      } catch (c) {
        const error = "setStyle: impossible error in RawCLUT: " + c;
        WXLOG(error);
        throw error;
      }
      if (name) {
        this._checkAndStartSlinesAnimation();
        this._reloadTiles();
      }
      WXLOG("setStyle(", name, '): "' + this.dataSource.styleName + '" for ' + this.dataSource.name + " complete.");
      this.fire("setstyle", { layer: this });
    }
    getStyle() {
      return this.dataSource.styleName;
    }
    getStyleName() {
      return this.style.name;
    }
    setTime(time) {
      WXLOG("setTime: " + time + " for " + this.dataSource.name + " start");
      if (this.error) {
        WXLOG("setTime: failed: " + this.error);
        return Promise.resolve([]);
      }
      const layerTime = getClosestTimeString(this.state.meta.times, time);
      if (this.state.time === layerTime) {
        WXLOG("setTime: the same time - skipped");
        return Promise.resolve([]);
      }
      this.state.time = layerTime;
      this.state.baseURL = this.state.originURI + this.state.instance + `{var}/${this.state.time}/{z}/{x}/{y}.${this.dataSource.ext}`;
      this.fire("settime", { layer: this, layerTime });
      WXLOG("setTime: " + layerTime + " for " + this.dataSource.name + " complete");
      if (!this._tiles)
        return Promise.resolve([]);
      const reloadPromice = this._reloadTiles(false);
      reloadPromice.then(() => {
        const _tiles = Object.values(this._tiles);
        for (const _tile of _tiles) {
          const wxtile = (_tile == null ? void 0 : _tile.el).wxtile;
          if (wxtile == null ? void 0 : wxtile.data.length) {
            const [cmin, cmax] = this.state.minmax[0];
            const { dmin, dmax } = wxtile.data[0];
            if (Math.abs(dmin - cmin) > 0.01 || Math.abs(dmax - cmax) > 0.01) {
              this.state.minmax = wxtile.data.map((d) => [d.dmin, d.dmax]);
              this.setStyle(void 0);
            }
            break;
          }
        }
        this._redrawTiles();
      });
      return reloadPromice;
    }
    getTime() {
      if (this.error) {
        WXLOG("getTime: failed: " + this.error);
        return this.error;
      }
      return this.state.time;
    }
    getTimes() {
      WXLOG("getTimes");
      if (this.error) {
        WXLOG("getTimes: failed: " + this.error);
        return [];
      }
      return this.state.meta.times;
    }
    async checkDataChanged() {
      WXLOG("checkDataChanged");
      if (this.error) {
        WXLOG("checkDataChanged: failed: " + this.error);
        return false;
      }
      const instances = await fetchJson(this.state.originURI + "instances.json");
      const instance = instances[instances.length - 1] + "/";
      if (this.state.instance !== instance)
        return true;
      const meta = await fetchJson(this.state.originURI + instance + "meta.json");
      return this.state.meta.times.toString() !== meta.times.toString();
    }
    reloadData() {
      WXLOG("reloadData");
      return this._setUpDataSet(void 0);
    }
    getLegendData(legendSize) {
      WXLOG("getLegendData");
      if (this.error || !this.clut) {
        WXLOG("getLegendData: failed. " + this.dataSource.name + " : " + this.error);
      }
      return createLegend(legendSize, this.style);
    }
    setTimeAnimationMode(l = 2) {
      WXLOG("setTimeAnimationMode");
      this.oldMaxZoom = this.state.meta.maxZoom;
      const mz = this._map.getZoom();
      const minMaxZoom = mz < this.oldMaxZoom ? mz : this.oldMaxZoom;
      const newMaxZoom = minMaxZoom - l;
      this.state.meta.maxZoom = newMaxZoom < 0 ? 0 : newMaxZoom;
    }
    unsetTimeAnimationMode() {
      WXLOG("unsetTimeAnimationMode");
      if (this.oldMaxZoom) {
        this.state.meta.maxZoom = this.oldMaxZoom;
        this.lastBaseURL = "";
      }
      return this._reloadTiles();
    }
    getMinMax() {
      const [min, max] = this.state.minmax[0];
      return { min, max };
    }
    setAnimation(a) {
      WXLOG("setAnimation");
      this.animation = a;
      this._checkAndStartSlinesAnimation();
      return this.animation;
    }
    _getCachedTile(x, y, zoom) {
      var _a, _b;
      return (_b = (_a = this._tiles[`${x}:${y}:${zoom}`]) == null ? void 0 : _a.el) == null ? void 0 : _b.wxtile;
    }
    _ForEachTile(func) {
      var _a;
      const res = [];
      for (const _tile in this._tiles) {
        const wxtile = (_a = this._tiles[_tile].el) == null ? void 0 : _a.wxtile;
        const fres = wxtile && func(wxtile);
        fres && res.push(fres);
      }
      return res;
    }
    async _setUpDataSet(dataSource) {
      if (dataSource)
        this.dataSource = dataSource;
      this._stopLoadingResetLoadDataFunc();
      this.state.originURI = this.dataSource.serverURI + "/" + this.dataSource.dataset + "/";
      try {
        const instances = await fetchJson(this.state.originURI + "instances.json");
        this.state.instance = instances[instances.length - 1] + "/";
      } catch (e) {
        this.error = this.dataSource.name + ": load instances.json error: " + e;
        WXLOG(this.error);
        return false;
      }
      try {
        const URI = this.state.originURI + this.state.instance + "meta.json";
        this.state.meta = await fetchJson(URI);
      } catch (e) {
        this.error = this.dataSource.name + ": load meta.json error: " + e;
        WXLOG(this.error);
        return false;
      }
      this.vector = this.dataSource.variables.length === 2;
      this.animation = this.vector;
      this.state.units = this.state.meta.variablesMeta[this.dataSource.variables[0]].units;
      this.state.minmax = this.dataSource.variables.map((v) => [this.state.meta.variablesMeta[v].min, this.state.meta.variablesMeta[v].max]);
      if (this.vector) {
        const [[udmin, udmax], [vdmin, vdmax]] = this.state.minmax;
        this.state.minmax.unshift([0, 1.42 * Math.max(-udmin, udmax, -vdmin, vdmax)]);
      }
      this.error = null;
      if (dataSource) {
        this.setStyle(void 0);
        await this.setTime(new Date());
      }
      return true;
    }
    _checkZoom() {
      var _a;
      if (!(((_a = this._map) == null ? void 0 : _a.getZoom()) > this.state.meta.maxZoom)) {
        this._stopLoadingResetLoadDataFunc();
      }
    }
    _onAddLayer() {
      var _a;
      WXLOG("onadd:", this.dataSource.name);
      (_a = this._map) == null ? void 0 : _a.on("zoomstart", this._checkZoom, this);
      this.setupCompletePromise.then(() => {
        this.redraw();
        this._checkAndStartSlinesAnimation();
      });
    }
    _onRemoveLayer() {
      var _a;
      WXLOG("onremove:", this.dataSource.name);
      (_a = this._map) == null ? void 0 : _a.off("zoomstart", this._checkZoom, this);
      this.setupCompletePromise.then(() => {
        this._stopLoadingResetLoadDataFunc();
        this._stopSlinesAnimation();
      });
    }
    _stopLoadingResetLoadDataFunc() {
      this.loadData.controllerHolder.controller.abort();
      this.loadData = loadDataPictureCachedAbortable();
    }
    _checkAndStartSlinesAnimation() {
      if (this.animFrame || !this.animation || !this.vector || !this.style.streamLineColor || this.style.streamLineColor === "none")
        return;
      const drawSLines = (timeStemp) => {
        if (!this.animation || this.style.streamLineStatic) {
          this._stopSlinesAnimation();
          return;
        }
        this._ForEachTile((wxtile) => wxtile.drawSLines(timeStemp));
        this.animFrame = requestAnimationFrame(drawSLines);
      };
      drawSLines(0);
    }
    _stopSlinesAnimation() {
      cancelAnimationFrame(this.animFrame);
      this._ForEachTile((wxtile) => wxtile.clearSLinesCanvas());
      this.animFrame = 0;
    }
    _redrawTiles() {
      if (this.animationRedrawID !== 0)
        return;
      this.animationRedrawID = requestAnimationFrame(() => {
        WXLOG("_redrawTiles: requestAnimationFrame: " + this.dataSource.name);
        this._ForEachTile((wxtile) => wxtile.draw());
        this.animationRedrawID = 0;
      });
    }
    _reloadTiles(redraw = true) {
      WXLOG("_reloadTiles: start - " + this.dataSource.name);
      if (this.lastBaseURL === this.state.baseURL) {
        WXLOG("_reloadTiles: same URL. Nothing to reload");
        return Promise.resolve([]);
      }
      this.loadData.controllerHolder.controller.abort();
      this.loadData.controllerHolder.controller = new AbortController();
      this.lastBaseURL = this.state.baseURL;
      const promises = this._ForEachTile((wxtile) => wxtile.load());
      const reloadedPromice = Promise.all(promises);
      const { controller } = this.loadData.controllerHolder;
      redraw && reloadedPromice.then(() => controller.signal.aborted || this._redrawTiles());
      WXLOG("_reloadTiles: finished - " + this.dataSource.name);
      return reloadedPromice;
    }
  };

  // src/wxtiles.ts
  function CreateWxTilesLayer(settings) {
    return new WxTilesLayer(settings);
  }
  var WxWatermark = class extends import_leaflet2.default.Control {
    constructor(options) {
      super(options);
      this.URI = options.URI;
    }
    onAdd() {
      const w = document.createElement("img");
      w.src = this.URI;
      w.className = "wxtiles-logo";
      return w;
    }
  };
  function CreateWxTilesWatermark(options) {
    WXLOG("Add watermark:", JSON.stringify(options));
    return new WxWatermark(options);
  }
  var WxDebugLayer = class extends import_leaflet2.default.GridLayer {
    createTile(coords) {
      const tile = document.createElement("div");
      tile.innerHTML = [coords.x, coords.y, coords.z].join(", ");
      tile.style.outline = "1px solid red";
      return tile;
    }
  };
  function CreateWxDebugCoordsLayer() {
    WXLOG("Add WxDebugCoordsLayer:");
    return new WxDebugLayer().setZIndex(1e3);
  }

  // src_example/index.ts
  var map;
  var layerControl;
  var config;
  var styles;
  var globalLayer;
  async function fetchJson2(url) {
    return (await fetch(url)).json();
  }
  async function fillDataSets() {
    let datasetsNames;
    try {
      datasetsNames = await fetchJson2(config.dataServer + "/datasets.json");
    } catch (e) {
      console.log(e);
      return;
    }
    datasetsNames.sort();
    for (const datasetName of datasetsNames) {
      const opt = document.createElement("option");
      opt.appendChild(document.createTextNode(datasetName));
      opt.value = datasetName;
      selectDataSetEl.appendChild(opt);
    }
    await fillVariables_selectDataSetEl_onchange();
  }
  async function fillVariables_selectDataSetEl_onchange() {
    const oldVariable = selectVariableEl.value;
    selectVariableEl.innerHTML = "";
    let meta;
    try {
      const instances = await fetchJson2(config.dataServer + "/" + selectDataSetEl.value + "/instances.json");
      const instance = instances[instances.length - 1];
      meta = await fetchJson2(config.dataServer + "/" + selectDataSetEl.value + "/" + instance + "/meta.json");
    } catch (e) {
      console.log(e);
      return;
    }
    meta.variables.sort();
    for (const variable of meta.variables) {
      if (variable.includes("northward")) {
        continue;
      }
      const opt = document.createElement("option");
      opt.appendChild(document.createTextNode(variable.replace("eastward", "vector")));
      opt.value = variable;
      selectVariableEl.appendChild(opt);
    }
    if (meta.variables.includes(oldVariable)) {
      selectVariableEl.value = oldVariable;
    }
    loadVariable_selectVariableEl_onchange();
  }
  async function loadVariable_selectVariableEl_onchange() {
    stopPlay();
    const variable = selectVariableEl.value;
    const variables = [variable];
    if (variable.includes("eastward")) {
      variables.push(variable.replace("eastward", "northward"));
    }
    const layerSettings = {
      dataSource: {
        serverURI: config.dataServer,
        maskServerURI: config.dataServer.replace(/\/data\/?/i, "/mask/{z}/{x}/{y}"),
        ext: config.ext,
        dataset: selectDataSetEl.value,
        variables,
        name: selectDataSetEl.value + "/" + selectVariableEl.selectedOptions[0].label,
        styleName: variable
      },
      options: {
        opacity: 1
      }
    };
    const oldLayer = globalLayer;
    globalLayer = CreateWxTilesLayer(layerSettings);
    await globalLayer.getSetupCompletePromise();
    globalLayer.addTo(map);
    layerControl.addOverlay(globalLayer, layerSettings.dataSource.name);
    if (oldLayer)
      globalLayer.once("load", () => {
        oldLayer.removeFrom(map);
        layerControl.removeLayer(oldLayer);
      });
    globalLayer.setTime(selectTimeEl.value !== "" ? selectTimeEl.value : new Date());
    fillTimes(globalLayer);
    fillStyles(globalLayer);
  }
  function fillTimes(layer) {
    selectTimeEl.innerHTML = "";
    layer.getTimes().forEach((val) => {
      const opt = document.createElement("option");
      opt.appendChild(document.createTextNode(val));
      opt.value = val;
      selectTimeEl.appendChild(opt);
    });
    selectTimeEl.value = layer.getTime();
  }
  function startPlay() {
    if (!globalLayer)
      return;
    buttonPlayStopEl.textContent = "stop";
    globalLayer.setTimeAnimationMode(+inputCoarseLevelEl.value);
    setTimeout(async function nextTimeStep() {
      if (!globalLayer)
        return;
      if (buttonPlayStopEl.textContent === "stop") {
        const start2 = Date.now();
        await globalLayer.setTime(selectTimeEl.value);
        selectTimeEl.selectedIndex++;
        selectTimeEl.selectedIndex %= selectTimeEl.length;
        const dt = +inputAnimDelayEl.value - (Date.now() - start2);
        setTimeout(nextTimeStep, dt < 0 ? 0 : dt);
        oldE && updateInfoPanel(oldE);
      }
    });
  }
  function stopPlay() {
    buttonPlayStopEl.textContent = "play";
    globalLayer == null ? void 0 : globalLayer.unsetTimeAnimationMode();
  }
  function addOption(baseStyle, value = baseStyle) {
    const opt = document.createElement("option");
    opt.appendChild(document.createTextNode(baseStyle));
    opt.value = value;
    selectStyleEl.appendChild(opt);
  }
  function fillStyles(layer) {
    selectStyleEl.innerHTML = "";
    if (config.varToStyleMap) {
      for (const [regexp, styleName] of config.varToStyleMap) {
        const regExp = new RegExp(regexp, "i");
        if (styleName in styles && regExp.test(layer.dataSource.variables[0])) {
          addOption(styles[styleName].name, styleName);
        }
      }
    }
    addOption("base");
    addOption("custom");
    onStyleChange_selectStyleEl_onchange();
  }
  function JSONsort(o) {
    if (Array.isArray(o)) {
      return o.map(JSONsort);
    } else if (typeof o === "object" && o !== null) {
      const keys = Object.keys(o).sort((a, b) => {
        const aa = a.toUpperCase();
        const bb = b.toUpperCase();
        return aa == bb ? 0 : aa > bb ? 1 : -1;
      });
      return keys.reduce((a, k) => {
        a[k] = JSONsort(o[k]);
        return a;
      }, {});
    }
    return o;
  }
  function onStyleChange_selectStyleEl_onchange() {
    if (!globalLayer)
      return;
    if (selectStyleEl.value === "custom") {
      try {
        styles.custom = JSON.parse(customStyleEl.value);
      } catch {
        console.log("Wrong custom style");
        const ctx = legendCanvasEl.getContext("2d");
        if (!ctx)
          return;
        ctx.clearRect(0, 0, legendCanvasEl.width, legendCanvasEl.height);
        ctx.beginPath();
        ctx.font = legendCanvasEl.height / 2 + "px sans-serif";
        ctx.fillText("Wrong custom style", 10, legendCanvasEl.height / 2);
        ctx.stroke();
        return;
      }
    }
    globalLayer.setStyle(selectStyleEl.value);
    const curStyleName = globalLayer.getStyle();
    const curStyle = styles[curStyleName];
    customStyleEl.value = JSON.stringify(JSONsort(curStyle), null, "    ");
    const legend = globalLayer.getLegendData(legendCanvasEl.width - 50);
    if (!legend)
      return;
    drawLegend({ legend, canvas: legendCanvasEl });
  }
  function drawLegend({ legend, canvas }) {
    if (!globalLayer || !canvas || !legend)
      return;
    const { width, height } = canvas;
    const halfHeight = 16 + height >> 2;
    const ctx = canvas.getContext("2d");
    const imData = ctx.createImageData(width, height);
    const im = new Uint32Array(imData.data.buffer);
    im.fill(-1);
    const startX = 2;
    const startY = 2;
    const startXY = startX + width * startY;
    const trSize = halfHeight >> 1;
    if (legend.showBelowMin) {
      const c = legend.colors[0];
      if (c) {
        for (let x = 0; x < trSize; ++x) {
          for (let y = trSize; y < trSize + x; ++y) {
            im[startXY + x + y * width] = c;
            im[startXY + x + (trSize * 2 - y) * width] = c;
          }
        }
      }
    }
    for (let x = 0; x < legend.size; ++x) {
      for (let y = 0; y < halfHeight; ++y) {
        if (legend.colors[0]) {
          im[startX + x + trSize + (y + startY + 1) * width] = legend.colors[x];
        }
      }
    }
    if (legend.showAboveMax) {
      const c = legend.colors[legend.colors.length - 1];
      if (c) {
        for (let x = 0; x <= trSize; ++x) {
          for (let y = trSize; y < trSize + x; ++y) {
            im[startXY + trSize * 2 + legend.size - x + y * width] = c;
            im[startXY + trSize * 2 + legend.size - x + (trSize * 2 - y) * width] = c;
          }
        }
      }
    }
    ctx.putImageData(imData, 0, 0);
    ctx.font = "8px sans-serif";
    ctx.beginPath();
    for (const tick of legend.ticks) {
      ctx.strokeStyle = "#000";
      ctx.moveTo(tick.pos + trSize + startX + 1, startY + 3);
      ctx.lineTo(tick.pos + trSize + startX + 1, halfHeight);
      ctx.fillText(tick.dataString, tick.pos + trSize + startX + 1, halfHeight + 11);
    }
    ctx.font = "12px sans-serif";
    const txt = globalLayer.getStyleName() + " (" + legend.units + ")";
    ctx.fillText(txt, 13, height - 5);
    ctx.stroke();
    ctx.strokeStyle = "#888";
    ctx.strokeRect(1, 1, width - 3, height - 2);
  }
  var oldE;
  function updateInfoPanel(e) {
    oldE = e;
    let content = `${e.latlng}<br>`;
    map.eachLayer((layer) => {
      if (layer instanceof WxTilesLayer) {
        const tile = layer.getTile(e.latlng);
        const { min, max } = layer.getMinMax();
        content += tile ? `<div>
				<div style="width:1em;height:1em;float:left;margin-right:2px;background:${tile.hexColor}"></div>
				${layer.dataSource.name}=${tile.inStyleUnits.toFixed(2)} ${tile.units} (${min.toFixed(2)}, ${max.toFixed(2)})
				</div>` : "";
      }
    });
    infoPanelEl.innerHTML = content;
  }
  function popupInfo(e) {
    let content = "";
    map.eachLayer((layer) => {
      if (layer instanceof WxTilesLayer) {
        const tile = layer.getTile(e.latlng);
        const time = layer.getTime();
        content += tile ? `<div>
					<div style="width:1em;height:1em;float:left;margin-right:2px;background:${tile.hexColor}"></div>
					${layer.dataSource.name}<br>
					(in style Units = ${tile.inStyleUnits} ${tile.units})<br>
					(in data Units = ${tile.data} ${layer.state.units})<br>
					(time:${time})<br>
					(instance:${layer.state.instance})<br>
					(tilePoint:${tile.tilePoint.x},${tile.tilePoint.y})<br>
				</div>` : "";
      }
    });
    import_leaflet4.default.popup().setLatLng(e.latlng).setContent(content + `${e.latlng}`).openOn(map);
  }
  function createControl(opt) {
    return new (import_leaflet4.default.Control.extend({
      onAdd() {
        return document.getElementById(opt.htmlID);
      }
    }))(opt);
  }
  async function start() {
    var _a;
    try {
      config = await fetchJson2("props/config.json");
    } catch (e) {
      console.log(e);
      alert("No props/config.json");
      return;
    }
    map = import_leaflet4.default.map("map", config.map);
    WxTilesLogging(true);
    CreateWxTilesWatermark({ URI: "res/wxtiles-logo.png", position: "topright" }).addTo(map);
    layerControl = import_leaflet4.default.control.layers(void 0, void 0, { position: "topright", autoZIndex: false, collapsed: false }).addTo(map);
    (_a = config.baseLayers) == null ? void 0 : _a.map((baseLayer) => {
      var _a2;
      if (!baseLayer.add)
        return;
      const layer = import_leaflet4.default.tileLayer(baseLayer.URL, baseLayer.options);
      ((_a2 = baseLayer.options) == null ? void 0 : _a2.zIndex) === 0 ? layerControl.addBaseLayer(layer, baseLayer.name) : layerControl.addOverlay(layer, baseLayer.name);
    });
    layerControl.addOverlay(CreateWxDebugCoordsLayer(), "tile boundaries");
    layerControl.addBaseLayer(import_leaflet4.default.tileLayer("").addTo(map), "base-empty");
    createControl({ position: "topleft", htmlID: "legend" }).addTo(map);
    createControl({ position: "topleft", htmlID: "layerPanel" }).addTo(map);
    createControl({ position: "topleft", htmlID: "styleEditor" }).addTo(map);
    createControl({ position: "bottomleft", htmlID: "infoPanel" }).addTo(map);
    const wxlibCustomSettings = {};
    try {
      wxlibCustomSettings.colorStyles = await fetchJson2("props/styles.json");
    } catch (e) {
      console.log(e);
    }
    try {
      wxlibCustomSettings.units = await fetchJson2("props/uconv.json");
    } catch (e) {
      console.log(e);
    }
    try {
      wxlibCustomSettings.colorSchemes = await fetchJson2("props/colorschemes.json");
    } catch (e) {
      console.log(e);
    }
    WxTilesLibSetup(wxlibCustomSettings);
    await document.fonts.ready;
    await LoadQTree(config.dataServer + "seamask.qtree");
    styles = WxGetColorStyles();
    fillDataSets();
    map.on("zoom", stopPlay);
    map.on("mousemove", updateInfoPanel);
    map.on("click", popupInfo);
  }
  var selectDataSetEl = document.getElementById("selectDataSet");
  selectDataSetEl.addEventListener("change", () => {
    fillVariables_selectDataSetEl_onchange();
  });
  var selectVariableEl = document.getElementById("selectVariable");
  selectVariableEl.addEventListener("change", loadVariable_selectVariableEl_onchange);
  var selectStyleEl = document.getElementById("selectStyle");
  selectStyleEl.addEventListener("change", onStyleChange_selectStyleEl_onchange);
  var legendCanvasEl = document.getElementById("legend");
  var customStyleEl = document.getElementById("customStyle");
  customStyleEl.addEventListener("change", () => {
    selectStyleEl.value = "custom";
    onStyleChange_selectStyleEl_onchange();
  });
  var customStyleButtonEl = document.getElementById("customStyleButton");
  customStyleButtonEl.addEventListener("click", () => {
    if (customStyleEl.style.display != "none") {
      customStyleEl.style.display = "none";
      customStyleButtonEl.innerHTML = "show Custom Style Editor";
    } else {
      customStyleEl.style.display = "block";
      customStyleButtonEl.innerHTML = "update Custom Style & Hide";
      selectStyleEl.value = "custom";
    }
  });
  var selectTimeEl = document.getElementById("selectTime");
  selectTimeEl.addEventListener("change", () => {
    if (!globalLayer)
      return;
    if (buttonPlayStopEl.textContent === "stop")
      stopPlay();
    globalLayer.setTime(selectTimeEl.value);
    selectTimeEl.value = globalLayer.getTime();
  });
  var buttonHoldEl = document.getElementById("buttonHold");
  buttonHoldEl.addEventListener("click", () => {
    import_leaflet4.default.popup().setLatLng(map.getCenter()).setContent(`
			This layer was "held". 
			You can hold as many layers as you want, but you can't control them after holding.
			New layers will appear OVER the held layers.
			Use the "clear" button to clear the ALL VISIBLE layers.
			`).openOn(map);
    stopPlay();
    globalLayer = void 0;
  });
  var infoPanelEl = document.getElementById("infoPanel");
  var inputAnimDelayEl = document.getElementById("animDelay");
  var inputCoarseLevelEl = document.getElementById("coarseLevel");
  var buttonPlayStopEl = document.getElementById("buttonPlayStop");
  buttonPlayStopEl.addEventListener("click", () => {
    buttonPlayStopEl.textContent === "play" ? startPlay() : stopPlay();
  });
  var clearEl = document.getElementById("buttonClear");
  clearEl.addEventListener("click", () => {
    map.eachLayer((l) => {
      if ("getTile" in l) {
        l.removeFrom(map);
        layerControl.removeLayer(l);
      }
    });
    loadVariable_selectVariableEl_onchange();
  });
  start();
})();
/* @preserve
 * Leaflet 1.7.1, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2019 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
//# sourceMappingURL=script.js.map
