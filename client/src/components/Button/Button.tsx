"use client";

import React from "react";
import "./styles.scss";
import Icon from "../Icon/Icon";

type ButtonProps = {
  type?: "primary" | "secondary" | "tertiary";
  inverse?: boolean;
  border?: boolean;
  onClick?: () => void;
  text?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
};

const Button = ({
  type,
  inverse,
  border,
  onClick,
  text,
  ariaLabel,
  children,
}: ButtonProps) => {
  const buttonClasses = `btn btn--${type || "primary"} ${
    border ? "btn--border" : ""
  } ${inverse ? "btn--inverse " : ""} ${text ? "min-w-[125px]" : ""}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      aria-label={ariaLabel ?? text}
    >
      {text && <span className="w-full p-1">{text}</span>}
      {children && <Icon>{children}</Icon>}
    </button>
  );
};

export default Button;
