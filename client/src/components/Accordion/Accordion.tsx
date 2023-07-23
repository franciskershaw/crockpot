// Checkbox component used on Browse page - Recipe filter, Shopping list page

// TODO -

import React from "react";
import * as AccordionRadix from "@radix-ui/react-accordion";
import Icon from "@/src/components/Icon/Icon";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

type AccordionItemProps = {
  heading: string;
  children: React.ReactNode;
};

const AccordionItem = ({ heading, children }: AccordionItemProps) => {
  const value = React.useMemo(() => uuidv4(), []);

  return (
    <AccordionRadix.Item
      value={value}
      className="border-2 border-black border-b-0 p-2"
    >
      <AccordionRadix.Header>
        <AccordionRadix.Trigger className="AccordionTrigger flex justify-between items-center w-full">
          <span>{heading}</span>
          <Icon>
            <ChevronDownIcon className="AccordionChevron" aria-hidden />
          </Icon>
        </AccordionRadix.Trigger>
      </AccordionRadix.Header>
      <AccordionRadix.Content className="AccordionContent pt-1">
        {children}
      </AccordionRadix.Content>
    </AccordionRadix.Item>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
}

const Accordion = ({ items }: AccordionProps) => {
  return (
    <AccordionRadix.Root type="multiple" className="border-b-2 border-black">
      {items.map((item) => (
        <AccordionItem
          key={uuidv4()}
          heading={item.heading}
          children={item.children}
        />
      ))}
    </AccordionRadix.Root>
  );
};

export default Accordion;
