const { response } = require("express");
const Usuario = require("../models/usuario");

const usuariosGet = (req, res = response) => {
  const { q, nombre } = req.query;
  res.json({
    msg: "get API - controlador",
    q,
    nombre,
  });
};

const usuariosPut = (req, res) => {
  const id = req.params.id;
  res.json({
    msg: "put API - controlador",
    id,
  });
};

const usuariosPost = async (req, res) => {
  const body = req.body;
  const nuevoUsuario = new Usuario(body);
  await nuevoUsuario.save();
  res.json({
    msg: "post API - controlador",
    nuevoUsuario,
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    msg: "delete API - controlador",
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
