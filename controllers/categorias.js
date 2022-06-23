const { response, request } = require('express');
const { Categoria } = require('../models');

const crearCategoria = async (req, res = response) => {
	const nombre = req.body.nombre.toUpperCase();
	const categoriaDB = await Categoria.findOne({ nombre });
	if (categoriaDB) {
		return res.status(400).json({
			msg: `La categoria ${categoriaDB.nombre} ya existe`,
		});
	}

	const data = {
		nombre,
		usuario: req.usuario._id,
	};

	const categoria = new Categoria(data);
	await categoria.save();

	res.status(201).json(categoria);
};

const obtenerCategorias = async (req, res = response) => {
	const query = { estado: true }; //Para buscar todas las categorias con estado true
	const { limite = 5, desde = 0 } = req.query;
	const categorias = await Categoria.find(query)
		.populate('usuario', 'nombre')
		.skip(Number(desde))
		.limit(Number(limite));
	const total = await Categoria.countDocuments(query);

	res.json({
		total,
		categorias,
	});
};

//populate
const obtenerCategoria = async (req, res = response) => {
	const categoria = await Categoria.findOne({ id: req.params.id }).populate('usuario', 'nombre');
	res.json({
		categoria,
	});
};

//Solo cambiar el nombre - validaciones
const actualizarCategoria = async (req, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body;
	data.nombre = data.nombre.toUpperCase();
	data.usuario = req.usuario._id;
	const categoriaDB = await Categoria.findOne({ nombre: data.nombre });
	if (categoriaDB) {
		return res.status(400).json({
			msg: `La categoria ${categoriaDB.nombre} ya existe`,
		});
	}
	const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
	res.json(categoria);
};

//Pone estado en false
const borrarCategoria = async (req = request, res = response) => {
	const { id } = req.params;
	const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
	res.status(200).json({
		categoria,
	});
};

module.exports = {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borrarCategoria,
};
