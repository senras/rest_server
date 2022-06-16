const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares');

const router = Router();

/*
{{url}}/api/categorias
*/
router.get('/', (req, res) => {
	res.json('obtener categorias');
});

router.get('/:id', (req, res) => {
	res.json('GET 1 categoria');
});

router.post('/:id', (req, res) => {
	res.json('Crea 1 categoria');
});

router.put('/:id', (req, res) => {
	res.json('Modifica 1 categoria');
});

router.delete('/:id', (req, res) => {
	res.json('Borra 1 categoria');
});

module.exports = router;
