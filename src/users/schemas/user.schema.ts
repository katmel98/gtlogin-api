import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
// import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { TokenSchema } from './token.schema';

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
  tokens: [TokenSchema],
  roles: [],
  groups: [],
  email_verified: {
    type: Boolean,
    default: false,
  },
  logged_in: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: Number,
    default: null,
  },
  last_logout: {
    type: Number,
    default: null,
  },
  created_at: {
    type: Number,
    default: null,
  },
    updated_at: {
    type: Number,
    default: null,
  },

});

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_TOKEN_SECRET).toString();

  user.tokens.push({access, token}); // this sometimes not work in some mongodb versions
  // user.tokens = user.token.concat([{access, token}]);

  return user.save().then(() => {
      return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  const user = this;

  return user.update({
      $pull: {
          tokens: { token },
      },
  });
};

UserSchema.pre('save', function(next) {

  const user = this;
  const date = moment().valueOf();

  if ( user.isNew ) {
    user.created_at = date;
  }
  user.updated_at = date;

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
