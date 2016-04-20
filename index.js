var ImportParser = require('./lib/importParser'),
	OffersParser = require('./lib/offersParser')
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

		default:
			throw new Error("Unknown type '" + type + "'.");
	}

	return parser.createStream();
};
