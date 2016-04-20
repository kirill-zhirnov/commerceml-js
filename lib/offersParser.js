(function() {
  var CommerceMlParser, OffersParser, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CommerceMlParser = require('./parser');

  _ = require('underscore');

  OffersParser = (function(superClass) {
    extend(OffersParser, superClass);

    function OffersParser() {
      return OffersParser.__super__.constructor.apply(this, arguments);
    }

    OffersParser.prototype.getCollectRules = function() {
      return {
        commercialInfo: {
          start: ['КоммерческаяИнформация']
        },
        packageOffers: {
          start: ['КоммерческаяИнформация', 'ПакетПредложений'],
          include: [['КоммерческаяИнформация', 'ПакетПредложений', 'Ид'], ['КоммерческаяИнформация', 'ПакетПредложений', 'Наименование'], ['КоммерческаяИнформация', 'ПакетПредложений', 'ИдКаталога'], ['КоммерческаяИнформация', 'ПакетПредложений', 'ИдКлассификатора'], ['КоммерческаяИнформация', 'ПакетПредложений', 'Владелец'], ['КоммерческаяИнформация', 'ПакетПредложений', 'ТипыЦен']]
        },
        offer: {
          start: ['КоммерческаяИнформация', 'ПакетПредложений', 'Предложения', 'Предложение'],
          include: [['КоммерческаяИнформация', 'ПакетПредложений', 'Предложения', 'Предложение']]
        }
      };
    };

    return OffersParser;

  })(CommerceMlParser);

  module.exports = OffersParser;

}).call(this);
