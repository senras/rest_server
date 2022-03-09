const { response } = require('express');

const usuariosGet = (req, res = response) => {
  const { q, nombre } = req.query;
  res.json({
    msg: 'get API - controlador',
    q,
    nombre,
  });
};

const usuariosPut = (req, res) => {
  const id = req.params.id;
  res.json({
    msg: 'put API - controlador',
    id,
  });
};

const usuariosPost = (req, res) => {
  const { nombre, edad } = req.body;
  res.json({
    msg: 'post API - controlador',
    nombre,
    edad,
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    msg: 'delete API - controlador',
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    msg: 'patch API - controlador',
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
