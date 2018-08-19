import * as mongoose from 'mongoose';
import * as moment from 'moment';

export const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  descrip: String,
  roles: [],
  created_at: {
    type: Number,
    default: null,
  },
    updated_at: {
    type: Number,
    default: null,
  },

});

GroupSchema.pre('save', function(next) {

  const group = this;
  const date = moment().valueOf();

  if ( group.isNew ) {
    group.created_at = date;
  }
  group.updated_at = date;

  next();
});
