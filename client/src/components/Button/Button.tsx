"use client";

import React from "react";
import "./styles.scss";
import Icon from "../Icon/Icon";

type ButtonProps = {
  type?: "primary" | "secondary" | "tertiary";
  inverse?: boolean;
  border?: boolean;
  onPress?: () => void;
  text?: string;
  children?: React.ReactNode;
};

const Button = ({
  type,
  inverse,
  border,
  onPress,
  text,
  children,
}: ButtonProps) => {
  const buttonClasses = `btn btn--${type || "primary"} ${
    border ? "btn--border" : ""
  } ${inverse ? "btn--inverse " : ""} ${text ? "min-w-[125px]" : ""}`;

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <button className={buttonClasses} onClick={handlePress} aria-label={text}>
      {text && <span className="w-full p-1">{text}</span>}
      {children && <Icon>{children}</Icon>}
    </button>
  );
};

export default Button;
