// Checkbox component used on Browse page - Recipe filter, Shopping list page

// TODO -

import * as AccordionRadix from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.scss";

type AccordionItemProps = {
  heading: string;
  children: React.ReactNode;
  value: string;
};

const AccordionItem = ({ heading, children, value }: AccordionItemProps) => (
  <AccordionRadix.Item
    value={value}
    className="border-2 border-black border-b-0 p-2"
  >
    <AccordionRadix.Header>
      <AccordionRadix.Trigger className="AccordionTrigger flex justify-between items-center w-full">
        <span>{heading}</span>
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </AccordionRadix.Trigger>
    </AccordionRadix.Header>
    <AccordionRadix.Content className="AccordionContent pt-1">
      {children}
    </AccordionRadix.Content>
  </AccordionRadix.Item>
);

interface AccordionProps {
  items: AccordionItemProps[];
}

const Accordion = ({ items }: AccordionProps) => {
  return (
    <AccordionRadix.Root
      type="single"
      collapsible
      className="border-b-2 border-black"
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          heading={item.heading}
          children={item.children}
          value={item.value}
        />
      ))}
    </AccordionRadix.Root>
  );
};

export default Accordion;
