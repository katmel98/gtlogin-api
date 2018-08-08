import * as mongoose from 'mongoose';
import * as validator from 'validator';
// import jwt from 'jsonwebtoken';
// import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';

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
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: String,
  created_at: {
    type: Number,
    default: null,
  },
    updated_at: {
    type: Number,
    default: null,
  },

});

UserSchema.pre('save', function(next) {
  const user = this;
  const date = moment().valueOf();

  console.log(user.isNew);

  if  ( user.isNew ) {
    user.created_at = date;
  } else {
    console.log('is not new');
    user.updated_at = date;
  }

  if (user.isModified('password')) {
      bcrypt.genSalt(10, (e, salt) => {
          if ( e ){
            console.log(e);
          }
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
