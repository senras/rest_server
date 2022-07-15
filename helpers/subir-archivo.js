const path = require('path');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = async (
	files,
	extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'],
	carpeta = '',
) => {
	return new Promise((resolve, reject) => {
		const { archivo } = files;
		const nombreCortado = archivo.name.split('.');
		const extension = nombreCortado[nombreCortado.length - 1];

		//Validar extension
		if (!extensionesValidas.includes(extension)) {
			reject(`La extension ${extension} no es valida. Debe ser ${extensionesValidas}`);
		}

		const nombreTemp = uuidv4() + '.' + extension;
		const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

		// Use the mv() method to place the file somewhere on your server
		archivo.mv(uploadPath, function (err) {
			if (err) reject(err);
			resolve(nombreTemp);
		});
	});
};

module.exports = { subirArchivo };
