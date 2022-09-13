const express = require('express');

const router = express.Router();

const {
  findUserById,
  getAllUsers,
  postNewUser,
  updateOwnerProfile,
  updateOwnerAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:id', findUserById);

router.post('/', express.json(), postNewUser);

router.patch('/me', express.json(), updateOwnerProfile);

router.patch('/me/avatar', express.json(), updateOwnerAvatar);

module.exports = router;
