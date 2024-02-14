import { AiOutlineClockCircle } from 'react-icons/ai';

import Icon from '@/components/Icon/Icon';

type TimingTagProps = {
	time: number;
};

const TimingTag = ({ time }: TimingTagProps) => {
	return (
		<div className="flex items-center bg-white rounded-full pr-2 border border-black-50">
			<Icon type="tertiary" inverse>
				<AiOutlineClockCircle />
			</Icon>
			<span className="font-bold">{time} mins</span>
		</div>
	);
};

export default TimingTag;
