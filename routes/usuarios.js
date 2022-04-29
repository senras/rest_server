const { Router } = require('express');
const { check } = require('express-validator');
const { RoleValidator, EmailValidator, UserByIdValidator } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(UserByIdValidator),
		check('rol').custom((rol) => RoleValidator(rol)),
		validarCampos,
	],
	usuariosPut,
);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La contraseña debe ser de más de 6 carácteres').isLength({ min: 6 }),
		check('correo', 'El correo no es válido.').isEmail(),
		check('rol').custom((rol) => RoleValidator(rol)),
		check('correo').custom((correo) => EmailValidator(correo)),
		validarCampos,
	],
	usuariosPost,
);

router.delete(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(UserByIdValidator),
		validarCampos,
	],
	usuariosDelete,
);

router.patch('/', usuariosPatch);

module.exports = router;
