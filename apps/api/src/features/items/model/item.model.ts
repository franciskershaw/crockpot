import mongoose, { Document, Model, Schema } from "mongoose";

export interface IItem extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  categoryId: mongoose.Types.ObjectId;
  allowedUnitIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "ItemCategory", required: true },
    allowedUnitIds: [{ type: Schema.Types.ObjectId, ref: "Unit" }],
  },
  {
    timestamps: true,
    collection: "Item",
  }
);

const Item: Model<IItem> = mongoose.model<IItem>("Item", ItemSchema);
export default Item;
