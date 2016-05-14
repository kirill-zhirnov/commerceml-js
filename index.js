var ImportParser = require('./lib/importParser'),
	OffersParser = require('./lib/offersParser'),
	OrdersParser = require('./lib/ordersParser')
;

module.exports.createStream = function(type) {
	var parser;

	switch (type) {
		case 'import':
			parser = new ImportParser();
			break;

		case 'offers':
			parser = new OffersParser();
			break;

		case 'orders':
			parser = new OrdersParser();
			break;

		default:
			throw new Error("Unknown type '" + type + "'.");
	}

	return parser.createStream();
};
