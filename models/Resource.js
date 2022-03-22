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

const resource = new Schema({
  link: {
    type: String,
    required: true,
  },
  unit: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  courseId: {
    type: ObjectId,
  },
  resourceType: {
    type: String,
  },
}, { timestamps: true });

const Resource = conn.model('Resource', resource);

module.exports = Resource;
