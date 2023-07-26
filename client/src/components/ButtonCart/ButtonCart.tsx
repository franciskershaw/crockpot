import { RiShoppingBasketLine } from "react-icons/ri";
import * as Toggle from "@radix-ui/react-toggle";
import { useState } from "react";
import Icon from "../Icon/Icon";
import QuantityInput from "../QuantityInput/QuantityInput";

type ButtonCartProps = {
  recipeId: string;
};

const ButtonCart = ({ recipeId }: ButtonCartProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleCartChange = (pressed: boolean) => {
    setIsPressed(pressed);

    console.log(pressed, recipeId);
  };

  const handleQuantityChange = (value: number) => {
    console.log("Quantity changed:", value);
  };

  return (
    <Toggle.Root onPressedChange={handleCartChange} className="cursor-pointer">
      {isPressed ? (
        <QuantityInput initialValue={10} onChange={handleQuantityChange} />
      ) : (
        <Icon border active={isPressed} size="lg">
          <RiShoppingBasketLine />
        </Icon>
      )}
    </Toggle.Root>
  );
};

export default ButtonCart;
