import React from "react";
import "./styles.scss";
import Icon from "../Icon/Icon";

type ButtonProps = {
  type?: "primary" | "secondary" | "tertiary";
  active?: boolean;
  border?: boolean;
  onPress: () => void;
  text?: string;
  children?: React.ReactNode;
};

const Button = ({
  type,
  active,
  border,
  onPress,
  text,
  children,
}: ButtonProps) => {
  const buttonClasses = `btn btn--${type || "primary"} ${
    border ? "btn--border" : ""
  } ${active ? "btn--active " : ""}`;

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <button className={buttonClasses} onClick={handlePress} aria-label={text}>
      {text && <span className="btn__text p-1">{text}</span>}
      {children && <Icon>{children}</Icon>}
    </button>
  );
};

export default Button;
