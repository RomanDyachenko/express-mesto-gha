const express = require('express');

const router = express.Router();

const {
  findUserById,
  getAllUsers,
  postNewUser,
  updateOwnerProfile,
  updateOwnerAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/:id', findUserById);

router.post('/users', express.json(), postNewUser);

router.patch('/users/me', express.json(), updateOwnerProfile);

router.patch('/users/me/avatar', express.json(), updateOwnerAvatar);

module.exports = router;
