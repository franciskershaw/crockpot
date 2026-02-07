import mongoose, { Document, Model, Schema } from "mongoose";

export const USER_ROLES = ["FREE", "PREMIUM", "PRO", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const AUTH_PROVIDERS = ["google", "local"] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role: UserRole;
  favouriteRecipeIds: mongoose.Types.ObjectId[];
  provider?: AuthProvider;
  googleId?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    emailVerified: { type: Date, required: false },
    image: { type: String, required: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "FREE",
    },
    favouriteRecipeIds: [
      { type: Schema.Types.ObjectId, ref: "Recipe", default: [] },
    ],
    provider: {
      type: String,
      enum: AUTH_PROVIDERS,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    passwordHash: { type: String, required: false, select: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
