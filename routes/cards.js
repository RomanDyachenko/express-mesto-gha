/* eslint-disable no-useless-escape */
const express = require('express');
const { Joi, celebrate } = require('celebrate');

const router = express.Router();

const {
  getAllCards, deleteCard, postNewCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.delete('/:id', celebrate({
  params: {
    id: Joi.string().length(24).hex().required(),
  },
}), deleteCard);

router.post('/', express.json(), celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/https?:\/\/w?w?w?\.?[a-z0-9\W]+\.ru\/?[a-z0-9\W]*$/i).required(),
  },
}), postNewCard);

router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), dislikeCard);

module.exports = router;
