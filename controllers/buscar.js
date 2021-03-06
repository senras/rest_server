const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const coleccionesPermitidas = ['categorias', 'productos', 'roles', 'usuarios'];
const { Usuario, Categoria, Producto } = require('../models');

const buscarUsuarios = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);
	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, 'i');
	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	res.json({
		results: usuarios,
	});
};
const buscarCategorias = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);
	if (esMongoID) {
		const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, 'i');
	const categorias = await Categoria.find({ nombre: regex, estado: true }).populate(
		'usuario',
		'nombre',
	);

	res.json({
		results: categorias,
	});
};

const buscarProductos = async (termino = '', res = response) => {
	const esMongoID = ObjectId.isValid(termino);
	if (esMongoID) {
		const productoPorID = await Producto.findById(termino).populate('categoria', 'nombre');
		if (productoPorID) {
			return res.json({
				results: productoPorID ? [productoPorID] : [],
			});
		}

		const productos = await Producto.find({ estado: true }).populate({
			path: 'categoria',
			match: { _id: termino },
		});

		const productosPorCategoria = productos.filter((producto) => producto.categoria);
		return res.json({
			results: productosPorCategoria,
		});
	}

	const regex = new RegExp(termino, 'i');
	const productos = await Producto.find({ nombre: regex, estado: true })
		.populate('categoria', 'nombre')
		.populate('usuario', 'nombre');

	return res.json({
		results: productos,
	});
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;
	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
		});
	}
	switch (coleccion) {
		case 'categorias':
			buscarCategorias(termino, res);
			break;
		case 'productos':
			buscarProductos(termino, res);
			break;
		case 'usuarios':
			buscarUsuarios(termino, res);
			break;
		default:
			res.status(500).json({
				msg: 'Se le olvido hacer esta busqueda',
			});
	}
};

module.exports = { buscar };
