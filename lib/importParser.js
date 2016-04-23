(function() {
  var CommerceMlParser, ImportParser, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CommerceMlParser = require('./parser');

  _ = require('underscore');

  ImportParser = (function(superClass) {
    extend(ImportParser, superClass);

    function ImportParser() {
      return ImportParser.__super__.constructor.apply(this, arguments);
    }

    ImportParser.prototype.getCollectRules = function() {
      return {
        commercialInfo: {
          start: ['КоммерческаяИнформация']
        },
        classifier: {
          start: ['КоммерческаяИнформация', 'Классификатор'],
          include: [['КоммерческаяИнформация', 'Классификатор', 'Ид'], ['КоммерческаяИнформация', 'Классификатор', 'Наименование'], ['КоммерческаяИнформация', 'Классификатор', 'Владелец']]
        },
        classifierGroup: {
          start: ['КоммерческаяИнформация', 'Классификатор', 'Группы', 'Группа'],
          include: [['КоммерческаяИнформация', 'Классификатор', 'Группы', 'Группа']]
        },
        classifierProperty: {
          start: ['КоммерческаяИнформация', 'Классификатор', 'Свойства', 'Свойство'],
          include: [['КоммерческаяИнформация', 'Классификатор', 'Свойства', 'Свойство']]
        },
        catalog: {
          start: ['КоммерческаяИнформация', 'Каталог'],
          include: [['КоммерческаяИнформация', 'Каталог', 'Ид'], ['КоммерческаяИнформация', 'Каталог', 'ИдКлассификатора'], ['КоммерческаяИнформация', 'Каталог', 'Наименование'], ['КоммерческаяИнформация', 'Каталог', 'Владелец']]
        },
        product: {
          start: ['КоммерческаяИнформация', 'Каталог', 'Товары', 'Товар'],
          include: [['КоммерческаяИнформация', 'Каталог', 'Товары', 'Товар']]
        }
      };
    };

    return ImportParser;

  })(CommerceMlParser);

  module.exports = ImportParser;

}).call(this);
