const express = require('express');
const { Joi, celebrate } = require('celebrate');

const router = express.Router();

const {
  findUserById,
  getAllUsers,
  updateOwnerProfile,
  updateOwnerAvatar,
  getOwnerInfo,
} = require('../controllers/users');

router.get('/me', express.json(), getOwnerInfo);

router.get('/', getAllUsers);

router.get('/:id', celebrate({
  params: {
    id: Joi.string().length(24).hex().required(),
  },
}), findUserById);

router.patch('/me', express.json(), celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  },
}), updateOwnerProfile);

router.patch('/me/avatar', express.json(), celebrate({
  body: {
    avatar: Joi.string().pattern(/https?:\/\/w?w?w?\.?[a-z0-9\W]+\.[a-z]+\/?[a-z0-9\W]*$/i),
  },
}), updateOwnerAvatar);

module.exports = router;
