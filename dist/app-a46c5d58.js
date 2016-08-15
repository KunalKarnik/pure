/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _director = __webpack_require__(5);

	var _app = __webpack_require__(6);

	var _app2 = _interopRequireDefault(_app);

	var _routes = __webpack_require__(26);

	var _routes2 = _interopRequireDefault(_routes);

	var _regularjs = __webpack_require__(16);

	var _regularjs2 = _interopRequireDefault(_regularjs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log('Regular', _regularjs2.default);

	new _app2.default().$inject(document.getElementById('app'));

	var router = (0, _director.Router)(_routes2.default);
	router.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	

	//
	// Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
	// Version 1.2.6
	//

	(function (exports) {

	/*
	 * browser.js: Browser specific functionality for director.
	 *
	 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
	 * MIT LICENSE
	 *
	 */

	var dloc = document.location;

	function dlocHashEmpty() {
	  // Non-IE browsers return '' when the address bar shows '#'; Director's logic
	  // assumes both mean empty.
	  return dloc.hash === '' || dloc.hash === '#';
	}

	var listener = {
	  mode: 'modern',
	  hash: dloc.hash,
	  history: false,

	  check: function () {
	    var h = dloc.hash;
	    if (h != this.hash) {
	      this.hash = h;
	      this.onHashChanged();
	    }
	  },

	  fire: function () {
	    if (this.mode === 'modern') {
	      this.history === true ? window.onpopstate() : window.onhashchange();
	    }
	    else {
	      this.onHashChanged();
	    }
	  },

	  init: function (fn, history) {
	    var self = this;
	    this.history = history;

	    if (!Router.listeners) {
	      Router.listeners = [];
	    }

	    function onchange(onChangeEvent) {
	      for (var i = 0, l = Router.listeners.length; i < l; i++) {
	        Router.listeners[i](onChangeEvent);
	      }
	    }

	    //note IE8 is being counted as 'modern' because it has the hashchange event
	    if ('onhashchange' in window && (document.documentMode === undefined
	      || document.documentMode > 7)) {
	      // At least for now HTML5 history is available for 'modern' browsers only
	      if (this.history === true) {
	        // There is an old bug in Chrome that causes onpopstate to fire even
	        // upon initial page load. Since the handler is run manually in init(),
	        // this would cause Chrome to run it twise. Currently the only
	        // workaround seems to be to set the handler after the initial page load
	        // http://code.google.com/p/chromium/issues/detail?id=63040
	        setTimeout(function() {
	          window.onpopstate = onchange;
	        }, 500);
	      }
	      else {
	        window.onhashchange = onchange;
	      }
	      this.mode = 'modern';
	    }
	    else {
	      //
	      // IE support, based on a concept by Erik Arvidson ...
	      //
	      var frame = document.createElement('iframe');
	      frame.id = 'state-frame';
	      frame.style.display = 'none';
	      document.body.appendChild(frame);
	      this.writeFrame('');

	      if ('onpropertychange' in document && 'attachEvent' in document) {
	        document.attachEvent('onpropertychange', function () {
	          if (event.propertyName === 'location') {
	            self.check();
	          }
	        });
	      }

	      window.setInterval(function () { self.check(); }, 50);

	      this.onHashChanged = onchange;
	      this.mode = 'legacy';
	    }

	    Router.listeners.push(fn);

	    return this.mode;
	  },

	  destroy: function (fn) {
	    if (!Router || !Router.listeners) {
	      return;
	    }

	    var listeners = Router.listeners;

	    for (var i = listeners.length - 1; i >= 0; i--) {
	      if (listeners[i] === fn) {
	        listeners.splice(i, 1);
	      }
	    }
	  },

	  setHash: function (s) {
	    // Mozilla always adds an entry to the history
	    if (this.mode === 'legacy') {
	      this.writeFrame(s);
	    }

	    if (this.history === true) {
	      window.history.pushState({}, document.title, s);
	      // Fire an onpopstate event manually since pushing does not obviously
	      // trigger the pop event.
	      this.fire();
	    } else {
	      dloc.hash = (s[0] === '/') ? s : '/' + s;
	    }
	    return this;
	  },

	  writeFrame: function (s) {
	    // IE support...
	    var f = document.getElementById('state-frame');
	    var d = f.contentDocument || f.contentWindow.document;
	    d.open();
	    d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
	    d.close();
	  },

	  syncHash: function () {
	    // IE support...
	    var s = this._hash;
	    if (s != dloc.hash) {
	      dloc.hash = s;
	    }
	    return this;
	  },

	  onHashChanged: function () {}
	};

	var Router = exports.Router = function (routes) {
	  if (!(this instanceof Router)) return new Router(routes);

	  this.params   = {};
	  this.routes   = {};
	  this.methods  = ['on', 'once', 'after', 'before'];
	  this.scope    = [];
	  this._methods = {};

	  this._insert = this.insert;
	  this.insert = this.insertEx;

	  this.historySupport = (window.history != null ? window.history.pushState : null) != null

	  this.configure();
	  this.mount(routes || {});
	};

	Router.prototype.init = function (r) {
	  var self = this
	    , routeTo;
	  this.handler = function(onChangeEvent) {
	    var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
	    var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
	    self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
	  };

	  listener.init(this.handler, this.history);

	  if (this.history === false) {
	    if (dlocHashEmpty() && r) {
	      dloc.hash = r;
	    } else if (!dlocHashEmpty()) {
	      self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
	    }
	  }
	  else {
	    if (this.convert_hash_in_init) {
	      // Use hash as route
	      routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
	      if (routeTo) {
	        window.history.replaceState({}, document.title, routeTo);
	      }
	    }
	    else {
	      // Use canonical url
	      routeTo = this.getPath();
	    }

	    // Router has been initialized, but due to the chrome bug it will not
	    // yet actually route HTML5 history state changes. Thus, decide if should route.
	    if (routeTo || this.run_in_init === true) {
	      this.handler();
	    }
	  }

	  return this;
	};

	Router.prototype.explode = function () {
	  var v = this.history === true ? this.getPath() : dloc.hash;
	  if (v.charAt(1) === '/') { v=v.slice(1) }
	  return v.slice(1, v.length).split("/");
	};

	Router.prototype.setRoute = function (i, v, val) {
	  var url = this.explode();

	  if (typeof i === 'number' && typeof v === 'string') {
	    url[i] = v;
	  }
	  else if (typeof val === 'string') {
	    url.splice(i, v, s);
	  }
	  else {
	    url = [i];
	  }

	  listener.setHash(url.join('/'));
	  return url;
	};

	//
	// ### function insertEx(method, path, route, parent)
	// #### @method {string} Method to insert the specific `route`.
	// #### @path {Array} Parsed path to insert the `route` at.
	// #### @route {Array|function} Route handlers to insert.
	// #### @parent {Object} **Optional** Parent "routes" to insert into.
	// insert a callback that will only occur once per the matched route.
	//
	Router.prototype.insertEx = function(method, path, route, parent) {
	  if (method === "once") {
	    method = "on";
	    route = function(route) {
	      var once = false;
	      return function() {
	        if (once) return;
	        once = true;
	        return route.apply(this, arguments);
	      };
	    }(route);
	  }
	  return this._insert(method, path, route, parent);
	};

	Router.prototype.getRoute = function (v) {
	  var ret = v;

	  if (typeof v === "number") {
	    ret = this.explode()[v];
	  }
	  else if (typeof v === "string"){
	    var h = this.explode();
	    ret = h.indexOf(v);
	  }
	  else {
	    ret = this.explode();
	  }

	  return ret;
	};

	Router.prototype.destroy = function () {
	  listener.destroy(this.handler);
	  return this;
	};

	Router.prototype.getPath = function () {
	  var path = window.location.pathname;
	  if (path.substr(0, 1) !== '/') {
	    path = '/' + path;
	  }
	  return path;
	};
	function _every(arr, iterator) {
	  for (var i = 0; i < arr.length; i += 1) {
	    if (iterator(arr[i], i, arr) === false) {
	      return;
	    }
	  }
	}

	function _flatten(arr) {
	  var flat = [];
	  for (var i = 0, n = arr.length; i < n; i++) {
	    flat = flat.concat(arr[i]);
	  }
	  return flat;
	}

	function _asyncEverySeries(arr, iterator, callback) {
	  if (!arr.length) {
	    return callback();
	  }
	  var completed = 0;
	  (function iterate() {
	    iterator(arr[completed], function(err) {
	      if (err || err === false) {
	        callback(err);
	        callback = function() {};
	      } else {
	        completed += 1;
	        if (completed === arr.length) {
	          callback();
	        } else {
	          iterate();
	        }
	      }
	    });
	  })();
	}

	function paramifyString(str, params, mod) {
	  mod = str;
	  for (var param in params) {
	    if (params.hasOwnProperty(param)) {
	      mod = params[param](str);
	      if (mod !== str) {
	        break;
	      }
	    }
	  }
	  return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
	}

	function regifyString(str, params) {
	  var matches, last = 0, out = "";
	  while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
	    last = matches.index + matches[0].length;
	    matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
	    out += str.substr(0, matches.index) + matches[0];
	  }
	  str = out += str.substr(last);
	  var captures = str.match(/:([^\/]+)/ig), capture, length;
	  if (captures) {
	    length = captures.length;
	    for (var i = 0; i < length; i++) {
	      capture = captures[i];
	      if (capture.slice(0, 2) === "::") {
	        str = capture.slice(1);
	      } else {
	        str = str.replace(capture, paramifyString(capture, params));
	      }
	    }
	  }
	  return str;
	}

	function terminator(routes, delimiter, start, stop) {
	  var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
	  for (i = 0; i < routes.length; i++) {
	    var chunk = routes[i];
	    if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
	      left = chunk.indexOf(start, last);
	      right = chunk.indexOf(stop, last);
	      if (~left && !~right || !~left && ~right) {
	        var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
	        routes = [ tmp ].concat(routes.slice((i || 1) + 1));
	      }
	      last = (right > left ? right : left) + 1;
	      i = 0;
	    } else {
	      last = 0;
	    }
	  }
	  return routes;
	}

	var QUERY_SEPARATOR = /\?.*/;

	Router.prototype.configure = function(options) {
	  options = options || {};
	  for (var i = 0; i < this.methods.length; i++) {
	    this._methods[this.methods[i]] = true;
	  }
	  this.recurse = options.recurse || this.recurse || false;
	  this.async = options.async || false;
	  this.delimiter = options.delimiter || "/";
	  this.strict = typeof options.strict === "undefined" ? true : options.strict;
	  this.notfound = options.notfound;
	  this.resource = options.resource;
	  this.history = options.html5history && this.historySupport || false;
	  this.run_in_init = this.history === true && options.run_handler_in_init !== false;
	  this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
	  this.every = {
	    after: options.after || null,
	    before: options.before || null,
	    on: options.on || null
	  };
	  return this;
	};

	Router.prototype.param = function(token, matcher) {
	  if (token[0] !== ":") {
	    token = ":" + token;
	  }
	  var compiled = new RegExp(token, "g");
	  this.params[token] = function(str) {
	    return str.replace(compiled, matcher.source || matcher);
	  };
	  return this;
	};

	Router.prototype.on = Router.prototype.route = function(method, path, route) {
	  var self = this;
	  if (!route && typeof path == "function") {
	    route = path;
	    path = method;
	    method = "on";
	  }
	  if (Array.isArray(path)) {
	    return path.forEach(function(p) {
	      self.on(method, p, route);
	    });
	  }
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  if (Array.isArray(method)) {
	    return method.forEach(function(m) {
	      self.on(m.toLowerCase(), path, route);
	    });
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.insert(method, this.scope.concat(path), route);
	};

	Router.prototype.path = function(path, routesFn) {
	  var self = this, length = this.scope.length;
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.scope = this.scope.concat(path);
	  routesFn.call(this, this);
	  this.scope.splice(length, path.length);
	};

	Router.prototype.dispatch = function(method, path, callback) {
	  var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
	  this._invoked = true;
	  if (!fns || fns.length === 0) {
	    this.last = [];
	    if (typeof this.notfound === "function") {
	      this.invoke([ this.notfound ], {
	        method: method,
	        path: path
	      }, callback);
	    }
	    return false;
	  }
	  if (this.recurse === "forward") {
	    fns = fns.reverse();
	  }
	  function updateAndInvoke() {
	    self.last = fns.after;
	    self.invoke(self.runlist(fns), self, callback);
	  }
	  after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
	  if (after && after.length > 0 && invoked) {
	    if (this.async) {
	      this.invoke(after, this, updateAndInvoke);
	    } else {
	      this.invoke(after, this);
	      updateAndInvoke();
	    }
	    return true;
	  }
	  updateAndInvoke();
	  return true;
	};

	Router.prototype.invoke = function(fns, thisArg, callback) {
	  var self = this;
	  var apply;
	  if (this.async) {
	    apply = function(fn, next) {
	      if (Array.isArray(fn)) {
	        return _asyncEverySeries(fn, apply, next);
	      } else if (typeof fn == "function") {
	        fn.apply(thisArg, (fns.captures || []).concat(next));
	      }
	    };
	    _asyncEverySeries(fns, apply, function() {
	      if (callback) {
	        callback.apply(thisArg, arguments);
	      }
	    });
	  } else {
	    apply = function(fn) {
	      if (Array.isArray(fn)) {
	        return _every(fn, apply);
	      } else if (typeof fn === "function") {
	        return fn.apply(thisArg, fns.captures || []);
	      } else if (typeof fn === "string" && self.resource) {
	        self.resource[fn].apply(thisArg, fns.captures || []);
	      }
	    };
	    _every(fns, apply);
	  }
	};

	Router.prototype.traverse = function(method, path, routes, regexp, filter) {
	  var fns = [], current, exact, match, next, that;
	  function filterRoutes(routes) {
	    if (!filter) {
	      return routes;
	    }
	    function deepCopy(source) {
	      var result = [];
	      for (var i = 0; i < source.length; i++) {
	        result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
	      }
	      return result;
	    }
	    function applyFilter(fns) {
	      for (var i = fns.length - 1; i >= 0; i--) {
	        if (Array.isArray(fns[i])) {
	          applyFilter(fns[i]);
	          if (fns[i].length === 0) {
	            fns.splice(i, 1);
	          }
	        } else {
	          if (!filter(fns[i])) {
	            fns.splice(i, 1);
	          }
	        }
	      }
	    }
	    var newRoutes = deepCopy(routes);
	    newRoutes.matched = routes.matched;
	    newRoutes.captures = routes.captures;
	    newRoutes.after = routes.after.filter(filter);
	    applyFilter(newRoutes);
	    return newRoutes;
	  }
	  if (path === this.delimiter && routes[method]) {
	    next = [ [ routes.before, routes[method] ].filter(Boolean) ];
	    next.after = [ routes.after ].filter(Boolean);
	    next.matched = true;
	    next.captures = [];
	    return filterRoutes(next);
	  }
	  for (var r in routes) {
	    if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
	      current = exact = regexp + this.delimiter + r;
	      if (!this.strict) {
	        exact += "[" + this.delimiter + "]?";
	      }
	      match = path.match(new RegExp("^" + exact));
	      if (!match) {
	        continue;
	      }
	      if (match[0] && match[0] == path && routes[r][method]) {
	        next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
	        next.after = [ routes[r].after ].filter(Boolean);
	        next.matched = true;
	        next.captures = match.slice(1);
	        if (this.recurse && routes === this.routes) {
	          next.push([ routes.before, routes.on ].filter(Boolean));
	          next.after = next.after.concat([ routes.after ].filter(Boolean));
	        }
	        return filterRoutes(next);
	      }
	      next = this.traverse(method, path, routes[r], current);
	      if (next.matched) {
	        if (next.length > 0) {
	          fns = fns.concat(next);
	        }
	        if (this.recurse) {
	          fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
	          next.after = next.after.concat([ routes[r].after ].filter(Boolean));
	          if (routes === this.routes) {
	            fns.push([ routes["before"], routes["on"] ].filter(Boolean));
	            next.after = next.after.concat([ routes["after"] ].filter(Boolean));
	          }
	        }
	        fns.matched = true;
	        fns.captures = next.captures;
	        fns.after = next.after;
	        return filterRoutes(fns);
	      }
	    }
	  }
	  return false;
	};

	Router.prototype.insert = function(method, path, route, parent) {
	  var methodType, parentType, isArray, nested, part;
	  path = path.filter(function(p) {
	    return p && p.length > 0;
	  });
	  parent = parent || this.routes;
	  part = path.shift();
	  if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
	    part = regifyString(part, this.params);
	  }
	  if (path.length > 0) {
	    parent[part] = parent[part] || {};
	    return this.insert(method, path, route, parent[part]);
	  }
	  if (!part && !path.length && parent === this.routes) {
	    methodType = typeof parent[method];
	    switch (methodType) {
	     case "function":
	      parent[method] = [ parent[method], route ];
	      return;
	     case "object":
	      parent[method].push(route);
	      return;
	     case "undefined":
	      parent[method] = route;
	      return;
	    }
	    return;
	  }
	  parentType = typeof parent[part];
	  isArray = Array.isArray(parent[part]);
	  if (parent[part] && !isArray && parentType == "object") {
	    methodType = typeof parent[part][method];
	    switch (methodType) {
	     case "function":
	      parent[part][method] = [ parent[part][method], route ];
	      return;
	     case "object":
	      parent[part][method].push(route);
	      return;
	     case "undefined":
	      parent[part][method] = route;
	      return;
	    }
	  } else if (parentType == "undefined") {
	    nested = {};
	    nested[method] = route;
	    parent[part] = nested;
	    return;
	  }
	  throw new Error("Invalid route context: " + parentType);
	};



	Router.prototype.extend = function(methods) {
	  var self = this, len = methods.length, i;
	  function extend(method) {
	    self._methods[method] = true;
	    self[method] = function() {
	      var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
	      self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
	    };
	  }
	  for (i = 0; i < len; i++) {
	    extend(methods[i]);
	  }
	};

	Router.prototype.runlist = function(fns) {
	  var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
	  if (this.every && this.every.on) {
	    runlist.push(this.every.on);
	  }
	  runlist.captures = fns.captures;
	  runlist.source = fns.source;
	  return runlist;
	};

	Router.prototype.mount = function(routes, path) {
	  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
	    return;
	  }
	  var self = this;
	  path = path || [];
	  if (!Array.isArray(path)) {
	    path = path.split(self.delimiter);
	  }
	  function insertOrMount(route, local) {
	    var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
	    if (isRoute) {
	      rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
	      parts.shift();
	    }
	    if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
	      local = local.concat(parts);
	      self.mount(routes[route], local);
	      return;
	    }
	    if (isRoute) {
	      local = local.concat(rename.split(self.delimiter));
	      local = terminator(local, self.delimiter);
	    }
	    self.insert(event, local, routes[route]);
	  }
	  for (var route in routes) {
	    if (routes.hasOwnProperty(route)) {
	      insertOrMount(route, path.slice(0));
	    }
	  }
	};



	}( true ? exports : window));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __regular_script__, __regular_template__;
	__webpack_require__(7)
	__webpack_require__(8)
	__regular_script__ = __webpack_require__(9)
	__regular_template__ = __webpack_require__(25)
	var Regular = __webpack_require__( 16 );

	var __rs__ = __regular_script__ || {};
	if (__rs__.__esModule) __rs__ = __rs__.default;
	if (Regular.__esModule) Regular = Regular.default;

	var __Component__;
	if( typeof __rs__ === "object" ) {
		__rs__.template = __regular_template__;
		__Component__ = Regular.extend(__rs__);
		if( typeof __rs__.component === "object" ) {
			for( var i in __rs__.component ) {
				__Component__.component(i, __rs__.component[ i ]);
			}
		}
	} else if( typeof __rs__ === "function" && ( __rs__.prototype instanceof Regular ) ) {
		__rs__.prototype.template = __regular_template__;
		__Component__ = __rs__;
	}
	module.exports = __Component__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(10);

	__webpack_require__(17);

	var _dispatcher = __webpack_require__(21);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _docs = __webpack_require__(23);

	var _docs2 = _interopRequireDefault(_docs);

	var _docsJs = __webpack_require__(24);

	var _docsJs2 = _interopRequireDefault(_docsJs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		config: function config() {
			var _this = this;

			this.data.active = 'Button';
			this.data.doc = _docs2.default.Button;
			this.data.mixins = _docsJs2.default;

			_dispatcher2.default.on('update', function (doc, name) {
				_this.data.doc = doc;
				_this.data.active = name;
				_this.$update();
			});
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __regular_script__, __regular_template__;
	__webpack_require__(11)
	__webpack_require__(12)
	__regular_script__ = __webpack_require__(13)
	__regular_template__ = __webpack_require__(15)
	var Regular = __webpack_require__( 16 );

	var __rs__ = __regular_script__ || {};
	if (__rs__.__esModule) __rs__ = __rs__.default;
	if (Regular.__esModule) Regular = Regular.default;

	var __Component__;
	if( typeof __rs__ === "object" ) {
		__rs__.template = __regular_template__;
		__Component__ = Regular.extend(__rs__);
		if( typeof __rs__.component === "object" ) {
			for( var i in __rs__.component ) {
				__Component__.component(i, __rs__.component[ i ]);
			}
		}
	} else if( typeof __rs__ === "function" && ( __rs__.prototype instanceof Regular ) ) {
		__rs__.prototype.template = __regular_template__;
		__Component__ = __rs__;
	}
	module.exports = __Component__;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _deIndent = __webpack_require__(14);

	var _deIndent2 = _interopRequireDefault(_deIndent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		name: 'Demo',
		config: function config() {
			var hasOwn = Object.prototype.hasOwnProperty;

			if (this.data.mixin) {
				if (this.data.mixin.config) {
					this.data.mixin.config.call(this);
				}

				for (var m in this.data.mixin) {
					if (!hasOwn.call(this, m)) {
						this[m] = this.data.mixin[m];
					}
				}
			}

			if (this.data.rgl) {
				this.data.deindentRgl = (0, _deIndent2.default)(this.data.rgl).trim();
			}

			if (this.data.js) {
				this.data.deindentJs = (0, _deIndent2.default)(this.data.js).trim();
			}
		},
		init: function init() {
			if (this.data.deindentRgl) {
				hljs.highlightBlock(this.$refs.r);
			}
			if (this.data.deindentJs) {
				hljs.highlightBlock(this.$refs.j);
			}
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	var splitRE = /\r?\n/g
	var emptyRE = /^\s*$/
	var needFixRE = /^(\r?\n)*[\t\s]/

	module.exports = function deindent (str) {
	  if (!needFixRE.test(str)) {
	    return str
	  }
	  var lines = str.split(splitRE)
	  var min = Infinity
	  var type, cur, c
	  for (var i = 0; i < lines.length; i++) {
	    var line = lines[i]
	    if (!emptyRE.test(line)) {
	      if (!type) {
	        c = line.charAt(0)
	        if (c === ' ' || c === '\t') {
	          type = c
	          cur = count(line, type)
	          if (cur < min) {
	            min = cur
	          }
	        } else {
	          return str
	        }
	      } else {
	        cur = count(line, type)
	        if (cur < min) {
	          min = cur
	        }
	      }
	    }
	  }
	  return lines.map(function (line) {
	    return line.slice(min)
	  }).join('\n')
	}

	function count (line, type) {
	  var i = 0
	  while (line.charAt(i) === type) {
	    i++
	  }
	  return i
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = [{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"doc"}],"children":[{"type":"text","text":"\n\t"},{"type":"if","test":{"type":"expression","body":"c._sg_('markdown', d, e)","constant":false,"setbody":"c._ss_('markdown',p_,d, '=', 1)"},"consequent":[{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"markdown-box"}],"children":[{"type":"text","text":"\n\t\t"},{"type":"template","content":{"type":"expression","body":"c._sg_('markdown', d, e)","constant":false,"setbody":"c._ss_('markdown',p_,d, '=', 1)"}},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"}],"alternate":[]},{"type":"text","text":"\n\n\t"},{"type":"if","test":{"type":"expression","body":"c._sg_('rgl', d, e)","constant":false,"setbody":"c._ss_('rgl',p_,d, '=', 1)"},"consequent":[{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"demo-box"}],"children":[{"type":"text","text":"\n\t\t"},{"type":"template","content":{"type":"expression","body":"c._sg_('rgl', d, e)","constant":false,"setbody":"c._ss_('rgl',p_,d, '=', 1)"}},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"}],"alternate":[]},{"type":"text","text":"\n\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('deindentRgl', d, e)?'code-box':''","constant":false,"setbody":false}}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"pre","attrs":[],"children":[{"type":"element","tag":"code","attrs":[{"type":"attribute","name":"ref","value":"r"},{"type":"attribute","name":"class","value":"lang-html"}],"children":[{"type":"expression","body":"c._sg_('deindentRgl', d, e)","constant":false,"setbody":"c._ss_('deindentRgl',p_,d, '=', 1)"}]}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('deindentJs', d, e)?'code-box':''","constant":false,"setbody":false}}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"pre","attrs":[],"children":[{"type":"element","tag":"code","attrs":[{"type":"attribute","name":"ref","value":"j"},{"type":"attribute","name":"class","value":"lang-js"}],"children":[{"type":"expression","body":"c._sg_('deindentJs', d, e)","constant":false,"setbody":"c._ss_('deindentJs',p_,d, '=', 1)"}]}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n"}]}]

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = Regular;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __regular_script__, __regular_template__;
	__webpack_require__(18)
	__regular_script__ = __webpack_require__(19)
	__regular_template__ = __webpack_require__(20)
	var Regular = __webpack_require__( 16 );

	var __rs__ = __regular_script__ || {};
	if (__rs__.__esModule) __rs__ = __rs__.default;
	if (Regular.__esModule) Regular = Regular.default;

	var __Component__;
	if( typeof __rs__ === "object" ) {
		__rs__.template = __regular_template__;
		__Component__ = Regular.extend(__rs__);
		if( typeof __rs__.component === "object" ) {
			for( var i in __rs__.component ) {
				__Component__.component(i, __rs__.component[ i ]);
			}
		}
	} else if( typeof __rs__ === "function" && ( __rs__.prototype instanceof Regular ) ) {
		__rs__.prototype.template = __regular_template__;
		__Component__ = __rs__;
	}
	module.exports = __Component__;

/***/ },
/* 18 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		name: 'Nav',
		config: function config() {}
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = [{"type":"element","tag":"nav","attrs":[{"type":"attribute","name":"class","value":"nav"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"basic"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Button'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Button"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Button"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Icon'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Icon"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Icon"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Spinner'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Spinner"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Spinner"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"navigation"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Pagination'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Pagination"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Pagination"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Breadcrumb'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Breadcrumb"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Breadcrumb"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"form"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Input'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Input"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Input"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Textarea'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Textarea"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Textarea"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Radio'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Radio"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Radio"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Checkbox'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Checkbox"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Checkbox"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Switch'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Switch"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Switch"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Table'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Table"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Table"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Form'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Form"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Form"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t\n\t\t\n\t\t\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"container"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Modal'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Modal"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Modal"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Box'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Box"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Box"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"tree"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='ElementTree'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/ElementTree"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"ElementTree"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"message"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Note'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Note"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Note"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"title"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"time"}]},{"type":"text","text":"\n\t"},{"type":"element","tag":"ul","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"li","attrs":[{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"\n\t\t\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":{"type":"expression","body":"c._sg_('active', d, e)==='Countdown'?'active':''","constant":false,"setbody":false}},{"type":"attribute","name":"href","value":"#/Countdown"},{"type":"attribute","name":"_r-7130e100","value":""}],"children":[{"type":"text","text":"Countdown"}]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\t"}]},{"type":"text","text":"\n"}]}]

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _eventemitter = __webpack_require__(22);

	var dispatcher = new _eventemitter.EventEmitter2();

	exports.default = dispatcher;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter2
	 * https://github.com/hij1nx/EventEmitter2
	 *
	 * Copyright (c) 2013 hij1nx
	 * Licensed under the MIT license.
	 */
	;!function(undefined) {

	  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	  };
	  var defaultMaxListeners = 10;

	  function init() {
	    this._events = {};
	    if (this._conf) {
	      configure.call(this, this._conf);
	    }
	  }

	  function configure(conf) {
	    if (conf) {

	      this._conf = conf;

	      conf.delimiter && (this.delimiter = conf.delimiter);
	      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
	      conf.wildcard && (this.wildcard = conf.wildcard);
	      conf.newListener && (this.newListener = conf.newListener);

	      if (this.wildcard) {
	        this.listenerTree = {};
	      }
	    }
	  }

	  function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    configure.call(this, conf);
	  }
	  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

	  //
	  // Attention, function return type now is array, always !
	  // It has zero elements if no any matches found and one or more
	  // elements (leafs) if there are matches
	  //
	  function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	      return [];
	    }
	    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
	        typeLength = type.length, currentType = type[i], nextType = type[i+1];
	    if (i === typeLength && tree._listeners) {
	      //
	      // If at the end of the event(s) list and the tree has listeners
	      // invoke those listeners.
	      //
	      if (typeof tree._listeners === 'function') {
	        handlers && handlers.push(tree._listeners);
	        return [tree];
	      } else {
	        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	          handlers && handlers.push(tree._listeners[leaf]);
	        }
	        return [tree];
	      }
	    }

	    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
	      //
	      // If the event emitted is '*' at this part
	      // or there is a concrete match at this patch
	      //
	      if (currentType === '*') {
	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
	          }
	        }
	        return listeners;
	      } else if(currentType === '**') {
	        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
	        if(endReached && tree._listeners) {
	          // The next element has a _listeners, add it to the handlers.
	          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	        }

	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            if(branch === '*' || branch === '**') {
	              if(tree[branch]._listeners && !endReached) {
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	              }
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            } else if(branch === nextType) {
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
	            } else {
	              // No match on this one, shift into the tree but not in the type array.
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            }
	          }
	        }
	        return listeners;
	      }

	      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	      //
	      // If the listener tree will allow any match for this part,
	      // then recursively explore all branches of the tree
	      //
	      searchListenerTree(handlers, type, xTree, i+1);
	    }

	    xxTree = tree['**'];
	    if(xxTree) {
	      if(i < typeLength) {
	        if(xxTree._listeners) {
	          // If we have a listener on a '**', it will catch all, so add its handler.
	          searchListenerTree(handlers, type, xxTree, typeLength);
	        }

	        // Build arrays of matching next branches and others.
	        for(branch in xxTree) {
	          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	            if(branch === nextType) {
	              // We know the next element will match, so jump twice.
	              searchListenerTree(handlers, type, xxTree[branch], i+2);
	            } else if(branch === currentType) {
	              // Current node matches, move into the tree.
	              searchListenerTree(handlers, type, xxTree[branch], i+1);
	            } else {
	              isolatedBranch = {};
	              isolatedBranch[branch] = xxTree[branch];
	              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
	            }
	          }
	        }
	      } else if(xxTree._listeners) {
	        // We have reached the end and still on a '**'
	        searchListenerTree(handlers, type, xxTree, typeLength);
	      } else if(xxTree['*'] && xxTree['*']._listeners) {
	        searchListenerTree(handlers, type, xxTree['*'], typeLength);
	      }
	    }

	    return listeners;
	  }

	  function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for(var i = 0, len = type.length; i+1 < len; i++) {
	      if(type[i] === '**' && type[i+1] === '**') {
	        return;
	      }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name) {

	      if (!tree[name]) {
	        tree[name] = {};
	      }

	      tree = tree[name];

	      if (type.length === 0) {

	        if (!tree._listeners) {
	          tree._listeners = listener;
	        }
	        else if(typeof tree._listeners === 'function') {
	          tree._listeners = [tree._listeners, listener];
	        }
	        else if (isArray(tree._listeners)) {

	          tree._listeners.push(listener);

	          if (!tree._listeners.warned) {

	            var m = defaultMaxListeners;

	            if (typeof this._events.maxListeners !== 'undefined') {
	              m = this._events.maxListeners;
	            }

	            if (m > 0 && tree._listeners.length > m) {

	              tree._listeners.warned = true;
	              console.error('(node) warning: possible EventEmitter memory ' +
	                            'leak detected. %d listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit.',
	                            tree._listeners.length);
	              if(console.trace){
	                console.trace();
	              }
	            }
	          }
	        }
	        return true;
	      }
	      name = type.shift();
	    }
	    return true;
	  }

	  // By default EventEmitters will print a warning if more than
	  // 10 listeners are added to it. This is a useful default which
	  // helps finding memory leaks.
	  //
	  // Obviously not all Emitters should be limited to 10. This function allows
	  // that to be increased. Set to zero for unlimited.

	  EventEmitter.prototype.delimiter = '.';

	  EventEmitter.prototype.setMaxListeners = function(n) {
	    this._events || init.call(this);
	    this._events.maxListeners = n;
	    if (!this._conf) this._conf = {};
	    this._conf.maxListeners = n;
	  };

	  EventEmitter.prototype.event = '';

	  EventEmitter.prototype.once = function(event, fn) {
	    this.many(event, 1, fn);
	    return this;
	  };

	  EventEmitter.prototype.many = function(event, ttl, fn) {
	    var self = this;

	    if (typeof fn !== 'function') {
	      throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	      if (--ttl === 0) {
	        self.off(event, listener);
	      }
	      fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this.on(event, listener);

	    return self;
	  };

	  EventEmitter.prototype.emit = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) {
	        return false;
	      }
	    }

	    var al = arguments.length;
	    var args,l,i,j;
	    var handler;

	    if (this._all && this._all.length) {
	      handler = this._all.slice();
	      if (al > 3) {
	        args = new Array(al);
	        for (j = 0; j < al; j++) args[j] = arguments[j];
	      }

	      for (i = 0, l = handler.length; i < l; i++) {
	        this.event = type;
	        switch (al) {
	        case 1:
	          handler[i].call(this, type);
	          break;
	        case 2:
	          handler[i].call(this, type, arguments[1]);
	          break;
	        case 3:
	          handler[i].call(this, type, arguments[1], arguments[2]);
	          break;
	        default:
	          handler[i].apply(this, args);
	        }
	      }
	    }

	    if (this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    } else {
	      handler = this._events[type];
	      if (typeof handler === 'function') {
	        this.event = type;
	        switch (al) {
	        case 1:
	          handler.call(this);
	          break;
	        case 2:
	          handler.call(this, arguments[1]);
	          break;
	        case 3:
	          handler.call(this, arguments[1], arguments[2]);
	          break;
	        default:
	          args = new Array(al - 1);
	          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
	          handler.apply(this, args);
	        }
	        return true;
	      } else if (handler) {
	        // need to make copy of handlers because list can change in the middle
	        // of emit call
	        handler = handler.slice();
	      }
	    }

	    if (handler && handler.length) {
	      if (al > 3) {
	        args = new Array(al - 1);
	        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
	      }
	      for (i = 0, l = handler.length; i < l; i++) {
	        this.event = type;
	        switch (al) {
	        case 1:
	          handler[i].call(this);
	          break;
	        case 2:
	          handler[i].call(this, arguments[1]);
	          break;
	        case 3:
	          handler[i].call(this, arguments[1], arguments[2]);
	          break;
	        default:
	          handler[i].apply(this, args);
	        }
	      }
	      return true;
	    } else if (!this._all && type === 'error') {
	      if (arguments[1] instanceof Error) {
	        throw arguments[1]; // Unhandled 'error' event
	      } else {
	        throw new Error("Uncaught, unspecified 'error' event.");
	      }
	      return false;
	    }

	    return !!this._all;
	  };

	  EventEmitter.prototype.emitAsync = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	        if (!this._events.newListener) { return Promise.resolve([false]); }
	    }

	    var promises= [];

	    var al = arguments.length;
	    var args,l,i,j;
	    var handler;

	    if (this._all) {
	      if (al > 3) {
	        args = new Array(al);
	        for (j = 1; j < al; j++) args[j] = arguments[j];
	      }
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        switch (al) {
	        case 1:
	          promises.push(this._all[i].call(this, type));
	          break;
	        case 2:
	          promises.push(this._all[i].call(this, type, arguments[1]));
	          break;
	        case 3:
	          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
	          break;
	        default:
	          promises.push(this._all[i].apply(this, args));
	        }
	      }
	    }

	    if (this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    } else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      switch (al) {
	      case 1:
	        promises.push(handler.call(this));
	        break;
	      case 2:
	        promises.push(handler.call(this, arguments[1]));
	        break;
	      case 3:
	        promises.push(handler.call(this, arguments[1], arguments[2]));
	        break;
	      default:
	        args = new Array(al - 1);
	        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
	        promises.push(handler.apply(this, args));
	      }
	    } else if (handler && handler.length) {
	      if (al > 3) {
	        args = new Array(al - 1);
	        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
	      }
	      for (i = 0, l = handler.length; i < l; i++) {
	        this.event = type;
	        switch (al) {
	        case 1:
	          promises.push(handler[i].call(this));
	          break;
	        case 2:
	          promises.push(handler[i].call(this, arguments[1]));
	          break;
	        case 3:
	          promises.push(handler[i].call(this, arguments[1], arguments[2]));
	          break;
	        default:
	          promises.push(handler[i].apply(this, args));
	        }
	      }
	    } else if (!this._all && type === 'error') {
	      if (arguments[1] instanceof Error) {
	        return Promise.reject(arguments[1]); // Unhandled 'error' event
	      } else {
	        return Promise.reject("Uncaught, unspecified 'error' event.");
	      }
	    }

	    return Promise.all(promises);
	  };

	  EventEmitter.prototype.on = function(type, listener) {

	    if (typeof type === 'function') {
	      this.onAny(type);
	      return this;
	    }

	    if (typeof listener !== 'function') {
	      throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if(this.wildcard) {
	      growListenerTree.call(this, type, listener);
	      return this;
	    }

	    if (!this._events[type]) {
	      // Optimize the case of one listener. Don't need the extra array object.
	      this._events[type] = listener;
	    }
	    else if(typeof this._events[type] === 'function') {
	      // Adding the second element, need to change to array.
	      this._events[type] = [this._events[type], listener];
	    }
	    else if (isArray(this._events[type])) {
	      // If we've already got an array, just append.
	      this._events[type].push(listener);

	      // Check for listener leak
	      if (!this._events[type].warned) {

	        var m = defaultMaxListeners;

	        if (typeof this._events.maxListeners !== 'undefined') {
	          m = this._events.maxListeners;
	        }

	        if (m > 0 && this._events[type].length > m) {

	          this._events[type].warned = true;
	          console.error('(node) warning: possible EventEmitter memory ' +
	                        'leak detected. %d listeners added. ' +
	                        'Use emitter.setMaxListeners() to increase limit.',
	                        this._events[type].length);
	          if(console.trace){
	            console.trace();
	          }
	        }
	      }
	    }
	    return this;
	  };

	  EventEmitter.prototype.onAny = function(fn) {

	    if (typeof fn !== 'function') {
	      throw new Error('onAny only accepts instances of Function');
	    }

	    if(!this._all) {
	      this._all = [];
	    }

	    // Add the function to the event listener collection.
	    this._all.push(fn);
	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  EventEmitter.prototype.off = function(type, listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,leafs=[];

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    }
	    else {
	      // does not use listeners(), so no side effect of creating _events[type]
	      if (!this._events[type]) return this;
	      handlers = this._events[type];
	      leafs.push({_listeners:handlers});
	    }

	    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	      var leaf = leafs[iLeaf];
	      handlers = leaf._listeners;
	      if (isArray(handlers)) {

	        var position = -1;

	        for (var i = 0, length = handlers.length; i < length; i++) {
	          if (handlers[i] === listener ||
	            (handlers[i].listener && handlers[i].listener === listener) ||
	            (handlers[i]._origin && handlers[i]._origin === listener)) {
	            position = i;
	            break;
	          }
	        }

	        if (position < 0) {
	          continue;
	        }

	        if(this.wildcard) {
	          leaf._listeners.splice(position, 1);
	        }
	        else {
	          this._events[type].splice(position, 1);
	        }

	        if (handlers.length === 0) {
	          if(this.wildcard) {
	            delete leaf._listeners;
	          }
	          else {
	            delete this._events[type];
	          }
	        }

	        this.emit("removeListener", type, listener);

	        return this;
	      }
	      else if (handlers === listener ||
	        (handlers.listener && handlers.listener === listener) ||
	        (handlers._origin && handlers._origin === listener)) {
	        if(this.wildcard) {
	          delete leaf._listeners;
	        }
	        else {
	          delete this._events[type];
	        }

	        this.emit("removeListener", type, listener);
	      }
	    }

	    function recursivelyGarbageCollect(root) {
	      if (root === undefined) {
	        return;
	      }
	      var keys = Object.keys(root);
	      for (var i in keys) {
	        var key = keys[i];
	        var obj = root[key];
	        if ((obj instanceof Function) || (typeof obj !== "object"))
	          continue;
	        if (Object.keys(obj).length > 0) {
	          recursivelyGarbageCollect(root[key]);
	        }
	        if (Object.keys(obj).length === 0) {
	          delete root[key];
	        }
	      }
	    }
	    recursivelyGarbageCollect(this.listenerTree);

	    return this;
	  };

	  EventEmitter.prototype.offAny = function(fn) {
	    var i = 0, l = 0, fns;
	    if (fn && this._all && this._all.length > 0) {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++) {
	        if(fn === fns[i]) {
	          fns.splice(i, 1);
	          this.emit("removeListenerAny", fn);
	          return this;
	        }
	      }
	    } else {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++)
	        this.emit("removeListenerAny", fns[i]);
	      this._all = [];
	    }
	    return this;
	  };

	  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	  EventEmitter.prototype.removeAllListeners = function(type) {
	    if (arguments.length === 0) {
	      !this._events || init.call(this);
	      return this;
	    }

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        leaf._listeners = null;
	      }
	    }
	    else {
	      if (!this._events || !this._events[type]) return this;
	      this._events[type] = null;
	    }
	    return this;
	  };

	  EventEmitter.prototype.listeners = function(type) {
	    if(this.wildcard) {
	      var handlers = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	      return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	      this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	  };

	  EventEmitter.prototype.listenersAny = function() {

	    if(this._all) {
	      return this._all;
	    }
	    else {
	      return [];
	    }

	  };

	  if (true) {
	     // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return EventEmitter;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // CommonJS
	    module.exports = EventEmitter;
	  }
	  else {
	    // Browser global.
	    window.EventEmitter2 = EventEmitter;
	  }
	}();


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = {
		"Box": [
			{
				"path": "Box/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n\t<Box margin=\"10px 0 15px \" padding=\"0 40px\">\r\n\t\t<Button primary>Button in Box</Button>\r\n\t</Box>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "    <Box margin=\"10px 0 15px \" padding=\"0 40px\">\n        <Button primary>Button in Box</Button>\n    </Box>"
				},
				"id": 0
			}
		],
		"Breadcrumb": [
			{
				"path": "Breadcrumb/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Breadcrumb>\r\n\t<BreadcrumbItem href=\"#!Home\">\r\n\t\t<Icon>&#xe605;</Icon>\r\n\t\tHome\r\n\t</BreadcrumbItem>\r\n\r\n\t<BreadcrumbItem href=\"#!Category\">\r\n\t\t<Icon>&#xe604;</Icon>\r\n\t\tCategory\r\n\t</BreadcrumbItem>\r\n\r\n\t<BreadcrumbItem>\r\n\t\tPage\r\n\t</BreadcrumbItem>\r\n</Breadcrumb>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Breadcrumb>\n    <BreadcrumbItem href=\"#!Home\">\n        <Icon>&#xe605;</Icon>\n        Home\n    </BreadcrumbItem>\n\n    <BreadcrumbItem href=\"#!Category\">\n        <Icon>&#xe604;</Icon>\n        Category\n    </BreadcrumbItem>\n\n    <BreadcrumbItem>\n        Page\n    </BreadcrumbItem>\n</Breadcrumb>"
				},
				"id": 1
			}
		],
		"Button": [
			{
				"path": "Button/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Button primary>Primary</Button>\r\n<Button>Normal</Button>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Button primary>Primary</Button>\n<Button>Normal</Button>"
				},
				"id": 2
			},
			{
				"path": "Button/size.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nSize\r\n\r\n```html\r\n<Button primary sm>Primary</Button>\r\n<Button sm>Normal</Button>\r\n```\r\n",
				"html": "<p>Size</p>\n",
				"code": {
					"html": "<Button primary sm>Primary</Button>\n<Button sm>Normal</Button>"
				},
				"id": 5
			},
			{
				"path": "Button/disabled.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nDisabled\r\n\r\n```html\r\n<Button primary disabled>Disabled</Button>\r\n<Button disabled>Disabled</Button>\r\n```\r\n",
				"html": "<p>Disabled</p>\n",
				"code": {
					"html": "<Button primary disabled>Disabled</Button>\n<Button disabled>Disabled</Button>"
				},
				"id": 3
			},
			{
				"path": "Button/event.md",
				"attrs": {
					"order": 4
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n<Button on-click=\"{ v = Math.random() }\">Random</Button>\r\n<Input value=\"{ v }\"></Input>\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "<Button on-click=\"{ v = Math.random() }\">Random</Button>\n<Input value=\"{ v }\"></Input>"
				},
				"id": 4
			}
		],
		"Checkbox": [
			{
				"path": "Checkbox/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Checkbox checked=\"{ false }\">Option</Checkbox>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Checkbox checked=\"{ false }\">Option</Checkbox>"
				},
				"id": 6
			},
			{
				"path": "Checkbox/group.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nGroup\r\n\r\n```html\r\n<CheckboxGroup checked=\"{ 2 }\">\r\n\t<Checkbox value=\"{ 1 }\">Option 1</Checkbox>\r\n\t<Checkbox value=\"{ 2 }\">Option 2</Checkbox>\r\n\t<Checkbox value=\"{ 3 }\">Option 3</Checkbox>\r\n</CheckboxGroup>\r\n```\r\n",
				"html": "<p>Group</p>\n",
				"code": {
					"html": "<CheckboxGroup checked=\"{ 2 }\">\n    <Checkbox value=\"{ 1 }\">Option 1</Checkbox>\n    <Checkbox value=\"{ 2 }\">Option 2</Checkbox>\n    <Checkbox value=\"{ 3 }\">Option 3</Checkbox>\n</CheckboxGroup>"
				},
				"id": 8
			},
			{
				"path": "Checkbox/event.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n<CheckboxGroup on-change=\"{ v = $event }\">\r\n\t<Checkbox value=\"{ 1 }\">Option 1</Checkbox>\r\n\t<Checkbox value=\"{ 2 }\">Option 2</Checkbox>\r\n\t<Checkbox value=\"{ 3 }\">Option 3</Checkbox>\r\n</CheckboxGroup>\r\n<br />\r\n<br />\r\nChecked：{ ( v && v.length > 0 ) ? v : 'none' }\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "<CheckboxGroup on-change=\"{ v = $event }\">\n    <Checkbox value=\"{ 1 }\">Option 1</Checkbox>\n    <Checkbox value=\"{ 2 }\">Option 2</Checkbox>\n    <Checkbox value=\"{ 3 }\">Option 3</Checkbox>\n</CheckboxGroup>\n<br />\n<br />\nChecked：{ ( v && v.length > 0 ) ? v : 'none' }"
				},
				"id": 7
			}
		],
		"Countdown": [
			{
				"path": "Countdown/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Countdown\r\n\tend=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\r\n></Countdown>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Countdown\n    end=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\n></Countdown>"
				},
				"id": 9
			},
			{
				"path": "Countdown/locale.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nLocale\r\n\r\n```html\r\n<Countdown\r\n\tend=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\r\n\tlocale=\"zh\"\r\n></Countdown>\r\n```\r\n",
				"html": "<p>Locale</p>\n",
				"code": {
					"html": "<Countdown\n    end=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\n    locale=\"zh\"\n></Countdown>"
				},
				"id": 12
			},
			{
				"path": "Countdown/format.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nFormat\r\n\r\n```html\r\n<Countdown\r\n\tend=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\r\n\tformat=\"[D] or [DAY] 天 [H] or [HOUR] 时 [M] or [MINUTE] 分 [S] or [SECOND] 秒\"\r\n></Countdown>\r\n```\r\n",
				"html": "<p>Format</p>\n",
				"code": {
					"html": "<Countdown\n    end=\"{ Date.now() + 1000 * 60 * 60 * 24 * 7 }\"\n    format=\"[D] or [DAY] 天 [H] or [HOUR] 时 [M] or [MINUTE] 分 [S] or [SECOND] 秒\"\n></Countdown>"
				},
				"id": 11
			},
			{
				"path": "Countdown/event.md",
				"attrs": {
					"order": 4
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n{#if !isTimeEnd}\r\n<Countdown end=\"{ v ? v : v = ( Date.now() + 1000 * 5 ) }\" on-end=\"{ isTimeEnd = true }\"></Countdown>\r\n{#else}\r\n<img src=\"http://i1.hdslb.com/icon/f8c84297779fb8f8d24f2476c78bbefc.gif\" />\r\n{/if}\r\n<br />\r\n<br />\r\nisTimeEnd: { isTimeEnd ? 'true' : 'false' }\r\n<br />\r\n<br />\r\n<Button sm primary on-click=\"{ v = Date.now() + 1000 * 5 && ( isTimeEnd = false ) }\">Reset</Button>\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "{#if !isTimeEnd}\n<Countdown end=\"{ v ? v : v = ( Date.now() + 1000 * 5 ) }\" on-end=\"{ isTimeEnd = true }\"></Countdown>\n{#else}\n<img src=\"http://i1.hdslb.com/icon/f8c84297779fb8f8d24f2476c78bbefc.gif\" />\n{/if}\n<br />\n<br />\nisTimeEnd: { isTimeEnd ? 'true' : 'false' }\n<br />\n<br />\n<Button sm primary on-click=\"{ v = Date.now() + 1000 * 5 && ( isTimeEnd = false ) }\">Reset</Button>"
				},
				"id": 10
			}
		],
		"ElementTree": [
			{
				"path": "ElementTree/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\n```html\r\n<ElementTree source=\"{ source }\" on-select=\"{ this.onSelect( $event ) }\"></ElementTree>\r\n<br />\r\nSelected: { JSON.stringify( selected ) }\r\n```\r\n\r\n```js\r\n{\r\n\tconfig: function() {\r\n\t\tthis.data.source = [\r\n\t\t\t{\r\n\t\t\t\tname: 'head',\r\n\t\t\t\tchildren: [\r\n\t\t\t\t\t{\r\n\t\t\t\t\t\tname: 'meta',\r\n\t\t\t\t\t\tattrs: {\r\n\t\t\t\t\t\t\tcharset: 'utf-8'\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t]\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tname: 'body',\r\n\t\t\t\tchildren: [\r\n\t\t\t\t\t{\r\n\t\t\t\t\t\tname: 'div',\r\n\t\t\t\t\t\tattrs: {\r\n\t\t\t\t\t\t\tid: 'app',\r\n\t\t\t\t\t\t\tclass: 'app'\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t\tchildren: [\r\n\t\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\t\tname: 'h1',\r\n\t\t\t\t\t\t\t\tattrs: {\r\n\t\t\t\t\t\t\t\t\tclass: 'title'\r\n\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t},\r\n\t\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\t\tname: 'div',\r\n\t\t\t\t\t\t\t\tattrs: {\r\n\t\t\t\t\t\t\t\t\tclass: 'content'\r\n\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t]\r\n\t\t\t\t\t},\r\n\t\t\t\t\t{\r\n\t\t\t\t\t\tname: 'script',\r\n\t\t\t\t\t\tattrs: {\r\n\t\t\t\t\t\t\ttype: 'text/javascript',\r\n\t\t\t\t\t\t\tsrc: \"../app.js\"\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t]\r\n\t\t\t}\r\n\t\t];\r\n\t},\r\n\tonSelect: function( node ) {\r\n\t\tthis.data.selected = node;\r\n\t\tthis.$update();\r\n\t}\r\n}\r\n```\r\n",
				"html": "",
				"code": {
					"html": "<ElementTree source=\"{ source }\" on-select=\"{ this.onSelect( $event ) }\"></ElementTree>\n<br />\nSelected: { JSON.stringify( selected ) }",
					"js": "{\n    config: function() {\n        this.data.source = [\n            {\n                name: 'head',\n                children: [\n                    {\n                        name: 'meta',\n                        attrs: {\n                            charset: 'utf-8'\n                        }\n                    }\n                ]\n            },\n            {\n                name: 'body',\n                children: [\n                    {\n                        name: 'div',\n                        attrs: {\n                            id: 'app',\n                            class: 'app'\n                        },\n                        children: [\n                            {\n                                name: 'h1',\n                                attrs: {\n                                    class: 'title'\n                                }\n                            },\n                            {\n                                name: 'div',\n                                attrs: {\n                                    class: 'content'\n                                }\n                            }\n                        ]\n                    },\n                    {\n                        name: 'script',\n                        attrs: {\n                            type: 'text/javascript',\n                            src: \"../app.js\"\n                        }\n                    }\n                ]\n            }\n        ];\n    },\n    onSelect: function( node ) {\n        this.data.selected = node;\n        this.$update();\n    }\n}"
				},
				"id": 13
			}
		],
		"Form": [
			{
				"path": "Form/intro.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\n### Pure provides you two common form layout\r\n",
				"html": "<h3 id=\"pure-provides-you-two-common-form-layout\">Pure provides you two common form layout</h3>\n",
				"code": {},
				"id": 15
			},
			{
				"path": "Form/horizontal.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nHorizontal\r\n\r\n```html\r\n<Form>\r\n\t<FormItem>\r\n\t\t<FormLabel>Nickname</FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Input placeholder=\"Your Nickname\"></Input>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\t\r\n\t<FormItem>\r\n\t\t<FormLabel>Email</FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Input placeholder=\"Your Email\"></Input>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\r\n\t<FormItem>\r\n\t\t<FormLabel></FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Checkbox>Agree something</Checkbox>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\r\n\t<FormItem>\r\n\t\t<FormLabel></FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Button primary>Register</Button>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n</Form>\r\n```\r\n",
				"html": "<p>Horizontal</p>\n",
				"code": {
					"html": "<Form>\n    <FormItem>\n        <FormLabel>Nickname</FormLabel>\n        <FormControl>\n            <Input placeholder=\"Your Nickname\"></Input>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel>Email</FormLabel>\n        <FormControl>\n            <Input placeholder=\"Your Email\"></Input>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel></FormLabel>\n        <FormControl>\n            <Checkbox>Agree something</Checkbox>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel></FormLabel>\n        <FormControl>\n            <Button primary>Register</Button>\n        </FormControl>\n    </FormItem>\n</Form>"
				},
				"id": 14
			},
			{
				"path": "Form/vertical.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nVertical\r\n\r\n```html\r\n<Form v>\r\n\t<FormItem>\r\n\t\t<FormLabel>Nickname</FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Input placeholder=\"Your Nickname\"></Input>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\r\n\t<FormItem>\r\n\t\t<FormLabel>Email</FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Input placeholder=\"Your Email\"></Input>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\r\n\t<FormItem>\r\n\t\t<FormLabel></FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Checkbox>Agree something</Checkbox>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n\r\n\t<FormItem>\r\n\t\t<FormLabel></FormLabel>\r\n\t\t<FormControl>\r\n\t\t\t<Button primary>Register</Button>\r\n\t\t</FormControl>\r\n\t</FormItem>\r\n</Form>\r\n```\r\n",
				"html": "<p>Vertical</p>\n",
				"code": {
					"html": "<Form v>\n    <FormItem>\n        <FormLabel>Nickname</FormLabel>\n        <FormControl>\n            <Input placeholder=\"Your Nickname\"></Input>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel>Email</FormLabel>\n        <FormControl>\n            <Input placeholder=\"Your Email\"></Input>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel></FormLabel>\n        <FormControl>\n            <Checkbox>Agree something</Checkbox>\n        </FormControl>\n    </FormItem>\n\n    <FormItem>\n        <FormLabel></FormLabel>\n        <FormControl>\n            <Button primary>Register</Button>\n        </FormControl>\n    </FormItem>\n</Form>"
				},
				"id": 16
			}
		],
		"Icon": [
			{
				"path": "Icon/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Icon>&#xe603;</Icon>\r\n<Icon>&#xe601;</Icon>\r\n<Icon>&#xe602;</Icon>\r\n<Icon>&#xe600;</Icon>\r\n<Icon>&#xe605;</Icon>\r\n<Icon>&#xe604;</Icon>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Icon>&#xe603;</Icon>\n<Icon>&#xe601;</Icon>\n<Icon>&#xe602;</Icon>\n<Icon>&#xe600;</Icon>\n<Icon>&#xe605;</Icon>\n<Icon>&#xe604;</Icon>"
				},
				"id": 17
			}
		],
		"Input": [
			{
				"path": "Input/basic.md",
				"attrs": {
					"order": 0
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Input placeholder=\"placeholder\" value=\"v\"></Input>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Input placeholder=\"placeholder\" value=\"v\"></Input>"
				},
				"id": 18
			},
			{
				"path": "Input/disabled.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nDisabled\r\n\r\n```html\r\n<Input disabled=\"{ true }\"></Input>\r\n```\r\n",
				"html": "<p>Disabled</p>\n",
				"code": {
					"html": "<Input disabled=\"{ true }\"></Input>"
				},
				"id": 19
			},
			{
				"path": "Input/error.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nError Status\r\n\r\n```html\r\n<Input error=\"{ true }\"></Input>\r\n```\r\n",
				"html": "<p>Error Status</p>\n",
				"code": {
					"html": "<Input error=\"{ true }\"></Input>"
				},
				"id": 21
			},
			{
				"path": "Input/error-with-message.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nError Status With Error Message\r\n\r\n```html\r\n<Input error=\"{ true }\" error-message=\"{ 'This field is REQUIRED' }\"></Input>\r\n```\r\n",
				"html": "<p>Error Status With Error Message</p>\n",
				"code": {
					"html": "<Input error=\"{ true }\" error-message=\"{ 'This field is REQUIRED' }\"></Input>"
				},
				"id": 20
			},
			{
				"path": "Input/event.md",
				"attrs": {
					"order": 4
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n<Input on-change=\"{ v = $event }\"></Input>\r\n<Input value=\"{ v }\"></Input>\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "<Input on-change=\"{ v = $event }\"></Input>\n<Input value=\"{ v }\"></Input>"
				},
				"id": 22
			}
		],
		"Modal": [
			{
				"path": "Modal/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n**Tips:** Pure doesn't set z-index for Modal, you should set it on your own\r\n\r\n```html\r\n<Button primary on-click=\"{ showModal = true }\">Open Modal</Button>\r\n{#if showModal}\r\n<Modal\r\n\ttitle=\"Modal Title\"\r\n\tok-text=\"Confirm\"\r\n\tcancel-text=\"Cancel\"\r\n\ton-cancel=\"{ showModal = false }\"\r\n\ton-ok=\"{ showModal = false }\"\r\n>\r\n\t<div class=\"modal-example-center\">\r\n\t\t<img src=\"http://i0.hdslb.com/group1/M00/B7/58/oYYBAFdLrESAWc1eAACDBgqOgmI788.gif\">\r\n\t</div>\r\n</Modal>\r\n{/if}\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n<p><strong>Tips:</strong> Pure doesn&#39;t set z-index for Modal, you should set it on your own</p>\n",
				"code": {
					"html": "<Button primary on-click=\"{ showModal = true }\">Open Modal</Button>\n{#if showModal}\n<Modal\n    title=\"Modal Title\"\n    ok-text=\"Confirm\"\n    cancel-text=\"Cancel\"\n    on-cancel=\"{ showModal = false }\"\n    on-ok=\"{ showModal = false }\"\n>\n    <div class=\"modal-example-center\">\n        <img src=\"http://i0.hdslb.com/group1/M00/B7/58/oYYBAFdLrESAWc1eAACDBgqOgmI788.gif\">\n    </div>\n</Modal>\n{/if}"
				},
				"id": 23
			}
		],
		"Note": [
			{
				"path": "Note/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Note type=\"info\">info</Note>\r\n<Note type=\"success\">success</Note>\r\n<Note type=\"warning\">warning</Note>\r\n<Note type=\"error\">error</Note>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Note type=\"info\">info</Note>\n<Note type=\"success\">success</Note>\n<Note type=\"warning\">warning</Note>\n<Note type=\"error\">error</Note>"
				},
				"id": 24
			},
			{
				"path": "Note/programtic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nyou can also use `Note` in programtic way\r\n\r\n```html\r\n<Button on-click=\"{ this.onShowNote() }\">Show Note</Button>\r\n```\r\n\r\n```js\r\n{\r\n\tonShowNote: function() {\r\n\t\tvar i = Math.floor( Math.random() * 10 % 4 );\r\n\t\tvar types = 'info success warning danger'.split(' ');\r\n\t\tvar type = types[ i ];\r\n\r\n\t\tPure.note( \"Hey there ;)\", type );\r\n\t}\r\n}\r\n```\r\n",
				"html": "<p>you can also use <code>Note</code> in programtic way</p>\n",
				"code": {
					"html": "<Button on-click=\"{ this.onShowNote() }\">Show Note</Button>",
					"js": "{\n    onShowNote: function() {\n        var i = Math.floor( Math.random() * 10 % 4 );\n        var types = 'info success warning danger'.split(' ');\n        var type = types[ i ];\n\n        Pure.note( \"Hey there ;)\", type );\n    }\n}"
				},
				"id": 25
			}
		],
		"Pagination": [
			{
				"path": "Pagination/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Pagination\r\n\tmin=\"{ 50 }\"\r\n\tmax=\"{ 100 }\"\r\n\tcurrent=\"{ current || 50 }\"\r\n\tprev-text=\"<\"\r\n\tnext-text=\">\"\r\n\ton-change=\"{ current = $event }\"\r\n></Pagination>\r\nCurrent: { current || 50 }\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Pagination\n    min=\"{ 50 }\"\n    max=\"{ 100 }\"\n    current=\"{ current || 50 }\"\n    prev-text=\"<\"\n    next-text=\">\"\n    on-change=\"{ current = $event }\"\n></Pagination>\nCurrent: { current || 50 }"
				},
				"id": 26
			}
		],
		"Radio": [
			{
				"path": "Radio/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Radio checked=\"{ false }\">Option</Radio>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Radio checked=\"{ false }\">Option</Radio>"
				},
				"id": 27
			},
			{
				"path": "Radio/group.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nGroup\r\n\r\n```html\r\n<RadioGroup checked=\"{ 2 }\">\r\n\t<Radio value=\"{ 1 }\">Option 1</Radio>\r\n\t<Radio value=\"{ 2 }\">Option 2</Radio>\r\n\t<Radio value=\"{ 3 }\">Option 3</Radio>\r\n</RadioGroup>\r\n```\r\n",
				"html": "<p>Group</p>\n",
				"code": {
					"html": "<RadioGroup checked=\"{ 2 }\">\n    <Radio value=\"{ 1 }\">Option 1</Radio>\n    <Radio value=\"{ 2 }\">Option 2</Radio>\n    <Radio value=\"{ 3 }\">Option 3</Radio>\n</RadioGroup>"
				},
				"id": 29
			},
			{
				"path": "Radio/event.md",
				"attrs": {
					"order": 3
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n<RadioGroup on-change=\"{ v = $event }\">\r\n\t<Radio value=\"{ 1 }\">Option 1</Radio>\r\n\t<Radio value=\"{ 2 }\">Option 2</Radio>\r\n\t<Radio value=\"{ 3 }\">Option 3</Radio>\r\n</RadioGroup>\r\n<br />\r\n<br />\r\nChecked：{ v || 'none' }\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "<RadioGroup on-change=\"{ v = $event }\">\n    <Radio value=\"{ 1 }\">Option 1</Radio>\n    <Radio value=\"{ 2 }\">Option 2</Radio>\n    <Radio value=\"{ 3 }\">Option 3</Radio>\n</RadioGroup>\n<br />\n<br />\nChecked：{ v || 'none' }"
				},
				"id": 28
			}
		],
		"Spinner": [
			{
				"path": "Spinner/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Spinner></Spinner>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Spinner></Spinner>"
				},
				"id": 30
			}
		],
		"Switch": [
			{
				"path": "Switch/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Switch checked=\"{ false }\"></Switch>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Switch checked=\"{ false }\"></Switch>"
				},
				"id": 31
			},
			{
				"path": "Switch/event.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nEvent\r\n\r\n```html\r\n<Switch on-change=\"{ v = $event }\"></Switch>\r\n<br />\r\n<br />\r\nChecked: { v !== undefined ? v : 'none' }\r\n```\r\n",
				"html": "<p>Event</p>\n",
				"code": {
					"html": "<Switch on-change=\"{ v = $event }\"></Switch>\n<br />\n<br />\nChecked: { v !== undefined ? v : 'none' }"
				},
				"id": 32
			}
		],
		"Table": [
			{
				"path": "Table/render.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n{#if !loading}\r\n<Table fields=\"{ fields }\" data-source=\"{ dataSource }\"></Table>\r\n{#else}\r\n<Spinner></Spinner>\r\n{/if}\r\n```\r\n\r\n```js\r\n{\r\n\tconfig: function() {\r\n\t\tthis.data.loading = true;\r\n\t\tthis.data.fields = [\r\n\t\t\t{\r\n\t\t\t\tkey: 'picture',\r\n\t\t\t\tlabel: 'Avatar',\r\n\t\t\t\trender: function( v, row ) {\r\n\t\t\t\t\treturn `\r\n\t\t\t\t\t\t<img src=\"${ v.medium }\" style=\"width: 50px;height: 50px;\" />\r\n\t\t\t\t\t`\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tkey: 'name',\r\n\t\t\t\tlabel: 'Name',\r\n\t\t\t\trender: function( v, row ) {\r\n\t\t\t\t\treturn v.first + ' ' + v.last;\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tkey: 'gender',\r\n\t\t\t\tlabel: 'Gender',\r\n\t\t\t\trender: function( v, row ) {\r\n\t\t\t\t\t// if return nothing, this won't override default render function\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tkey: 'email',\r\n\t\t\t\tlabel: 'Email'\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tkey: 'other',\r\n\t\t\t\tlabel: 'Other',\r\n\t\t\t\trender: function( v, row ) {\r\n\t\t\t\t\treturn `\r\n\t\t\t\t\t\t<Note type=\"info\">Hi</Note>\r\n\t\t\t\t\t`;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t];\r\n\r\n\t\tthis.data.dataSource = [];\r\n\r\n\t\tfetch(\r\n\t\t\t`https://randomuser.me/api?results=10&page=1&sortField=&sortOrder=`\r\n\t\t\t)\r\n\t\t\t.then(response => response.json())\r\n\t\t\t.then(json => json.results)\r\n\t\t\t.then(dataSource => {\r\n\t\t\t\tthis.data.dataSource = dataSource;\r\n\t\t\t\tthis.data.loading = false;\r\n\t\t\t\tthis.$update();\r\n\t\t\t})\r\n\t\t\t.catch(e => {\r\n\t\t\t\tthis.data.loading = false;\r\n\t\t\t\tthis.$update();\r\n\t\t\t});\r\n\t}\r\n}\r\n```\r\n\r\n```json\r\n{\"results\":[{\"gender\":\"female\",\"name\":{\"title\":\"mrs\",\"first\":\"مارال\",\"last\":\"حسینی\"},\"location\":{\"street\":\"8123 شهید استاد حسن بنا\",\"city\":\"اصفهان\",\"state\":\"گلستان\",\"postcode\":74410},\"email\":\"مارال.حسینی@example.com\",\"login\":{\"username\":\"silvermouse797\",\"password\":\"erection\",\"salt\":\"O9pXNYG0\",\"md5\":\"cd4226953d0f599870a15602e844d851\",\"sha1\":\"603c11ea9abcb3d7499e2a84be0faacda3f8fb10\",\"sha256\":\"b5bea8f653ca299f12d55a29727ca826fac14292f8fe39117ea5815929a32cd9\"},\"registered\":1089190323,\"dob\":491932027,\"phone\":\"034-20471468\",\"cell\":\"0901-952-7963\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/74.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/74.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/74.jpg\"},\"nat\":\"IR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"رهام\",\"last\":\"نكو نظر\"},\"location\":{\"street\":\"4550 کارگر شمالی\",\"city\":\"دزفول\",\"state\":\"آذربایجان شرقی\",\"postcode\":44202},\"email\":\"رهام.نكونظر@example.com\",\"login\":{\"username\":\"beautifulpanda867\",\"password\":\"crunch\",\"salt\":\"aEKJ3Wiq\",\"md5\":\"71c2badf9f8f7bb483eab646d11d6c42\",\"sha1\":\"bacb518d33adcf6e196c192301d634add64a9d8a\",\"sha256\":\"39877ce3a2b438a9b12ca8afe3c80672ab2be275d7a00fad3e95d44f7ff8077b\"},\"registered\":1270447940,\"dob\":1313037670,\"phone\":\"058-33870714\",\"cell\":\"0948-818-6742\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/78.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/78.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/78.jpg\"},\"nat\":\"IR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"okan\",\"last\":\"çetin\"},\"location\":{\"street\":\"5231 istiklal cd\",\"city\":\"kastamonu\",\"state\":\"trabzon\",\"postcode\":49950},\"email\":\"okan.çetin@example.com\",\"login\":{\"username\":\"heavytiger735\",\"password\":\"edison\",\"salt\":\"0rbePgeW\",\"md5\":\"ba5475ad6ad1f7ca3e528206da8c2074\",\"sha1\":\"d665d539f177b155d2aac588bfce3156d67ed262\",\"sha256\":\"486b61561bb267f77fd284b547fa41ca893cd801611b13bfa71e7de12fb398f0\"},\"registered\":1422514694,\"dob\":426534789,\"phone\":\"(993)-199-2096\",\"cell\":\"(655)-874-0686\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/75.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/75.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/75.jpg\"},\"nat\":\"TR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"cecil\",\"last\":\"gutierrez\"},\"location\":{\"street\":\"8318 spring st\",\"city\":\"shiloh\",\"state\":\"alaska\",\"postcode\":61905},\"email\":\"cecil.gutierrez@example.com\",\"login\":{\"username\":\"smallfrog111\",\"password\":\"latina\",\"salt\":\"0xk1c0zM\",\"md5\":\"991bb9a794598c4dfbf77a8b96cdbd15\",\"sha1\":\"cac03274f4b2b6b2749b95eff27c4d92c63d1698\",\"sha256\":\"4490fe57a270d26d21ccf01f8e7b64a22de79b4add21f5c94b2350e51c9afc72\"},\"registered\":1344963320,\"dob\":323444902,\"phone\":\"(808)-476-1171\",\"cell\":\"(484)-992-9370\",\"id\":{\"name\":\"SSN\",\"value\":\"291-09-7989\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/8.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/8.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/8.jpg\"},\"nat\":\"US\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"tim\",\"last\":\"martin\"},\"location\":{\"street\":\"6292 kirchstraße\",\"city\":\"calw\",\"state\":\"niedersachsen\",\"postcode\":53569},\"email\":\"tim.martin@example.com\",\"login\":{\"username\":\"bigkoala298\",\"password\":\"gene\",\"salt\":\"1CahSlbR\",\"md5\":\"f0b991cfaf4169ae525e774fd1048093\",\"sha1\":\"eaef913e5d64a5b534c0f56fa08d00cc999af61d\",\"sha256\":\"ae544e44364e7ab2833d24dc15225ba11987ca7c2b6665562e94987435e63120\"},\"registered\":1126757827,\"dob\":121287403,\"phone\":\"0526-4379162\",\"cell\":\"0177-8313150\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/36.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/36.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/36.jpg\"},\"nat\":\"DE\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"ege\",\"last\":\"erberk\"},\"location\":{\"street\":\"4361 vatan cd\",\"city\":\"zonguldak\",\"state\":\"kırklareli\",\"postcode\":64223},\"email\":\"ege.erberk@example.com\",\"login\":{\"username\":\"orangeelephant176\",\"password\":\"wwwww\",\"salt\":\"cSFq7txu\",\"md5\":\"2255cf6294aae98ba4cc8d4ab300ca14\",\"sha1\":\"93108f21e13dc825c6ba6467a1472dc7e0f63e06\",\"sha256\":\"fca19f5aad844655171e2e574b0f808c35406064cb12b983ac4679728097a786\"},\"registered\":929546309,\"dob\":129865621,\"phone\":\"(233)-140-0106\",\"cell\":\"(310)-562-3790\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/38.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/38.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/38.jpg\"},\"nat\":\"TR\"},{\"gender\":\"female\",\"name\":{\"title\":\"miss\",\"first\":\"karla\",\"last\":\"schulz\"},\"location\":{\"street\":\"2727 eichenweg\",\"city\":\"müritz\",\"state\":\"berlin\",\"postcode\":25945},\"email\":\"karla.schulz@example.com\",\"login\":{\"username\":\"heavybird803\",\"password\":\"asdfasdf\",\"salt\":\"rnPsxDzO\",\"md5\":\"28276f8c3fcda8cbf710889a147c193b\",\"sha1\":\"7d9b01225278048ab345230e62e674f44947789f\",\"sha256\":\"3d889d897d6482ece9cd242458a83581bf650a87f8d6fa802ad9f9fe8cd54080\"},\"registered\":1353299596,\"dob\":34320999,\"phone\":\"0094-3746940\",\"cell\":\"0177-4280666\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/16.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/16.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/16.jpg\"},\"nat\":\"DE\"},{\"gender\":\"female\",\"name\":{\"title\":\"ms\",\"first\":\"hafida\",\"last\":\"neelen\"},\"location\":{\"street\":\"4994 blauwkapelseweg\",\"city\":\"brunssum\",\"state\":\"flevoland\",\"postcode\":96738},\"email\":\"hafida.neelen@example.com\",\"login\":{\"username\":\"silverduck303\",\"password\":\"ventura\",\"salt\":\"Rlvt4mPb\",\"md5\":\"e6f77452589994534cccd5c8aeeeb840\",\"sha1\":\"e2eb6d343b8c4d38f1e8a89afa038afd557c2033\",\"sha256\":\"e9b22370fc4d970e04b3de2a8eec3653e886a8f2e7075d10567c4392ed4d0963\"},\"registered\":1396166896,\"dob\":942916148,\"phone\":\"(375)-102-6801\",\"cell\":\"(535)-663-1203\",\"id\":{\"name\":\"BSN\",\"value\":\"75856427\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/13.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/13.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/13.jpg\"},\"nat\":\"NL\"},{\"gender\":\"female\",\"name\":{\"title\":\"miss\",\"first\":\"minea\",\"last\":\"linna\"},\"location\":{\"street\":\"5725 hämeenkatu\",\"city\":\"pyhäjoki\",\"state\":\"north karelia\",\"postcode\":26596},\"email\":\"minea.linna@example.com\",\"login\":{\"username\":\"tinyleopard702\",\"password\":\"anita\",\"salt\":\"TlnaTz9W\",\"md5\":\"73939ecd1a7fbd7f023bd05b4fb78145\",\"sha1\":\"7d12f9ecbda6b71e1de81c661f604e02834ff0e6\",\"sha256\":\"e9b16fc40dbc66e8b5140e7ce6e3da70daa0a16dfdef14823d5d96b77a07125e\"},\"registered\":933513648,\"dob\":959444940,\"phone\":\"08-033-158\",\"cell\":\"047-933-30-63\",\"id\":{\"name\":\"HETU\",\"value\":\"30277879-V\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/52.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/52.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/52.jpg\"},\"nat\":\"FI\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"jar\",\"last\":\"roberts\"},\"location\":{\"street\":\"9198 royal ln\",\"city\":\"elizabeth\",\"state\":\"maine\",\"postcode\":75205},\"email\":\"jar.roberts@example.com\",\"login\":{\"username\":\"greenrabbit531\",\"password\":\"callie\",\"salt\":\"DboULZUP\",\"md5\":\"8dd5511c3a9bcca4b78c710b0056bfbf\",\"sha1\":\"61f6f6aa038efbe55a3a81ae7a46145e45798607\",\"sha256\":\"e4a731a9b20714cfad99014e1ee1e209345a633cadee121f476699df5e8eefa7\"},\"registered\":1025041559,\"dob\":1374486617,\"phone\":\"(203)-026-9033\",\"cell\":\"(096)-916-8704\",\"id\":{\"name\":\"SSN\",\"value\":\"879-06-7671\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/61.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/61.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/61.jpg\"},\"nat\":\"US\"}],\"info\":{\"seed\":\"7b99927c9add1d2c\",\"results\":10,\"page\":1,\"version\":\"1.0\"}}\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "{#if !loading}\n<Table fields=\"{ fields }\" data-source=\"{ dataSource }\"></Table>\n{#else}\n<Spinner></Spinner>\n{/if}",
					"js": "{\n    config: function() {\n        this.data.loading = true;\n        this.data.fields = [\n            {\n                key: 'picture',\n                label: 'Avatar',\n                render: function( v, row ) {\n                    return `\n                        <img src=\"${ v.medium }\" style=\"width: 50px;height: 50px;\" />\n                    `\n                }\n            },\n            {\n                key: 'name',\n                label: 'Name',\n                render: function( v, row ) {\n                    return v.first + ' ' + v.last;\n                }\n            },\n            {\n                key: 'gender',\n                label: 'Gender',\n                render: function( v, row ) {\n                    // if return nothing, this won't override default render function\n                }\n            },\n            {\n                key: 'email',\n                label: 'Email'\n            },\n            {\n                key: 'other',\n                label: 'Other',\n                render: function( v, row ) {\n                    return `\n                        <Note type=\"info\">Hi</Note>\n                    `;\n                }\n            }\n        ];\n\n        this.data.dataSource = [];\n\n        fetch(\n            `https://randomuser.me/api?results=10&page=1&sortField=&sortOrder=`\n            )\n            .then(response => response.json())\n            .then(json => json.results)\n            .then(dataSource => {\n                this.data.dataSource = dataSource;\n                this.data.loading = false;\n                this.$update();\n            })\n            .catch(e => {\n                this.data.loading = false;\n                this.$update();\n            });\n    }\n}",
					"json": "{\"results\":[{\"gender\":\"female\",\"name\":{\"title\":\"mrs\",\"first\":\"مارال\",\"last\":\"حسینی\"},\"location\":{\"street\":\"8123 شهید استاد حسن بنا\",\"city\":\"اصفهان\",\"state\":\"گلستان\",\"postcode\":74410},\"email\":\"مارال.حسینی@example.com\",\"login\":{\"username\":\"silvermouse797\",\"password\":\"erection\",\"salt\":\"O9pXNYG0\",\"md5\":\"cd4226953d0f599870a15602e844d851\",\"sha1\":\"603c11ea9abcb3d7499e2a84be0faacda3f8fb10\",\"sha256\":\"b5bea8f653ca299f12d55a29727ca826fac14292f8fe39117ea5815929a32cd9\"},\"registered\":1089190323,\"dob\":491932027,\"phone\":\"034-20471468\",\"cell\":\"0901-952-7963\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/74.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/74.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/74.jpg\"},\"nat\":\"IR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"رهام\",\"last\":\"نكو نظر\"},\"location\":{\"street\":\"4550 کارگر شمالی\",\"city\":\"دزفول\",\"state\":\"آذربایجان شرقی\",\"postcode\":44202},\"email\":\"رهام.نكونظر@example.com\",\"login\":{\"username\":\"beautifulpanda867\",\"password\":\"crunch\",\"salt\":\"aEKJ3Wiq\",\"md5\":\"71c2badf9f8f7bb483eab646d11d6c42\",\"sha1\":\"bacb518d33adcf6e196c192301d634add64a9d8a\",\"sha256\":\"39877ce3a2b438a9b12ca8afe3c80672ab2be275d7a00fad3e95d44f7ff8077b\"},\"registered\":1270447940,\"dob\":1313037670,\"phone\":\"058-33870714\",\"cell\":\"0948-818-6742\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/78.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/78.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/78.jpg\"},\"nat\":\"IR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"okan\",\"last\":\"çetin\"},\"location\":{\"street\":\"5231 istiklal cd\",\"city\":\"kastamonu\",\"state\":\"trabzon\",\"postcode\":49950},\"email\":\"okan.çetin@example.com\",\"login\":{\"username\":\"heavytiger735\",\"password\":\"edison\",\"salt\":\"0rbePgeW\",\"md5\":\"ba5475ad6ad1f7ca3e528206da8c2074\",\"sha1\":\"d665d539f177b155d2aac588bfce3156d67ed262\",\"sha256\":\"486b61561bb267f77fd284b547fa41ca893cd801611b13bfa71e7de12fb398f0\"},\"registered\":1422514694,\"dob\":426534789,\"phone\":\"(993)-199-2096\",\"cell\":\"(655)-874-0686\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/75.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/75.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/75.jpg\"},\"nat\":\"TR\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"cecil\",\"last\":\"gutierrez\"},\"location\":{\"street\":\"8318 spring st\",\"city\":\"shiloh\",\"state\":\"alaska\",\"postcode\":61905},\"email\":\"cecil.gutierrez@example.com\",\"login\":{\"username\":\"smallfrog111\",\"password\":\"latina\",\"salt\":\"0xk1c0zM\",\"md5\":\"991bb9a794598c4dfbf77a8b96cdbd15\",\"sha1\":\"cac03274f4b2b6b2749b95eff27c4d92c63d1698\",\"sha256\":\"4490fe57a270d26d21ccf01f8e7b64a22de79b4add21f5c94b2350e51c9afc72\"},\"registered\":1344963320,\"dob\":323444902,\"phone\":\"(808)-476-1171\",\"cell\":\"(484)-992-9370\",\"id\":{\"name\":\"SSN\",\"value\":\"291-09-7989\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/8.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/8.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/8.jpg\"},\"nat\":\"US\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"tim\",\"last\":\"martin\"},\"location\":{\"street\":\"6292 kirchstraße\",\"city\":\"calw\",\"state\":\"niedersachsen\",\"postcode\":53569},\"email\":\"tim.martin@example.com\",\"login\":{\"username\":\"bigkoala298\",\"password\":\"gene\",\"salt\":\"1CahSlbR\",\"md5\":\"f0b991cfaf4169ae525e774fd1048093\",\"sha1\":\"eaef913e5d64a5b534c0f56fa08d00cc999af61d\",\"sha256\":\"ae544e44364e7ab2833d24dc15225ba11987ca7c2b6665562e94987435e63120\"},\"registered\":1126757827,\"dob\":121287403,\"phone\":\"0526-4379162\",\"cell\":\"0177-8313150\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/36.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/36.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/36.jpg\"},\"nat\":\"DE\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"ege\",\"last\":\"erberk\"},\"location\":{\"street\":\"4361 vatan cd\",\"city\":\"zonguldak\",\"state\":\"kırklareli\",\"postcode\":64223},\"email\":\"ege.erberk@example.com\",\"login\":{\"username\":\"orangeelephant176\",\"password\":\"wwwww\",\"salt\":\"cSFq7txu\",\"md5\":\"2255cf6294aae98ba4cc8d4ab300ca14\",\"sha1\":\"93108f21e13dc825c6ba6467a1472dc7e0f63e06\",\"sha256\":\"fca19f5aad844655171e2e574b0f808c35406064cb12b983ac4679728097a786\"},\"registered\":929546309,\"dob\":129865621,\"phone\":\"(233)-140-0106\",\"cell\":\"(310)-562-3790\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/38.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/38.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/38.jpg\"},\"nat\":\"TR\"},{\"gender\":\"female\",\"name\":{\"title\":\"miss\",\"first\":\"karla\",\"last\":\"schulz\"},\"location\":{\"street\":\"2727 eichenweg\",\"city\":\"müritz\",\"state\":\"berlin\",\"postcode\":25945},\"email\":\"karla.schulz@example.com\",\"login\":{\"username\":\"heavybird803\",\"password\":\"asdfasdf\",\"salt\":\"rnPsxDzO\",\"md5\":\"28276f8c3fcda8cbf710889a147c193b\",\"sha1\":\"7d9b01225278048ab345230e62e674f44947789f\",\"sha256\":\"3d889d897d6482ece9cd242458a83581bf650a87f8d6fa802ad9f9fe8cd54080\"},\"registered\":1353299596,\"dob\":34320999,\"phone\":\"0094-3746940\",\"cell\":\"0177-4280666\",\"id\":{\"name\":\"\",\"value\":null},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/16.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/16.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/16.jpg\"},\"nat\":\"DE\"},{\"gender\":\"female\",\"name\":{\"title\":\"ms\",\"first\":\"hafida\",\"last\":\"neelen\"},\"location\":{\"street\":\"4994 blauwkapelseweg\",\"city\":\"brunssum\",\"state\":\"flevoland\",\"postcode\":96738},\"email\":\"hafida.neelen@example.com\",\"login\":{\"username\":\"silverduck303\",\"password\":\"ventura\",\"salt\":\"Rlvt4mPb\",\"md5\":\"e6f77452589994534cccd5c8aeeeb840\",\"sha1\":\"e2eb6d343b8c4d38f1e8a89afa038afd557c2033\",\"sha256\":\"e9b22370fc4d970e04b3de2a8eec3653e886a8f2e7075d10567c4392ed4d0963\"},\"registered\":1396166896,\"dob\":942916148,\"phone\":\"(375)-102-6801\",\"cell\":\"(535)-663-1203\",\"id\":{\"name\":\"BSN\",\"value\":\"75856427\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/13.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/13.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/13.jpg\"},\"nat\":\"NL\"},{\"gender\":\"female\",\"name\":{\"title\":\"miss\",\"first\":\"minea\",\"last\":\"linna\"},\"location\":{\"street\":\"5725 hämeenkatu\",\"city\":\"pyhäjoki\",\"state\":\"north karelia\",\"postcode\":26596},\"email\":\"minea.linna@example.com\",\"login\":{\"username\":\"tinyleopard702\",\"password\":\"anita\",\"salt\":\"TlnaTz9W\",\"md5\":\"73939ecd1a7fbd7f023bd05b4fb78145\",\"sha1\":\"7d12f9ecbda6b71e1de81c661f604e02834ff0e6\",\"sha256\":\"e9b16fc40dbc66e8b5140e7ce6e3da70daa0a16dfdef14823d5d96b77a07125e\"},\"registered\":933513648,\"dob\":959444940,\"phone\":\"08-033-158\",\"cell\":\"047-933-30-63\",\"id\":{\"name\":\"HETU\",\"value\":\"30277879-V\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/women/52.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/women/52.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/women/52.jpg\"},\"nat\":\"FI\"},{\"gender\":\"male\",\"name\":{\"title\":\"mr\",\"first\":\"jar\",\"last\":\"roberts\"},\"location\":{\"street\":\"9198 royal ln\",\"city\":\"elizabeth\",\"state\":\"maine\",\"postcode\":75205},\"email\":\"jar.roberts@example.com\",\"login\":{\"username\":\"greenrabbit531\",\"password\":\"callie\",\"salt\":\"DboULZUP\",\"md5\":\"8dd5511c3a9bcca4b78c710b0056bfbf\",\"sha1\":\"61f6f6aa038efbe55a3a81ae7a46145e45798607\",\"sha256\":\"e4a731a9b20714cfad99014e1ee1e209345a633cadee121f476699df5e8eefa7\"},\"registered\":1025041559,\"dob\":1374486617,\"phone\":\"(203)-026-9033\",\"cell\":\"(096)-916-8704\",\"id\":{\"name\":\"SSN\",\"value\":\"879-06-7671\"},\"picture\":{\"large\":\"https://randomuser.me/api/portraits/men/61.jpg\",\"medium\":\"https://randomuser.me/api/portraits/med/men/61.jpg\",\"thumbnail\":\"https://randomuser.me/api/portraits/thumb/men/61.jpg\"},\"nat\":\"US\"}],\"info\":{\"seed\":\"7b99927c9add1d2c\",\"results\":10,\"page\":1,\"version\":\"1.0\"}}"
				},
				"id": 34
			},
			{
				"path": "Table/interaction.md",
				"attrs": {
					"order": 2
				},
				"source": "\r\nHaving some event to handle? use raw TR and TD instead\r\n\r\n```html\r\n<Table fields=\"{ fields }\">\r\n\t{#list dataSource as ds}\r\n\t<TR>\r\n\t\t<TD>{ ds.name }</TD>\r\n\t\t<TD>{ ds.email }</TD>\r\n\t\t<TD>\r\n\t\t\t<Button primary sm on-click=\"{ this.onClick( ds ) }\">Modify</Button>\r\n\t\t</TD>\r\n\t</TR>\r\n\t{/list}\r\n</Table>\r\n```\r\n\r\n```js\r\n{\r\n\tconfig: function() {\r\n\t\tthis.data.fields = [\r\n\t\t\t{\r\n\t\t\t\tlabel: 'Name'\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tlabel: 'Email'\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tlabel: 'Operation'\r\n\t\t\t}\r\n\t\t];\r\n\r\n\t\tthis.data.dataSource = [\r\n\t\t\t{\r\n\t\t\t\tname: 'Jim',\r\n\t\t\t\temail: 'jim@example.com'\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tname: 'Mike',\r\n\t\t\t\temail: 'mike@example.com'\r\n\t\t\t},\r\n\t\t\t{\r\n\t\t\t\tname: 'Sam',\r\n\t\t\t\temail: 'sam@example.com'\r\n\t\t\t}\r\n\t\t]\r\n\t},\r\n\tonClick: function( v ) {\r\n\t\tPure.note( 'you clicked ' + v.name, 'info', 1000 );\r\n\t}\r\n}\r\n```\r\n",
				"html": "<p>Having some event to handle? use raw TR and TD instead</p>\n",
				"code": {
					"html": "<Table fields=\"{ fields }\">\n    {#list dataSource as ds}\n    <TR>\n        <TD>{ ds.name }</TD>\n        <TD>{ ds.email }</TD>\n        <TD>\n            <Button primary sm on-click=\"{ this.onClick( ds ) }\">Modify</Button>\n        </TD>\n    </TR>\n    {/list}\n</Table>",
					"js": "{\n    config: function() {\n        this.data.fields = [\n            {\n                label: 'Name'\n            },\n            {\n                label: 'Email'\n            },\n            {\n                label: 'Operation'\n            }\n        ];\n\n        this.data.dataSource = [\n            {\n                name: 'Jim',\n                email: 'jim@example.com'\n            },\n            {\n                name: 'Mike',\n                email: 'mike@example.com'\n            },\n            {\n                name: 'Sam',\n                email: 'sam@example.com'\n            }\n        ]\n    },\n    onClick: function( v ) {\n        Pure.note( 'you clicked ' + v.name, 'info', 1000 );\n    }\n}"
				},
				"id": 33
			}
		],
		"Textarea": [
			{
				"path": "Textarea/basic.md",
				"attrs": {
					"order": 1
				},
				"source": "\r\nBasic Usage\r\n\r\n```html\r\n<Textarea></Textarea>\r\n```\r\n",
				"html": "<p>Basic Usage</p>\n",
				"code": {
					"html": "<Textarea></Textarea>"
				},
				"id": 35
			}
		]
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ElementTree0 = {
	    config: function config() {
	        this.data.source = [{
	            name: 'head',
	            children: [{
	                name: 'meta',
	                attrs: {
	                    charset: 'utf-8'
	                }
	            }]
	        }, {
	            name: 'body',
	            children: [{
	                name: 'div',
	                attrs: {
	                    id: 'app',
	                    class: 'app'
	                },
	                children: [{
	                    name: 'h1',
	                    attrs: {
	                        class: 'title'
	                    }
	                }, {
	                    name: 'div',
	                    attrs: {
	                        class: 'content'
	                    }
	                }]
	            }, {
	                name: 'script',
	                attrs: {
	                    type: 'text/javascript',
	                    src: "../app.js"
	                }
	            }]
	        }];
	    },
	    onSelect: function onSelect(node) {
	        this.data.selected = node;
	        this.$update();
	    }
	};
	var Note1 = {
	    onShowNote: function onShowNote() {
	        var i = Math.floor(Math.random() * 10 % 4);
	        var types = 'info success warning danger'.split(' ');
	        var type = types[i];

	        Pure.note("Hey there ;)", type);
	    }
	};
	var Table0 = {
	    config: function config() {
	        var _this = this;

	        this.data.loading = true;
	        this.data.fields = [{
	            key: 'picture',
	            label: 'Avatar',
	            render: function render(v, row) {
	                return '\n                        <img src="' + v.medium + '" style="width: 50px;height: 50px;" />\n                    ';
	            }
	        }, {
	            key: 'name',
	            label: 'Name',
	            render: function render(v, row) {
	                return v.first + ' ' + v.last;
	            }
	        }, {
	            key: 'gender',
	            label: 'Gender',
	            render: function render(v, row) {
	                // if return nothing, this won't override default render function
	            }
	        }, {
	            key: 'email',
	            label: 'Email'
	        }, {
	            key: 'other',
	            label: 'Other',
	            render: function render(v, row) {
	                return '\n                        <Note type="info">Hi</Note>\n                    ';
	            }
	        }];

	        this.data.dataSource = [];

	        fetch('https://randomuser.me/api?results=10&page=1&sortField=&sortOrder=').then(function (response) {
	            return response.json();
	        }).then(function (json) {
	            return json.results;
	        }).then(function (dataSource) {
	            _this.data.dataSource = dataSource;
	            _this.data.loading = false;
	            _this.$update();
	        }).catch(function (e) {
	            _this.data.loading = false;
	            _this.$update();
	        });
	    }
	};
	var Table1 = {
	    config: function config() {
	        this.data.fields = [{
	            label: 'Name'
	        }, {
	            label: 'Email'
	        }, {
	            label: 'Operation'
	        }];

	        this.data.dataSource = [{
	            name: 'Jim',
	            email: 'jim@example.com'
	        }, {
	            name: 'Mike',
	            email: 'mike@example.com'
	        }, {
	            name: 'Sam',
	            email: 'sam@example.com'
	        }];
	    },
	    onClick: function onClick(v) {
	        Pure.note('you clicked ' + v.name, 'info', 1000);
	    }
	};
	exports.default = { "Box": [void 0], "Breadcrumb": [void 0], "Button": [void 0, void 0, void 0, void 0], "Checkbox": [void 0, void 0, void 0], "Countdown": [void 0, void 0, void 0, void 0], "ElementTree": [ElementTree0], "Form": [void 0, void 0, void 0], "Icon": [void 0], "Input": [void 0, void 0, void 0, void 0, void 0], "Modal": [void 0], "Note": [void 0, Note1], "Pagination": [void 0], "Radio": [void 0, void 0, void 0], "Spinner": [void 0], "Switch": [void 0, void 0], "Table": [Table0, Table1], "Textarea": [void 0] };

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = [{"type":"element","tag":"header","attrs":[{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[{"type":"text","text":"\n\t"},{"type":"element","tag":"a","attrs":[{"type":"attribute","name":"class","value":"logo"},{"type":"attribute","name":"href","value":"#/"},{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[{"type":"text","text":"Pure"}]},{"type":"text","text":"\n"}]},{"type":"text","text":"\n"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"wrapper"},{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[{"type":"text","text":"\n\t"},{"type":"element","tag":"Nav","attrs":[{"type":"attribute","name":"active","value":{"type":"expression","body":"c._sg_('active', d, e)","constant":false,"setbody":"c._ss_('active',p_,d, '=', 1)"}},{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[]},{"type":"text","text":"\n\t"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"docs"},{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[{"type":"text","text":"\n\t\t"},{"type":"list","sequence":{"type":"expression","body":"c._sg_('doc', d, e)","constant":false,"setbody":"c._ss_('doc',p_,d, '=', 1)"},"alternate":[],"variable":"d","body":[{"type":"text","text":"\n\t\t"},{"type":"element","tag":"Demo","attrs":[{"type":"attribute","name":"rgl","value":{"type":"expression","body":"c._sg_('html', c._sg_('code', c._sg_('d', d, e)))","constant":false,"setbody":"c._ss_('html',p_,c._sg_('code', c._sg_('d', d, e)), '=', 0)"}},{"type":"attribute","name":"js","value":{"type":"expression","body":"c._sg_('js', c._sg_('code', c._sg_('d', d, e)))","constant":false,"setbody":"c._ss_('js',p_,c._sg_('code', c._sg_('d', d, e)), '=', 0)"}},{"type":"attribute","name":"markdown","value":{"type":"expression","body":"c._sg_('html', c._sg_('d', d, e))","constant":false,"setbody":"c._ss_('html',p_,c._sg_('d', d, e), '=', 0)"}},{"type":"attribute","name":"mixin","value":{"type":"expression","body":"c._sg_(c._sg_('d_index', d, e), c._sg_(c._sg_('active', d, e), c._sg_('mixins', d, e)))","constant":false,"setbody":"c._ss_(c._sg_('d_index', d, e),p_,c._sg_(c._sg_('active', d, e), c._sg_('mixins', d, e)), '=', 0)"}},{"type":"attribute","name":"_r-4a77fa04","value":""}],"children":[]},{"type":"text","text":"\n\t\t"}]},{"type":"text","text":"\n\n\t\t\n\t\t\n\t"}]},{"type":"text","text":"\n"}]}]

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _docs = __webpack_require__(23);

	var _docs2 = _interopRequireDefault(_docs);

	var _dispatcher = __webpack_require__(21);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		'/': function _() {
			return _dispatcher2.default.emit('update', _docs2.default.Button, 'Button');
		},
		'/Button': function Button() {
			return _dispatcher2.default.emit('update', _docs2.default.Button, 'Button');
		},
		'/Pagination': function Pagination() {
			return _dispatcher2.default.emit('update', _docs2.default.Pagination, 'Pagination');
		},
		'/Input': function Input() {
			return _dispatcher2.default.emit('update', _docs2.default.Input, 'Input');
		},
		'/Textarea': function Textarea() {
			return _dispatcher2.default.emit('update', _docs2.default.Textarea, 'Textarea');
		},
		'/Radio': function Radio() {
			return _dispatcher2.default.emit('update', _docs2.default.Radio, 'Radio');
		},
		'/Checkbox': function Checkbox() {
			return _dispatcher2.default.emit('update', _docs2.default.Checkbox, 'Checkbox');
		},
		'/Switch': function Switch() {
			return _dispatcher2.default.emit('update', _docs2.default.Switch, 'Switch');
		},
		'/Modal': function Modal() {
			return _dispatcher2.default.emit('update', _docs2.default.Modal, 'Modal');
		},
		'/Form': function Form() {
			return _dispatcher2.default.emit('update', _docs2.default.Form, 'Form');
		},
		'/Spinner': function Spinner() {
			return _dispatcher2.default.emit('update', _docs2.default.Spinner, 'Spinner');
		},
		'/Icon': function Icon() {
			return _dispatcher2.default.emit('update', _docs2.default.Icon, 'Icon');
		},
		'/Note': function Note() {
			return _dispatcher2.default.emit('update', _docs2.default.Note, 'Note');
		},
		'/Countdown': function Countdown() {
			return _dispatcher2.default.emit('update', _docs2.default.Countdown, 'Countdown');
		},
		'/Table': function Table() {
			return _dispatcher2.default.emit('update', _docs2.default.Table, 'Table');
		},
		'/Breadcrumb': function Breadcrumb() {
			return _dispatcher2.default.emit('update', _docs2.default.Breadcrumb, 'Breadcrumb');
		},
		'/Box': function Box() {
			return _dispatcher2.default.emit('update', _docs2.default.Box, 'Box');
		},
		'/ElementTree': function ElementTree() {
			return _dispatcher2.default.emit('update', _docs2.default.ElementTree, 'ElementTree');
		}
	};

/***/ }
/******/ ]);