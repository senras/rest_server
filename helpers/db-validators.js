const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const RoleValidator = async (rol = '') => {
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no está registrado en la BD`);
	}
};

const EmailValidator = async (correo) => {
	const existeEmail = await Usuario.findOne({ correo: correo }); //Verificar si el correo existe
	if (existeEmail) {
		throw new Error(`El correo ${correo} ya se encuentra registrado.`);
	}
};

const UserByIdValidator = async (id) => {
	const userId = await Usuario.findById(id); //Verificar si existe usuario con el id
	if (!userId) {
		throw new Error(`No existe usuario con ID: ${id}.`);
	}
};

const existeCategoria = async (id) => {
	const categoria = await Categoria.findById(id);
	if (!categoria) {
		throw new Error(`No existe categoria con ID: ${id}.`);
	}
};

module.exports = {
	RoleValidator,
	EmailValidator,
	UserByIdValidator,
	existeCategoria,
};
