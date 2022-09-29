const express = require('express');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { postNewUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

async function connect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

connect();

app.use(cookieParser());

app.use(errors());

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), postNewUser);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);

app.use('/users', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), users);

app.use('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }).unknown(true),
}), cards);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
