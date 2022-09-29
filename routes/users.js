const express = require('express');

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

router.get('/:id', findUserById);

router.patch('/me', express.json(), updateOwnerProfile);

router.patch('/me/avatar', express.json(), updateOwnerAvatar);

module.exports = router;
