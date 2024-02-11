import React from 'react';
import { useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

import * as AccordionRadix from '@radix-ui/react-accordion';
import { v4 as uuidv4 } from 'uuid';

import Icon from '@/components/Icon/Icon';

import './styles.scss';

type AccordionItemProps = {
	heading: React.ReactNode;
	children: React.ReactNode;
};

const AccordionItem = ({ heading, children }: AccordionItemProps) => {
	const value = React.useMemo(() => uuidv4(), []);

	return (
		<AccordionRadix.Item value={value} className="border-t border-black py-3">
			<AccordionRadix.Header>
				<AccordionRadix.Trigger className="AccordionTrigger flex justify-between items-center w-full">
					{heading}
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
	const [openItems, setOpenItems] = useState<string[]>([]);
	return (
		<AccordionRadix.Root
			type="multiple"
			value={openItems}
			onValueChange={setOpenItems}
		>
			{items.map((item, index) => (
				<AccordionItem key={index} heading={item.heading}>
					{item.children}
				</AccordionItem>
			))}
		</AccordionRadix.Root>
	);
};

export default Accordion;
