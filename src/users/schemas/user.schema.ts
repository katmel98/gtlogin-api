import * as mongoose from 'mongoose';
import * as validator from 'validator';
// import jwt from 'jsonwebtoken';
// import _ from 'lodash';
import * as bcrypt from 'bcryptjs';

export const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is mot a valid email',
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: String,
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
              if ( err ){
                console.log(err);
              }
              user.password = hash;
              next();
          });
      });
  } else {
      next();
  }
});