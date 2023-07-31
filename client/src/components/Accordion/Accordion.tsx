// Checkbox component used on Browse page - Recipe filter, Shopping list page

// TODO -

import React from "react";
import * as AccordionRadix from "@radix-ui/react-accordion";
import Icon from "@/src/components/Icon/Icon";
import { BsChevronDown } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

type AccordionItemProps = {
  heading: string;
  children: React.ReactNode;
};

const AccordionItem = ({ heading, children }: AccordionItemProps) => {
  const value = React.useMemo(() => uuidv4(), []);

  return (
    <AccordionRadix.Item value={value} className="border-t border-black py-3">
      <AccordionRadix.Header>
        <AccordionRadix.Trigger className="AccordionTrigger flex justify-between items-center w-full">
          <span>{heading}</span>
          <div className="AccordionChevron">
            <Icon>
              <BsChevronDown />
            </Icon>
          </div>
        </AccordionRadix.Trigger>
      </AccordionRadix.Header>
      <AccordionRadix.Content className="AccordionContent pt-2">
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
    <AccordionRadix.Root type="multiple">
      {items.map((item) => (
        <AccordionItem key={uuidv4()} heading={item.heading}>
          {item.children}
        </AccordionItem>
      ))}
    </AccordionRadix.Root>
  );
};

export default Accordion;
