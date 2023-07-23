import { HeartFilledIcon } from "@radix-ui/react-icons";
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
        <HeartFilledIcon />
      </Icon>
    </Toggle.Root>
  );
};

export default ButtonFav;
