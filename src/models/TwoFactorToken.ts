import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITwoFactorToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

const TwoFactorTokenSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expires: {
    type: Date,
    required: true
  }
});

TwoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const TwoFactorToken: Model<ITwoFactorToken> = mongoose.models.TwoFactorToken || mongoose.model<ITwoFactorToken>('TwoFactorToken', TwoFactorTokenSchema);

export default TwoFactorToken;