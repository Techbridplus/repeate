import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const AccountSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  type: {
    type: String,
    required: true
},
  provider: {
    type: String,
    required: true
},
  providerAccountId: {
    type: String,
    required: true
},
  refresh_token: {
    type: String,
    required: false
},
  access_token: {
    type: String,
    required: false
},
  expires_at: {
    type: Number,
    required: false
},
  token_type: {
    type: String,
    required: false
},
  scope: {
    type: String,
    required: false
},
  id_token: {
    type: String,
    required: false
},
  session_state: {
    type: String,
    required: false
}
});

// AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
const Account : Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;