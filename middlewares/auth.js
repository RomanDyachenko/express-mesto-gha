const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация!' });
  }

  try {
    jwt.verify(req.cookies.jwt, 'some-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  next();
};
