import * as mongoose from 'mongoose';
// import * as validator from 'validator';
// import jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as moment from 'moment';

export const ProductSchema = new mongoose.Schema({
  name: String,
  descrip: String,
  created_at: {
    type: Number,
    default: null,
  },
    updated_at: {
    type: Number,
    default: null,
  },

});
