_ = require 'underscore'
sax = require 'sax'
X2JS = require 'x2js'
entities = require 'entities'

class Parser
	constructor : (options = {}) ->
		@parser = null

		@position = []
		@openTag = null
		@collect = null
		@xml = ''
		@collectCurrentNode = false
		@collectOpenTags = []

	createStream : ->
		@parser = sax.createStream true, {
			trim : true
			normalize : true
		}

		@parser.on "opentag", () =>
			@onOpenTag.apply @, arguments

		@parser.on "closetag", () =>
			@onCloseTag.apply @, arguments

		@parser.on "text", () =>
			@onText.apply @, arguments

		return @parser

	onOpenTag : (tag) ->
		nodeName = tag.name
		nodeAttrs = tag.attributes

		@position.push nodeName
		@openTag = nodeName
		@collectCurrentNode = false

		collectRules = @getCollectRules()

		for key,props of collectRules
			if @isPositionEq(props.start)
				@startCollect key

		if @collect && @shallCollect()
			@collectCurrentNode = true
			@xml += "<#{nodeName}"
			@collectOpenTags.push nodeName

			if nodeAttrs && _.isObject(nodeAttrs)
				for key, val of nodeAttrs
					@xml += " #{key}=\"#{val}\""

			@xml += ">"

	shallCollect : () ->
		for key, props of @getCollectRules()
			if @isPositionEq(props.start)
				return true

			if 'include' of props && _.isArray(props.include)
				for position in props.include
					if @isPositionEq(position, 'begin')
						return true

		return false

	startCollect : (key) ->
		if @collect
			@emitCollected()

		@collect = key

	emitCollected : ->
		if @collectOpenTags.length > 0
			for i in [(@collectOpenTags.length - 1)..0]
				@xml += "</#{@collectOpenTags[i]}>"

		x2js = new X2JS()
		@parser.emit @collect, x2js.xml2js(@xml)

		@collectOpenTags = []
		@collect = null
		@xml = ''

	onText : (text) ->
		if @openTag && @collectCurrentNode
			@xml += entities.encodeXML text

	onCloseTag : (nodeName) ->
		if @collect
			if @shallCollect()
				@xml += "</#{nodeName}>"
				@reduceLastPosition @collectOpenTags

			rules = @getCollectRules()
			if @isPositionEq(rules[@collect].start)
				@emitCollected()

		@reduceLastPosition @position

		@collectCurrentNode = false
		@openTag = null

	reduceLastPosition : (position) ->
		lastIndex = position.length - 1
		position.splice lastIndex, 1

	getJoinedPosition : ->
		return @position.join('/')

	isPositionEq : (position, mode = 'eq') ->
		switch mode
			when 'eq'
				if position.length != @position.length
					return false

			when 'begin'
				if @position.length < position.length
					return false

		for item, i in position
			if item != @position[i]
				return false

		return true

	getCollectRules : ->
		return {}

module.exports = Parser