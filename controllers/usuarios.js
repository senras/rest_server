const bcryptjs = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
	const query = { estado: true };
	const { limite = 5, desde = 0 } = req.query;
	// const usuarios = await Usuario.find({ query }).skip(Number(desde)).limit(Number(limite));

	// const total = await Usuario.countDocuments({ query });

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({
		total,
		usuarios,
	});
};

const usuariosPut = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;
	//Validar contra DB
	if (password) {
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}
	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json({
		usuario,
	});
};

const usuariosPost = async (req, res = response) => {
	const { nombre, correo, password, rol } = req.body;
	const nuevoUsuario = new Usuario({ nombre, correo, password, rol });

	const salt = bcryptjs.genSaltSync(); //Encriptar la contraseña
	nuevoUsuario.password = bcryptjs.hashSync(password, salt);

	await nuevoUsuario.save(); //Guardar en DB
	res.json({
		nuevoUsuario,
	});
};

const usuariosDelete = async (req, res = response) => {
	const { id } = req.params;
	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
	res.json({
		usuario,
	});
};

const usuariosPatch = (req, res = response) => {
	res.json({
		msg: 'patch API - controlador',
	});
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
};
