import * as mongoose from 'mongoose';
import * as validator from 'validator';
// import jwt from 'jsonwebtoken';
// import _ from 'lodash';
// import bcrypt from 'bcryptjs';

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