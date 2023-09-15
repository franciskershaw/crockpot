// HeaderToggle.tsx
import React, { ReactNode, FC, Children } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import "./styles.scss";

interface HeaderToggleProps {
  children: ReactNode[];
  titles: string[];
}

const HeaderToggle: FC<HeaderToggleProps> = ({ children, titles }) => {
  return (
    <Tabs.Root defaultValue={titles[0]}>
      <div className="max-w-screen-md mx-auto">
        <Tabs.List className="flex justify-between bg-gray-200 p-2 rounded-t relative">
          {titles.map((title, index) => (
            <Tabs.Trigger
              key={index}
              value={title}
              className="flex-1 text-center py-2 transition duration-300 ease-in-out relative"
              data-active-class="underline-active"
            >
              {title}
              <span className="underline"></span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      {Children.map(children, (child, index) => (
        <Tabs.Content
          value={titles[index]}
          className="p-4 border rounded-b border-t-0 w-full"
        >
          {child}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default HeaderToggle;
