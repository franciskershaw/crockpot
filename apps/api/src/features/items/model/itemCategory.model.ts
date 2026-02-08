import mongoose, { Document, Model, Schema } from "mongoose";

export interface IItemCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  faIcon: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemCategorySchema = new Schema<IItemCategory>(
  {
    name: { type: String, required: true, unique: true },
    faIcon: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "ItemCategory",
  }
);

const ItemCategory: Model<IItemCategory> = mongoose.model<IItemCategory>(
  "ItemCategory",
  ItemCategorySchema
);
export default ItemCategory;
