// Generated by CoffeeScript 1.7.1
(function() {
  var CastAway, EventEmitter, MediaControls, Session,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  EventEmitter = require('./event_emitter');

  Session = require('./session');

  MediaControls = require('./media_controls');

  CastAway = (function(_super) {
    __extends(CastAway, _super);

    function CastAway(_arg) {
      var _ref;
      _ref = _arg != null ? _arg : {}, this.applicationID = _ref.applicationID, this.namespace = _ref.namespace;
      if (!chrome.cast) {
        throw "chrome.cast namespace not found";
      }
      this.cast = chrome.cast;
    }

    CastAway.prototype.initialize = function(callbacks) {
      this.callbacks = callbacks;
      return window['__onGCastApiAvailable'] = (function(_this) {
        return function(loaded, errorInfo) {
          var apiConfig, app, error, sessionRequest, success;
          if (loaded) {
            app = _this.applicationID || _this.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
            sessionRequest = new _this.cast.SessionRequest(app);
            apiConfig = new _this.cast.ApiConfig(sessionRequest, function() {
              var data;
              data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.sessionListener.apply(_this, data);
            }, function() {
              var data;
              data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.receiverListener.apply(_this, data);
            });
            success = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return typeof callbacks.success === "function" ? callbacks.success.apply(callbacks, args) : void 0;
            };
            error = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return typeof callbacks.error === "function" ? callbacks.error.apply(callbacks, args) : void 0;
            };
            return _this.cast.initialize(apiConfig, success, error);
          }
        };
      })(this);
    };

    CastAway.prototype.sessionListener = function(session) {
      if (session.media.length !== 0) {
        this.currentSession = session;
        this.emit('existingMediaFound', new Session(this.currentSession), new MediaControls(this.currentSession.media[0]));
        return session.addUpdateListener(this.sessionUpdateListener);
      }
    };

    CastAway.prototype.receiverListener = function(receiver) {
      var available, state;
      available = this.cast.ReceiverAvailability.AVAILABLE;
      state = receiver === available ? 'available' : 'unavailable';
      return this.emit("receivers:" + state);
    };

    CastAway.prototype.sessionUpdateListener = function(isAlive) {
      if (!isAlive) {
        return this.currentSession = null;
      }
    };

    CastAway.prototype.requestSession = function(callbacks) {
      return this.cast.requestSession(function(session) {
        return typeof callbacks.success === "function" ? callbacks.success(new Session(session)) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof callbacks.error === "function" ? callbacks.error(__slice.call(args)) : void 0;
      });
    };

    return CastAway;

  })(EventEmitter);

  window.CastAway = CastAway;

}).call(this);