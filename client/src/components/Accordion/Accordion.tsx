// Checkbox component used on Browse page - Recipe filter, Shopping list page

// TODO -

import * as AccordionRadix from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.scss";

type AccordionItemProps = {
  heading: string;
  content: string;
  value: string;
};

const AccordionItem = ({ heading, content, value }: AccordionItemProps) => (
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
      {content}
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
          content={item.content}
          value={item.value}
        />
      ))}
    </AccordionRadix.Root>
  );
};

export default Accordion;
