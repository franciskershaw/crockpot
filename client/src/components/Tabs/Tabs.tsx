import React, { ReactNode, FC, Children } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import './styles.scss';

interface Tabs {
	children: ReactNode[];
	titles: string[];
}

const Tabs: FC<Tabs> = ({ children, titles }) => {
	return (
		<RadixTabs.Root defaultValue={titles[0]}>
			<div className="max-w-screen-md mx-auto">
				<RadixTabs.List className="flex justify-between p-2 pb-0 rounded-t relative">
					{titles.map((title, index) => (
						<RadixTabs.Trigger
							key={index}
							value={title}
							className="flex-1 text-center py-2 transition duration-300 ease-in-out relative"
							data-active-class="underline-active"
						>
							{title}
							<span className="underline-header-toggle"></span>
						</RadixTabs.Trigger>
					))}
				</RadixTabs.List>
			</div>

			{Children.map(children, (child, index) => (
				<RadixTabs.Content className="px-4" value={titles[index]}>
					{child}
				</RadixTabs.Content>
			))}
		</RadixTabs.Root>
	);
};

export default Tabs;
