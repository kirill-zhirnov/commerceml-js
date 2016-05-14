CommerceMlParser = require './parser'
_ = require 'underscore'

class OrdersParser extends CommerceMlParser
	getCollectRules : ->
		return {
			commercialInfo :
				start : ['КоммерческаяИнформация']

			document :
				start : ['КоммерческаяИнформация', 'Документ']
				include : [
					['КоммерческаяИнформация', 'Документ']
				]
		}

module.exports = OrdersParser