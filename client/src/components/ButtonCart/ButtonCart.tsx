import { RiShoppingBasketLine } from "react-icons/ri";
import * as Toggle from "@radix-ui/react-toggle";
import { useState } from "react";
import Icon from "../Icon/Icon";

type ButtonCartProps = {
  recipeId: string;
};

const ButtonCart = ({ recipeId }: ButtonCartProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleCartChange = (pressed: boolean) => {
    setIsPressed(pressed);

    console.log(pressed, recipeId);
  };

  return (
    <Toggle.Root onPressedChange={handleCartChange}>
      {isPressed ? (
        <>Quantity input</>
      ) : (
        <Icon border active={isPressed}>
          <RiShoppingBasketLine />
        </Icon>
      )}
    </Toggle.Root>
  );
};

export default ButtonCart;
