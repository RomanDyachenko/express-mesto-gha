const Card = require('../models/card');
const { NOT_FOUND_ERR, BAD_REQUEST_ERR, INTERNAL_SERVER_ERR } = require('../utils/utils');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = await Card.findByIdAndRemove(req.params.id);
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

const postNewCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    await Card.create({ name, link, owner: req.user._id }, (err, doc) => {
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
const likeCard = async (req, res) => {
  try {
    const id = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (id.owner.toString() !== req.user._id) {
      res
        .status(BAD_REQUEST_ERR)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res.send({ data: id });
  } catch (e) {
    if (e.value) {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const id = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },

      { new: true },
    );
    if (id.owner.toString() !== req.user._id) {
      res
        .status(BAD_REQUEST_ERR)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res.send({ data: id });
  } catch (e) {
    if (e.value) {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с данным _id не найден' });
      return;
    }
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  getAllCards,
  deleteCard,
  postNewCard,
  likeCard,
  dislikeCard,
};
