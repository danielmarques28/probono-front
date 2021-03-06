const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Client } = require('../models');

const controller = {};

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

const sendNotFound = (res) => {
  res.status(404).json(
    { status: 404, message: 'Wrong email or password !' },
  ).end();
};

controller.loginLawyer = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const hash = user.dataValues.password;
    if (user && verifyPassword(password, hash)) {
      const { id } = user.dataValues;
      const role = 'lawyer';
      const token = jwt.sign({ id, role }, process.env.SECRET, {
        expiresIn: 18000,
      });
      res.status(200).json({ token, role });
    } else {
      res.status(404).json(
        { status: 404, message: 'Wrong email or password !' },
      );
    }
  } else sendNotFound(res);
};

controller.loginClient = async (req, res) => {
  const { cpf, password } = req.body;
  const userClient = await Client.findOne(
    { where: { cpf }, include: { model: User } },
  );
  if (userClient) {
    const hash = userClient.dataValues.User.dataValues.password;
    if (verifyPassword(password, hash)) {
      const id = userClient.dataValues.userId;
      const role = 'client';
      const token = jwt.sign({ id, role }, process.env.SECRET, {
        expiresIn: 18000,
      });
      res.status(200).json({ token, role });
    } else {
      res.status(404).json(
        { status: 404, message: 'Wrong email or password !' },
      );
    }
  } else sendNotFound(res);
};

module.exports = controller;
