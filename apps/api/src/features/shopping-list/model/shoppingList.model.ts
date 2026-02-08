import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShoppingListItem {
  itemId: mongoose.Types.ObjectId;
  unitId?: mongoose.Types.ObjectId | null;
  quantity: number;
  obtained: boolean;
  isManual: boolean;
}

export interface IShoppingList extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  items: IShoppingListItem[];
}

const ShoppingListItemSchema = new Schema<IShoppingListItem>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: false },
    quantity: { type: Number, required: true },
    obtained: { type: Boolean, default: false },
    isManual: { type: Boolean, default: false },
  },
  { _id: false }
);

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [ShoppingListItemSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "ShoppingList",
  }
);

const ShoppingList: Model<IShoppingList> = mongoose.model<IShoppingList>(
  "ShoppingList",
  ShoppingListSchema
);
export default ShoppingList;
