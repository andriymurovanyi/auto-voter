import mongoose, { Schema, type Model } from 'mongoose';

import { Collections } from '@/static/mongo';
import { IUser } from '@/models/user/user.types';

const UserSchema: Schema = new Schema<IUser.Model>({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  canVote: {
    type: Boolean,
    default: false,
  },

  usedProxy: {
    type: Object,
    default: null,
  },
}, {
  timestamps: true,
  collection: Collections.Users,
});

const UserModel: Model<IUser.Model> =
  mongoose.model<IUser.Model>('User', UserSchema);

export { UserModel };
