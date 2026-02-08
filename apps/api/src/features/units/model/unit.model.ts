import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUnit extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  abbreviation: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new Schema<IUnit>(
  {
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "Unit",
  }
);

const Unit: Model<IUnit> = mongoose.model<IUnit>("Unit", UnitSchema);
export default Unit;
