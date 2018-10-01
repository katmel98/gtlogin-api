import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
// import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';

export const TokenSchema = new mongoose.Schema({
  access: String,
  token: String,
  expires_in: {
    type: Number,
    default: null,
  },
  created_at: {
    type: Number,
    default: null,
  },
  expires_at: {
    type: Number,
    default: null,
  },
}, {_id: false});
