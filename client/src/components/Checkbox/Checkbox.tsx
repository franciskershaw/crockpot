import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { AiOutlineCheck } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import Icon from '../Icon/Icon';
import './styles.scss';

type CheckboxProps = {
	label: string;
	isChecked: boolean;
	onChange: (values: boolean) => void;
};

export default function Checkbox({
	label,
	isChecked,
	onChange,
}: CheckboxProps) {
	return (
		<div className='flex items-center'>
			<CheckboxRadix.Root
				className='CheckboxRoot'
				id={uuidv4()}
				onCheckedChange={onChange}
				checked={isChecked}
			>
				<CheckboxRadix.Indicator className='CheckboxIndicator'>
					<Icon size='sm'>
						<AiOutlineCheck />
					</Icon>
				</CheckboxRadix.Indicator>
			</CheckboxRadix.Root>
			<label className='pl-2 cursor-pointer' htmlFor={uuidv4()}>
				{label}
			</label>
		</div>
	);
}
