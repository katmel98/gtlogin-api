import * as mongoose from 'mongoose';
import * as moment from 'moment';

export const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  descrip: String,
  rules: [],
  created_at: {
    type: Number,
    default: null,
  },
    updated_at: {
    type: Number,
    default: null,
  },

});

PermissionSchema.pre('save', function(next) {

  const permission = this;
  const date = moment().valueOf();

  if ( permission.isNew ) {
    permission.created_at = date;
  }
  permission.updated_at = date;

  next();
});
