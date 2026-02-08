import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRecipeMenuEntry {
  recipeId: mongoose.Types.ObjectId;
  serves: number;
}

export interface IMenuHistoryEntry {
  recipeId: mongoose.Types.ObjectId;
  timesAddedToMenu: number;
  firstAddedToMenu: Date;
  lastAddedToMenu: Date;
  lastRemovedFromMenu: Date;
}

export interface IRecipeMenu extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  entries: IRecipeMenuEntry[];
  history: IMenuHistoryEntry[];
}

const RecipeMenuEntrySchema = new Schema<IRecipeMenuEntry>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    serves: { type: Number, required: true },
  },
  { _id: false }
);

const MenuHistoryEntrySchema = new Schema<IMenuHistoryEntry>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    timesAddedToMenu: { type: Number, required: true },
    firstAddedToMenu: { type: Date, required: true },
    lastAddedToMenu: { type: Date, required: true },
    lastRemovedFromMenu: { type: Date, required: true },
  },
  { _id: false }
);

const RecipeMenuSchema = new Schema<IRecipeMenu>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    entries: { type: [RecipeMenuEntrySchema], default: [] },
    history: { type: [MenuHistoryEntrySchema], default: [] },
  },
  {
    timestamps: true,
    collection: "RecipeMenu",
  }
);

const RecipeMenu: Model<IRecipeMenu> = mongoose.model<IRecipeMenu>(
  "RecipeMenu",
  RecipeMenuSchema
);
export default RecipeMenu;
