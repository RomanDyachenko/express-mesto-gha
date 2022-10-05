const express = require('express');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { postNewUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

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

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/w?w?w?\.?[a-z0-9\W]+\.[a-z]+\/?[a-z0-9\W]*$/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postNewUser);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/users', auth, users);

app.use('/cards', auth, cards);

app.use(auth, ((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
}));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
