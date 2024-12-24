import mongoose, { Schema, Document, Model } from 'mongoose';

interface IVerificationToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

const VerificationTokenSchema: Schema = new Schema({
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

VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken : Model<IVerificationToken> = mongoose.models.VerificationToken ||mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export default VerificationToken;