import * as mongoose from 'mongoose';
import * as moment from 'moment';

export const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
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

RoleSchema.pre('save', function(next) {

  const role = this;
  const date = moment().valueOf();

  if ( role.isNew ) {
    role.created_at = date;
  }
  role.updated_at = date;

  next();
});
