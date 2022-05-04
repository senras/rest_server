const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		const usuario = await Usuario.findById(uid);

		if (!usuario) {
			return res.status(401).json({
				msg: 'Token no válido - usuario no existente', //Verificar si el usuario con el uid loggeado esta borrado
			});
		}
		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Token no válido - usuario con estado:false',
			});
		}
		req.usuario = usuario;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			msg: 'Token no válido',
		});
	}
};

module.exports = { validarJWT };
