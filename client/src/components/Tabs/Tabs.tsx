import React, {
	ReactNode,
	FC,
	Children,
	useEffect,
	useRef,
	useState,
} from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import './styles.scss';

interface Tabs {
	children: ReactNode[];
	titles: string[];
}

const Tabs: FC<Tabs> = ({ children, titles }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);

	const updateSliderPosition = () => {
		const slider = sliderRef.current;
		if (slider) {
			// Assuming each tab has equal width
			const tabWidth = 100 / titles.length; // as a percentage
			const leftOffset = tabWidth * activeIndex;

			slider.style.left = `${leftOffset}%`;
			slider.style.width = `${tabWidth}%`;
		}
	};

	useEffect(updateSliderPosition, [activeIndex]);

	return (
		<RadixTabs.Root
			defaultValue={titles[0]}
			onValueChange={(value) => {
				const index = titles.indexOf(value);
				setActiveIndex(index);
			}}
		>
			<div className="max-w-screen-md mx-2 md:mx-auto">
				<RadixTabs.List className="tabs">
					<div className="tabs-toggle" ref={sliderRef}>
						<div className="bg-black/25 w-full h-full rounded-full" />
					</div>
					{titles.map((title, index) => (
						<RadixTabs.Trigger
							key={index}
							value={title}
							className="tab"
							data-active-class="tab--active"
						>
							{title}
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
