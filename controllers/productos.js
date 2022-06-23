const { response, request } = require('express');
const { Producto } = require('../models');

const crearProducto = async (req, res = response) => {
	const { estado, usuario, ...resto } = req.body;
	const productoDB = await Producto.findOne({ nombre: resto.nombre.toUpperCase() });
	if (productoDB) {
		return res.status(400).json({
			msg: `El producto ${productoDB.nombre} ya existe`,
		});
	}
	const data = {
		...resto,
		nombre: resto.nombre.toUpperCase(),
		usuario: req.usuario._id,
	};

	const producto = new Producto(data);
	await producto.save();

	res.status(201).json(producto);
};

const obtenerProductos = async (req, res = response) => {
	const query = { estado: true }; //Para buscar todos los productos con estado true
	const { limite = 5, desde = 0 } = req.query;
	const productos = await Producto.find(query)
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre')
		.skip(Number(desde))
		.limit(Number(limite));
	const total = await Producto.countDocuments(query);

	res.json({
		total,
		productos,
	});
};

const obtenerProducto = async (req, res = response) => {
	const producto = await Producto.findOne({ id: req.params.id })
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre');
	res.json({
		producto,
	});
};

const actualizarProducto = async (req, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body;
	const productoDB = await Producto.findOne({ nombre: data.nombre.toUpperCase() });
	if (productoDB) {
		return res.status(400).json({
			msg: `El producto ${productoDB.nombre} ya existe`,
		});
	}
	if (data.nombre) {
		data.nombre = resto.nombre.toUpperCase();
	}

	data.usuario = req.usuario._id;

	const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
	res.json(producto);
};

//Pone estado en false
const borrarProducto = async (req = request, res = response) => {
	const { id } = req.params;
	const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
	res.status(200).json({
		producto,
	});
};

module.exports = {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
};
