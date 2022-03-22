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

const course = new Schema({
  creatorId: { //is a userId
    type: ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }, 
}, { timestamps: true });

const Course = conn.model('Course', course);

module.exports = Course;
