const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const conn = mongoose.createConnection(
  'mongodb://localhost:27017/groupstudy',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    family: 4,
  },
);

const { Schema } = mongoose;

const user = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'You must have a username',
  },
  password: {
    type: String,
    required: 'You must have a password',
  },
  email: {
    type: String,
    unique: true,
    required: 'You provide an email.',
  },
  enrollments: [ObjectId],
}, { timestamps: true });

const User = conn.model('User', user);

module.exports = User ;
