const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

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
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    if ((card.owner.equals(req.user._id))) {
      const id = await Card.findByIdAndRemove(req.params.id);
      res.send({
        data: id,
      });
      return;
    }
    throw new ForbiddenError('Нет прав для удаления карточки');
  } catch (err) {
    next(err);
  }
};

const postNewCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(
        { data: card },
      );
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены данные пользователя'));
      } else {
        next(err);
      }
    });
};
// eslint-disable-next-line consistent-return
const likeCard = async (req, res, next) => {
  try {
    const id = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
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
