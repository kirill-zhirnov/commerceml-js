(function() {
  var Parser, X2JS, _, expat;

  _ = require('underscore');

  expat = require('node-expat');

  X2JS = require('x2js');

  Parser = (function() {
    function Parser(options) {
      if (options == null) {
        options = {};
      }
      this.parser = null;
      this.position = [];
      this.openTag = null;
      this.collect = null;
      this.xml = '';
      this.collectCurrentNode = false;
      this.collectOpenTags = [];
    }

    Parser.prototype.createStream = function() {
      this.parser = new expat.Parser('UTF-8');
      this.parser.on("startElement", (function(_this) {
        return function() {
          return _this.onOpenTag.apply(_this, arguments);
        };
      })(this));
      this.parser.on("endElement", (function(_this) {
        return function() {
          return _this.onCloseTag.apply(_this, arguments);
        };
      })(this));
      this.parser.on("text", (function(_this) {
        return function() {
          return _this.onText.apply(_this, arguments);
        };
      })(this));
      return this.parser;
    };

    Parser.prototype.onOpenTag = function(nodeName, nodeAttrs) {
      var collectRules, key, props, val;
      this.position.push(nodeName);
      this.openTag = nodeName;
      this.collectCurrentNode = false;
      collectRules = this.getCollectRules();
      for (key in collectRules) {
        props = collectRules[key];
        if (this.isPositionEq(props.start)) {
          this.startCollect(key);
        }
      }
      if (this.collect && this.shallCollect()) {
        this.collectCurrentNode = true;
        this.xml += "<" + nodeName;
        this.collectOpenTags.push(nodeName);
        if (nodeAttrs && _.isObject(nodeAttrs)) {
          for (key in nodeAttrs) {
            val = nodeAttrs[key];
            this.xml += " " + key + "=\"" + val + "\"";
          }
        }
        return this.xml += ">";
      }
    };

    Parser.prototype.shallCollect = function() {
      var j, key, len, position, props, ref, ref1;
      ref = this.getCollectRules();
      for (key in ref) {
        props = ref[key];
        if (this.isPositionEq(props.start)) {
          return true;
        }
        if ('include' in props && _.isArray(props.include)) {
          ref1 = props.include;
          for (j = 0, len = ref1.length; j < len; j++) {
            position = ref1[j];
            if (this.isPositionEq(position, 'begin')) {
              return true;
            }
          }
        }
      }
      return false;
    };

    Parser.prototype.startCollect = function(key) {
      if (this.collect) {
        this.emitCollected();
      }
      return this.collect = key;
    };

    Parser.prototype.emitCollected = function() {
      var i, j, ref, x2js;
      if (this.collectOpenTags.length > 0) {
        for (i = j = ref = this.collectOpenTags.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
          this.xml += "</" + this.collectOpenTags[i] + ">";
        }
      }
      x2js = new X2JS();
      this.parser.emit(this.collect, x2js.xml2js(this.xml));
      this.collectOpenTags = [];
      this.collect = null;
      return this.xml = '';
    };

    Parser.prototype.onText = function(text) {
      if (this.openTag && this.collectCurrentNode) {
        return this.xml += text;
      }
    };

    Parser.prototype.onCloseTag = function(nodeName) {
      var rules;
      if (this.collect) {
        if (this.shallCollect()) {
          this.xml += "</" + nodeName + ">";
          this.reduceLastPosition(this.collectOpenTags);
        }
        rules = this.getCollectRules();
        if (this.isPositionEq(rules[this.collect].start)) {
          this.emitCollected();
        }
      }
      this.reduceLastPosition(this.position);
      this.collectCurrentNode = false;
      return this.openTag = null;
    };

    Parser.prototype.reduceLastPosition = function(position) {
      var lastIndex;
      lastIndex = position.length - 1;
      return position.splice(lastIndex, 1);
    };

    Parser.prototype.getJoinedPosition = function() {
      return this.position.join('/');
    };

    Parser.prototype.isPositionEq = function(position, mode) {
      var i, item, j, len;
      if (mode == null) {
        mode = 'eq';
      }
      switch (mode) {
        case 'eq':
          if (position.length !== this.position.length) {
            return false;
          }
          break;
        case 'begin':
          if (this.position.length < position.length) {
            return false;
          }
      }
      for (i = j = 0, len = position.length; j < len; i = ++j) {
        item = position[i];
        if (item !== this.position[i]) {
          return false;
        }
      }
      return true;
    };

    Parser.prototype.getCollectRules = function() {
      return {};
    };

    Parser.prototype.pause = function() {
      return this.parser.stop();
    };

    Parser.prototype.resume = function() {
      return this.parser.resume();
    };

    return Parser;

  })();

  module.exports = Parser;

}).call(this);
