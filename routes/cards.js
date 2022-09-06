const express = require('express');

const router = express.Router();

const {
  getAllCards, deleteCard, postNewCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.delete('/cards/:id', deleteCard);

router.post('/cards', express.json(), postNewCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
