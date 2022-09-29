const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const ownerCookie = jwt.verify(req.cookies.jwt, 'some-secret');
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    if (ownerCookie._id !== card.owner) {
      const id = await Card.findByIdAndRemove(req.params.id);
      res.send({
        data: id,
      });
      return;
    }
    throw new BadRequestError('Нет прав для удаления карточки');
  } catch (err) {
    next(err);
  }
};

const postNewCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const owner = jwt.verify(req.cookies.jwt, 'some-secret');

    await Card.create({ name, link, owner: owner._id }, (err, doc) => {
      if (err) {
        console.log(err)
        throw new BadRequestError('Неверно заполнены данные пользователя');
      }
      res.send({ data: doc });
    });
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
const likeCard = async (req, res, next) => {
  const owner = jwt.verify(req.cookies.jwt, 'some-secret');
  try {
    const id = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: owner._id } },
      { new: true },
    );
    if (!id) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    res.send({ data: id });
  } catch (err) {
    if (err.name === 'CastError') {
      const badRequestError = new BadRequestError('Переданы некорректные данные для постановки лайка');
      next(badRequestError);
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const dislikeCard = async (req, res, next) => {
  try {
    const id = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },

      { new: true },
    );
    if (!id) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    res.send({ data: id });
  } catch (err) {
    if (err.name === 'CastError') {
      const badRequestError = new BadRequestError('Переданы некорректные данные для снятия лайка');
      next(badRequestError);
    }
    next(err);
  }
};

module.exports = {
  getAllCards,
  deleteCard,
  postNewCard,
  likeCard,
  dislikeCard,
};
