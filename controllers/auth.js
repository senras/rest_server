const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
	const { correo, password } = req.body;
	try {
		// Ver si el email existe
		const usuario = await Usuario.findOne({ correo: correo });
		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - correo',
			});
		}

		//Ver si el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - estado:false',
			});
		}

		const validPassword = bcryptjs.compareSync(password, usuario.password); //Verificar la contraseña
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - password',
			});
		}

		//Generar el JWT

		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

module.exports = {
	login,
};
