const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getOwnerInfo = async (req, res, next) => {
  try {
    const userCookie = jwt.verify(req.cookies.jwt, 'some-secret');
    const owner = await User.findById(userCookie._id);
    if (!owner) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(owner);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    next(err);
  }
};

const findUserById = async (req, res, next) => {
  try {
    const id = await User.findById(req.params.id);
    if (!id) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({
      data: id,
    });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequestError('Неправильные почта или пароль');
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

async function postNewUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    bcrypt.hash(password, 10)
      .then((hashedPassword) => {
        User.create({
          name, about, avatar, email, password: hashedPassword,
        }, (err, doc) => {
          if (err || !validator.isEmail(email)) {
            throw new BadRequestError('Неверно заполнены данные пользователя');
          }
          res.send({ data: doc });
        });
      });
  } catch (err) {
    if (err.code === 11000) {
      const conflictError = new ConflictError('Этот email уже есть в базе');
      next(conflictError);
    }
    next(err);
  }
}

const updateOwnerProfile = async (req, res, next) => {
  const { name, about } = req.body;

  const userCookie = jwt.verify(req.cookies.jwt, 'some-secret');

  try {
    const findByIdUser = await User.findByIdAndUpdate(
      userCookie._id,
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
          throw new BadRequestError('Неверно заполнены данные пользователя');
        }
      },
    );
    if (!findByIdUser) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    res.send({
      data: findByIdUser,
    });
  } catch (err) {
    next(err);
  }
};

const updateOwnerAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userCookie = jwt.verify(req.cookies.jwt, 'some-secret');

  try {
    const findByIdAvatar = User.findByIdAndUpdate(
      userCookie._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
      (err) => {
        if (err) {
          throw new BadRequestError('Неверно заполнены данные пользователя');
        }
      },
    );
    if (!findByIdAvatar) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    res.send({
      data: findByIdAvatar,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  findUserById,
  postNewUser,
  updateOwnerProfile,
  updateOwnerAvatar,
  login,
  getOwnerInfo,
};
