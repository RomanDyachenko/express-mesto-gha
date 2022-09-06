const User = require('../models/user');
const {
  NOT_FOUND_ERR,
  BAD_REQUEST_ERR,
  INTERNAL_SERVER_ERR,
} = require('../utils/utils');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const findUserById = async (req, res) => {
  try {
    const id = await User.findById(req.params.id);
    if (!id) {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }
    res.send({
      data: id,
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const postNewUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    await User.create({ name, about, avatar }, (err, doc) => {
      if (err) {
        res
          .status(BAD_REQUEST_ERR)
          .send({ message: 'Неверно заполнены данные пользователя' });
        return;
      }
      res.send({ data: doc });
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateOwnerProfile = async (req, res) => {
  const { name, about } = req.body;

  const id = req.user._id;

  try {
    const findByIdUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
      (err) => {
        if (err) {
          res
            .status(BAD_REQUEST_ERR)
            .send({ message: 'Неверно заполнены данные пользователя' });
        }
      },
    );
    if (!findByIdUser) {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }
    res.send({
      data: findByIdUser,
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateOwnerAvatar = async (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  try {
    const findByIdAvatar = User.findByIdAndUpdate(
      id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
      (err) => {
        if (err) {
          res
            .status(BAD_REQUEST_ERR)
            .send({ message: 'Неверно заполнены данные пользователя' });
        }
      },
    );
    if (!findByIdAvatar) {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }
    res.send({
      data: findByIdAvatar,
    });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getAllUsers,
  findUserById,
  postNewUser,
  updateOwnerProfile,
  updateOwnerAvatar,
};
