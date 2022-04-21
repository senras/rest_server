const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { validationResult } = require("express-validator");
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
  //Verifica si hay errores al comprobar si el mail es valido con express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Si hay errores..
    return res.status(400).json(errors); //Los retorna
  }

  const { nombre, correo, password, rol } = req.body;
  const nuevoUsuario = new Usuario({ nombre, correo, password, rol });

  //Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo: correo });
  if (existeEmail) {
    return res.status(400).json({
      msg: "Ese correo ya se encuentra registrado.",
    });
  }
  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  nuevoUsuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await nuevoUsuario.save();
  res.json({
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
