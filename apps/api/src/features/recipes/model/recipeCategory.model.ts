import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRecipeCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  recipeIds: mongoose.Types.ObjectId[];
}

const RecipeCategorySchema = new Schema<IRecipeCategory>(
  {
    name: { type: String, required: true, unique: true },
    recipeIds: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
    collection: "RecipeCategory",
  }
);

const RecipeCategory: Model<IRecipeCategory> = mongoose.model<IRecipeCategory>(
  "RecipeCategory",
  RecipeCategorySchema
);
export default RecipeCategory;
