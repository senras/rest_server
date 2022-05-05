const { response } = require('express');

const esAdminRol = (req, res = response, next) => {
	if (!req.usuario) {
		return res.status(500).json({
			msg: 'Se quiere verificar el rol sin validar el token antes',
		});
	}
	const { rol, nombre } = req.usuario;

	if (rol !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${nombre} no es administrador - no está habilitado para realizar esta operación`,
		});
	}

	next();
};

const tieneRol = (...roles) => {
	return (req, res = response, next) => {
		if (!req.usuario) {
			return res.status(500).json({
				msg: 'Se quiere verificar el rol sin validar el token antes',
			});
		}

		if (!roles.includes(req.usuario.rol)) {
			return res.status(401).json({
				msg: `Debe poseer uno de estos roles ${roles}`,
			});
		}
		next();
	};
};
module.exports = {
	esAdminRol,
	tieneRol,
};
