import { useEffect, useRef, useState } from 'react';

import * as SliderRadix from '@radix-ui/react-slider';

import './styles.scss';

function SliderThumbWithValue() {
	const [value, setValue] = useState('');
	const thumbRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const updateValue = () => {
			if (thumbRef.current) {
				const newValue = thumbRef.current.getAttribute('aria-valuenow');
				if (newValue !== null) {
					setValue(newValue);
				}
			}
		};

		const observer = new MutationObserver(updateValue);
		if (thumbRef.current) {
			observer.observe(thumbRef.current, {
				attributes: true,
			});

			updateValue();
		}

		return () => observer.disconnect();
	}, []);

	return (
		<SliderRadix.Thumb ref={thumbRef} className="SliderThumb">
			<div className="SliderThumbValue">{value}</div>
		</SliderRadix.Thumb>
	);
}

type SliderProps = {
	min: number;
	max: number;
	value: [number, number];
	onChange: (values: number[]) => void;
};

export default function Slider({ min, max, value, onChange }: SliderProps) {
	const handleValueChange = (values: number[]) => {
		onChange(values);
	};

	return (
		<SliderRadix.Root
			className="SliderRoot"
			value={value}
			min={min - 10 > 5 ? min - 10 : 5}
			max={max + 10}
			step={5}
			minStepsBetweenThumbs={1}
			onValueChange={handleValueChange}
		>
			<SliderRadix.Track className="SliderTrack">
				<SliderRadix.Range className="SliderRange" />
			</SliderRadix.Track>
			<SliderThumbWithValue />
			<SliderThumbWithValue />
		</SliderRadix.Root>
	);
}
