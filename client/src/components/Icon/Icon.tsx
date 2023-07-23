import "./styles.scss";

type IconProps = {
  type?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  border?: boolean;
  children: React.ReactNode;
};

const Icon = ({ type, size, border, children }: IconProps) => {
  const iconClasses = `icon ${border ? "icon--border" : ""} icon--${
    type || "primary"
  } icon--${size || "md"}`;

  return <div className={iconClasses}>{children}</div>;
};

export default Icon;
