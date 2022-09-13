const express = require('express');

const router = express.Router();

const {
  getAllCards, deleteCard, postNewCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.delete('/:id', deleteCard);

router.post('/', express.json(), postNewCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
