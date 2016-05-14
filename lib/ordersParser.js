(function() {
  var CommerceMlParser, OrdersParser, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CommerceMlParser = require('./parser');

  _ = require('underscore');

  OrdersParser = (function(superClass) {
    extend(OrdersParser, superClass);

    function OrdersParser() {
      return OrdersParser.__super__.constructor.apply(this, arguments);
    }

    OrdersParser.prototype.getCollectRules = function() {
      return {
        commercialInfo: {
          start: ['КоммерческаяИнформация']
        },
        document: {
          start: ['КоммерческаяИнформация', 'Документ'],
          include: [['КоммерческаяИнформация', 'Документ']]
        }
      };
    };

    return OrdersParser;

  })(CommerceMlParser);

  module.exports = OrdersParser;

}).call(this);
