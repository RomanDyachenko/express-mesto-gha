const User = require("../models/user.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).send(users);

  } catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};

const findUserById = async (req, res) => {

  try{
    const id = await User.findById(req.params.id);
    if(!id){
      res.status(404).send({ message: "Пользователь с данным _id не найден"})
      return
    }
    res.status(200).send({
    data: id,
  });
  }
  catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};

const postNewUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    await User.create({ name, about, avatar }, (err, doc) => {
      if(err){
        res.status(400).send({ message: "Неверно заполнены данные пользователя"})
        return
      }
      res.status(200).send({data: doc})
    });
  }
  catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }
};

const updateOwnerProfile = async (req, res) => {
  const { name, about } = req.body;

  const id = req.user._id;

  try {const findByIdUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }, (err, doc) => {
      if(err){
        res.status(400).send({ message: "Неверно заполнены данные пользователя"})
        return
      }
    })
    if(!findByIdUser){
      res.status(404).send({ message: "Пользователь с данным _id не найден"})
      return
    }
    res.status(200).send({
    data: findByIdUser,
  })
  }
  catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }

};

const updateOwnerAvatar = async (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  try {
    const findByIdAvatar = User.findByIdAndUpdate(
      id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
      (err, doc) => {
        if(err){
          res.status(400).send({ message: "Неверно заполнены данные пользователя"})
          return
        }
      }
    )
    if(!findByIdAvatar){
      res.status(404).send({ message: "Пользователь с данным _id не найден"})
      return
    }
    res.status(200).send({
    data: findByIdAvatar,
  })
  }
  catch (e) {
    res.status(500).send({ message: "Произошла ошибка на сервере", ...e });
  }

};

module.exports = {
  getAllUsers,
  findUserById,
  postNewUser,
  updateOwnerProfile,
  updateOwnerAvatar,
};
