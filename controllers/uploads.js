const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'dt9lo3l3b',
	api_key: '352793848741558',
	api_secret: '82sc3gAPCWcVvqKZ1UBn7sYbNCE',
});

const cargarArchivo = async (req, res = response) => {
	// if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
	// 	return res.status(400).json({ msg: 'No hay archivos que subir' });
	// }
	try {
		const nombre = await subirArchivo(req.files, undefined, 'imgs');
		res.json({ nombre });
	} catch (error) {
		res.status(400).json({ error });
	}
};

const actualizarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con id ${id}`,
				});
			}

			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con id ${id}`,
				});
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esta colección' });
	}

	if (modelo.img) {
		const nombrePath = path.join(__dirname, '../uploads/', coleccion, modelo.img);
		if (fs.existsSync(nombrePath)) {
			fs.unlinkSync(nombrePath);
		}
	}
	const nombre = await subirArchivo(req.files, undefined, coleccion);

	modelo.img = nombre;

	await modelo.save();

	res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con id ${id}`,
				});
			}

			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con id ${id}`,
				});
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esta colección' });
	}

	if (modelo.img) {
		const nombreArr = modelo.img.split('/');
		const nombre = nombreArr[nombreArr.length - 1];
		const [public_id] = nombre.split('.');
		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	modelo.img = secure_url;
	await modelo.save();

	res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	const placeholder = path.join(__dirname, '../assets/', 'no-image.jpg');

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			break;

		case 'productos':
			modelo = await Producto.findById(id);
			break;
		default:
			return res.status(500).json({ msg: 'colección no valida' });
	}

	if (modelo.img) {
		const nombrePath = path.join(__dirname, '../uploads/', coleccion, modelo.img);
		if (fs.existsSync(nombrePath)) {
			return res.sendFile(nombrePath);
		}
	}

	return res.sendFile(placeholder);
};

const mostrarImagenCloudinary = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	const placeholder = path.join(__dirname, '../assets/', 'no-image.jpg');

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			break;

		case 'productos':
			modelo = await Producto.findById(id);
			break;
		default:
			return res.status(500).json({ msg: 'colección no valida' });
	}

	if (modelo.img) {
		return res.json({ img: modelo.img });
	}
	return res.sendFile(placeholder);
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
	actualizarImagenCloudinary,
	mostrarImagen,
	mostrarImagenCloudinary,
};
