import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITwoFactorConfirmation extends Document {
  userId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const TwoFactorConfirmationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

TwoFactorConfirmationSchema.index({ userId: 1 }, { unique: true });

const TwoFactorConfirmation: Model<ITwoFactorConfirmation> = mongoose.models.TwoFactorConfirmation || mongoose.model<ITwoFactorConfirmation>('TwoFactorConfirmation', TwoFactorConfirmationSchema);

export default TwoFactorConfirmation;