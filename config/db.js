const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url =
  'mongodb+srv://evh111:Vaughan7@cluster0-voeeo.mongodb.net/test?retryWrites=true&w=majority';

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports = connect;
