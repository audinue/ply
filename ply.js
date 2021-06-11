var PLY = function () {
	function toText (response) {
		return response.text()
	}

	function identity (value) {
		return value
	}

	function convertColor (value, index) {
		return index < 3 ? value : value / 256
	}

	function parseVertex (vertex) {
		var match = vertex.match(/^(-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+) (\d+) (\d+) (\d+)$/)
		if (!match) {
			throw new Error('PLY must not contains normals or UVs.')
		}
		return match
			.slice(1)
			.map(parseFloat)
			.map(convertColor)
	}

	function parseFace (face) {
		var match = face.match(/^3 (\d+) (\d+) (\d+)$/)
		if (!match) {
			throw new Error('PLY must be triangulated.')
		}
		return match
			.slice(1)
			.map(parseFloat)
	}

	function parse (text) {
		var count = text.match(/^element vertex (\d+)/m)[1]
		var body = text.match(/end_header\n([\s\S]+?)\n?$/)[1].split('\n')
		return [
			body.slice(0, count)
				.map(parseVertex)
				.flatMap(identity),
			body.slice(count)
				.map(parseFace)
				.flatMap(identity)
		]
	}

	function read (file) {
		return fetch(file)
			.then(toText)
			.then(parse)
			.catch(function (error) {
				error.message += ' (' + file + ')'
				throw error
			})
	}

	return {
		parse: parse,
		read: read
	}
}()
