const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { nombre, img, correo } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			//Creo usuario ya que no existe usuario con el mail de google
			const data = {
				nombre,
				correo,
				password: ':P',
				img,
				google: true,
			};
			usuario = new Usuario(data);
			await usuario.save();
		}
		if (!usuario.estado) {
			//Me fijo si el usuario está bloqueado previamente

			return res.status(401).json({
				msg: 'Usuario bloqueado',
			});
		}
		//Generar JWT
		const token = await generarJWT(usuario.id);

		res.json({ usuario, token });
	} catch (error) {
		console.log(error);
		res.status(400).json({
			msg: 'Token de Google no válido',
		});
	}
};
module.exports = {
	login,
	googleSignIn,
};
