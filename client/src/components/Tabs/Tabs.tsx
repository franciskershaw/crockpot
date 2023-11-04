import React from 'react';
import * as TabsRadix from '@radix-ui/react-tabs';

interface TabsProps {
	tabTitleOne: string;
	tabTitleTwo: string;
	tabTitleThree?: string;
	tabContentOne: JSX.Element;
	tabContentTwo: JSX.Element;
	tabContentThree?: JSX.Element;
}

const Tabs: React.FC<TabsProps> = ({
	tabTitleOne,
	tabTitleTwo,
	tabTitleThree,
	tabContentOne,
	tabContentTwo,
	tabContentThree,
}) => {
	return (
		<TabsRadix.Root defaultValue="tab1" orientation="vertical">
			<TabsRadix.List
				className="flex justify-around border-b border-gray-300 pb-2 h3 cursor-pointer"
				aria-label="tab"
			>
				<TabsRadix.Trigger value="tab1">{tabTitleOne}</TabsRadix.Trigger>
				<TabsRadix.Trigger value="tab2">{tabTitleTwo}</TabsRadix.Trigger>
				{tabTitleThree && (
					<TabsRadix.Trigger value="tab3">{tabTitleThree}</TabsRadix.Trigger>
				)}
			</TabsRadix.List>
			<div className="p-4">
				<TabsRadix.Content value="tab1">{tabContentOne}</TabsRadix.Content>
				<TabsRadix.Content value="tab2">{tabContentTwo}</TabsRadix.Content>
				{tabContentThree && (
					<TabsRadix.Content value="tab3">{tabContentThree}</TabsRadix.Content>
				)}
			</div>
		</TabsRadix.Root>
	);
};

export default Tabs;
