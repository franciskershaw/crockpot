import React from 'react';
import Icon from '../Icon/Icon';
import { AiOutlineClockCircle } from 'react-icons/ai';

type TimingTagProps = {
	time: number;
};

const TimingTag = ({ time }: TimingTagProps) => {
	return (
		<div className='flex items-center bg-white rounded-full pr-2 border border-black'>
			<Icon>
				<AiOutlineClockCircle />
			</Icon>
			<span className='font-bold'>{time} mins</span>
		</div>
	);
};

export default TimingTag;
