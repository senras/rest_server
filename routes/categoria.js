const { Router, response } = require('express');
const { check } = require('express-validator');
const Categoria = require('../models/categoria');
const {
	crearCategoria,
	actualizarCategoria,
	borrarCategoria,
	obtenerCategorias,
	obtenerCategoria,
} = require('../controllers/categoria');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const router = Router();

/*
{{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', obtenerCategoria);

//Crear categoria - privada - cualquier persona con un token valido
router.post(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoria),
		validarCampos,
	],
	crearCategoria,
);

//Actualizar categoria - privado - cualquier con token valido

router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoria),
		validarCampos,
	],
	actualizarCategoria,
);

//Borrar una categoria - Admin
check('rol').custom((rol) => RoleValidator(rol)),
	router.delete(
		'/:id',
		[
			validarJWT,
			esAdminRol,
			check('id').custom(existeCategoria),
			check('rol').custom((rol) => RoleValidator(rol)),
			validarCampos,
		],
		borrarCategoria,
	);

module.exports = router;
