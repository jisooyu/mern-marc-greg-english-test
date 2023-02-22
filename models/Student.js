const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'StudentResponse'
    }
  ],
  performances: [
    {
      type: Schema.Types.ObjectId,
      ref: 'StudentPerformance'
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Student', studentSchema);
