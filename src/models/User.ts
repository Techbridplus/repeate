import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string | null;
  email?: string;
  emailVerified: Date | null;
  image: string | null;
  password?: string;
  role?: 'USER' | 'ADMIN';
  accounts?: mongoose.Types.Array<mongoose.Types.ObjectId>;
  isTwoFactorEnabled?: boolean;
  twoFactorConfirmation?: mongoose.Types.ObjectId;
  twoFactorConfirmationId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}


const UserSchema: Schema = new Schema({
  name: { 
    type: String,
    required: false
},
  email: {
    type: String,
    required: false,
    unique: true
},
  emailVerified: {
    type: Date,
    required: false
},
  image: {
    type: String,
    required: false
},
  password: {
    type: String,
    required: false
},
  role: {
    type: String,
    required: true,
    default: 'USER',
    enum: ['USER', 'ADMIN']
},
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  isTwoFactorEnabled: {
    type: Boolean,
    required: true,
    default: false
},
  twoFactorConfirmation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TwoFactorConfirmation',
    required: false
},
  twoFactorConfirmationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
}
}, {
  timestamps: true,
});
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;