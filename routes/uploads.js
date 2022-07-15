const { Router } = require('express');
const { check } = require('express-validator');
const {
	cargarArchivo,
	actualizarImagen,
	actualizarImagenCloudinary,
	mostrarImagen,
	mostrarImagenCloudinary,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubido } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubido, cargarArchivo);

router.put(
	'/:coleccion/:id',
	[
		validarArchivoSubido,
		check('id', 'EL id debe ser un mongo ID válido').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarCampos,
	],
	actualizarImagenCloudinary,
);

router.get(
	'/:coleccion/:id',
	[
		check('id', 'EL id debe ser un mongo ID válido').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarCampos,
	],
	mostrarImagenCloudinary,
);

module.exports = router;
