const { Router, response } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

/*
{{url}}/api/productos
*/

router.get('/', obtenerProductos);

router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto,
);

//Crear categoria - privada - cualquier persona con un token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('categoria').custom(existeCategoriaPorId),
		validarCampos,
	],
	crearProducto,
);

//Actualizar categoria - privado - cualquier con token valido

// nombre,
// estado,
// usuario,
// precio,
// categoria,
// descripcion,
// disponible,

router.put(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto,
);

router.delete(
	'/:id',
	[
		validarJWT,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		esAdminRol,
		validarCampos,
	],
	borrarProducto,
);

module.exports = router;
