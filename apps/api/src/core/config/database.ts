import mongoose from "mongoose";

// Import all models to register them with Mongoose
// This ensures they're available for populate() operations
import "../../features/items/model/item.model";
import "../../features/items/model/itemCategory.model";
import "../../features/menu/model/recipeMenu.model";
import "../../features/recipes/model/recipe.model";
import "../../features/recipes/model/recipeCategory.model";
import "../../features/units/model/unit.model";
import "../../features/users/model/user.model";

const connectDb = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }
  const connection = await mongoose.connect(mongoUri);
  console.log("-------------------------------------------------------------");
  console.log(`MongoDB connected on ${connection.connection.host}`);
  return connection;
};

export default connectDb;
