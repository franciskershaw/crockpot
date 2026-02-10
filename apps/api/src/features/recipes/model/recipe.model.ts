import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRecipeImage {
  url?: string;
  filename?: string;
}

export interface IRecipeIngredient {
  itemId: mongoose.Types.ObjectId;
  unitId?: mongoose.Types.ObjectId | null;
  quantity: number;
}

export interface IRecipe extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  timeInMinutes: number;
  instructions: string[];
  notes: string[];
  approved: boolean;
  serves: number;
  createdById?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  categoryIds: mongoose.Types.ObjectId[];
  image?: IRecipeImage | null;
  ingredients: IRecipeIngredient[];
}

const RecipeImageSchema = new Schema<IRecipeImage>(
  {
    url: { type: String, required: false },
    filename: { type: String, required: false },
  },
  { _id: false }
);

const RecipeIngredientSchema = new Schema<IRecipeIngredient>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: false },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true },
    timeInMinutes: { type: Number, required: true },
    instructions: { type: [String], default: [] },
    notes: { type: [String], default: [] },
    approved: { type: Boolean, default: false },
    serves: { type: Number, required: true },
    createdById: { type: Schema.Types.ObjectId, ref: "User", required: false },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "RecipeCategory" }],
    image: { type: RecipeImageSchema, required: false },
    ingredients: { type: [RecipeIngredientSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "Recipe",
  }
);

const Recipe: Model<IRecipe> = mongoose.model<IRecipe>("Recipe", RecipeSchema);
export default Recipe;
