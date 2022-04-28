const { Router } = require('express');
const { check } = require('express-validator');
const { RoleValidator } = require('../helpers/db-validators');
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

router.put('/:id', usuariosPut);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La contraseña debe ser de más de 6 carácteres').isLength({ min: 6 }),
		check('correo', 'El correo no es válido.').isEmail(),
		check('rol').custom((rol) => RoleValidator(rol)),
		validarCampos,
	],
	usuariosPost,
);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
