const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  // Need to display error message to user
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return v === null || v === '' || (validator.isMobilePhone(v, 'en-US') && v.match(/^\d{10}$/) !== null);
      },
      message: 'Invalid phone number format. Must be in the format 9141234567.'
    }
  },
  role: {
    type: String,
    required: true,
    default: 'Employee'
  },
  occupation: {
    type: Array,
    required: true,
    default: ['Waitstaff']
  },
  eventsReserved: {
    type: Array,
    required: true,
    default: []
  },
  password: String,
})

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
