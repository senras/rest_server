const { Router, response } = require('express');
const { check } = require('express-validator');
const Categoria = require('../models/categoria');
const {
	crearCategoria,
	actualizarCategoria,
	borrarCategoria,
	obtenerCategorias,
	obtenerCategoria,
} = require('../controllers/categorias');
const { existeCategoriaPorId, RoleValidator } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const router = Router();

/*
{{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	obtenerCategoria,
);

//Crear categoria - privada - cualquier persona con un token valido
router.post(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampos,
	],
	crearCategoria,
);

//Actualizar categoria - privado - cualquier con token valido

router.put(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id', 'El id es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoriaPorId),
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampos,
	],
	actualizarCategoria,
);

//Borrar una categoria - Admin
router.delete(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		esAdminRol,
		validarCampos,
	],
	borrarCategoria,
);

module.exports = router;
