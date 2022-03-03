const { ObjectId, ObjectID } = require('bson');
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

const comment = new Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  resourceId: {
    type: ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: 'comments must contain text',
  },
}, { timestamps: true });

const Comment = conn.model('Comment', comment);

module.exports = Comment;
