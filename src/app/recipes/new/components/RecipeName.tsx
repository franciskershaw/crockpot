import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CreateRecipeInput } from "@/lib/validations";

const RecipeName = ({ control }: { control: Control<CreateRecipeInput> }) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recipe Name *</FormLabel>
          <FormControl>
            <Input placeholder="e.g. Slow Cooker Beef Stew" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecipeName;
