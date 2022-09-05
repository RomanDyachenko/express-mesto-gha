const express = require('express');
const mongoose = require("mongoose");

const users = require('./routes/users.js');
const cards = require('./routes/cards')

const { PORT = 3000 } = process.env;

const app = express();

async function connect () {
 await mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: false
});
await  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
}

connect();

app.use((req, res, next) => {
  req.user = {
    _id: "63147341e7abef4787f73c8d"
  };

  next();
});

app.use("/", users);

app.use("/", cards);





