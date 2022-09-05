const Card = require("../models/card.js");

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});

    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = await Card.findByIdAndRemove(req.params.id);
    if(!id){
      res.status(404).send({ message: "Пользователь с данным _id не найден"})
      return
    }
    res.send({
      data: id,
    });
  } catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};

const postNewCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    await Card.create({ name, link, owner: req.user._id }, (err, doc) => {
      if (err) {
        res
          .status(400)
          .send({ message: "Неверно заполнены данные пользователя" });
        return;
      }
      res.status(200).send({ data: doc });
    });
  } catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).then((card) => {
    res.send({
      data: card,
    });
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).then((card) => {
    res.send({
      data: card,
    });
  });
};

module.exports = {
  getAllCards,
  deleteCard,
  postNewCard,
  likeCard,
  dislikeCard,
};
