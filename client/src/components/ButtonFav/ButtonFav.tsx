import { AiFillHeart } from "react-icons/ai";
import * as Toggle from "@radix-ui/react-toggle";
import { useState } from "react";
import Icon from "../Icon/Icon";

type ButtonFavProps = {
  recipeId: string;
};

const ButtonFav = ({ recipeId }: ButtonFavProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleFavChange = (pressed: boolean) => {
    setIsPressed(pressed);

    console.log(pressed, recipeId);
  };

  return (
    <Toggle.Root onPressedChange={handleFavChange}>
      <Icon border active={isPressed}>
        <AiFillHeart />
      </Icon>
    </Toggle.Root>
  );
};

export default ButtonFav;
