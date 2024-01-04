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
import AnimateHeight, { Height } from 'react-animate-height';

interface Tabs {
	children: ReactNode[];
	titles: string[];
	isModal?: boolean;
}

const Tabs: FC<Tabs> = ({ children, titles, isModal }) => {
	const [activeIndex, setActiveIndex] = useState(0);

	// Update slider position
	const sliderRef = useRef<HTMLDivElement>(null);
	const updateSliderPosition = () => {
		const slider = sliderRef.current;
		if (slider) {
			const tabWidth = 100 / titles.length;
			const leftOffset = tabWidth * activeIndex;

			slider.style.left = `${leftOffset}%`;
			slider.style.width = `${tabWidth}%`;
		}
	};

	useEffect(updateSliderPosition, [activeIndex]);

	// Update height of content
	const [height, setHeight] = useState<Height>('auto');
	const contentDiv = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isModal) return;

		const element = contentDiv.current as HTMLDivElement;

		const resizeObserver = new ResizeObserver(() => {
			setHeight(element.clientHeight);
		});

		resizeObserver.observe(element);

		return () => resizeObserver.disconnect();
	}, [activeIndex]);

	return (
		<RadixTabs.Root
			defaultValue={titles[0]}
			onValueChange={(value) => {
				const index = titles.indexOf(value);
				setActiveIndex(index);
			}}
		>
			<div className="max-w-screen-md md:mx-auto">
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

			{isModal ? (
				<AnimateHeight height={height} contentRef={contentDiv}>
					{Children.map(children, (child, index) => (
						<RadixTabs.Content className="px-4" value={titles[index]}>
							{child}
						</RadixTabs.Content>
					))}
				</AnimateHeight>
			) : (
				<div>
					{Children.map(children, (child, index) => (
						<RadixTabs.Content value={titles[index]}>{child}</RadixTabs.Content>
					))}
				</div>
			)}
		</RadixTabs.Root>
	);
};

export default Tabs;
