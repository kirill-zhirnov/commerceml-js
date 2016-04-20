_ = require 'underscore'
sax = require 'sax'
X2JS = require 'x2js'

class Parser
	constructor : (options = {}) ->
		@saxStream = null

		@position = []
		@openTag = null
		@collect = null
		@xml = ''
		@collectCurrentNode = false
		@collectOpenTags = []

	createStream : ->
		@saxStream = require("sax").createStream(true)

		@saxStream.on "opentag", () =>
			@onOpenTag.apply @, arguments

		@saxStream.on "closetag", () =>
			@onCloseTag.apply @, arguments

		@saxStream.on "text", () =>
			@onText.apply @, arguments

		return @saxStream

	onOpenTag : (node) ->
		@position.push node.name
		@openTag = node.name
		@collectCurrentNode = false

		collectRules = @getCollectRules()

		for key,props of collectRules
			if @isPositionEq(props.start)
				@startCollect key

		if @collect && @shallCollect()
			@collectCurrentNode = true
			@xml += "<#{node.name}"
			@collectOpenTags.push node.name

			if node.attributes && _.isObject(node.attributes)
				for key, val of node.attributes
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
		@saxStream.emit @collect, x2js.xml2js(@xml)

		@collectOpenTags = []
		@collect = null
		@xml = ''

	onText : (text) ->
		if @openTag && @collectCurrentNode
			@xml += text

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