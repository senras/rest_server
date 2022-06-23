const { response } = require('express');

buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;
	res.json({
		coleccion,
		termino,
	});
};

module.exports = { buscar };
