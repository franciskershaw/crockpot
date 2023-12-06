import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { AiOutlineCheck } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import Icon from '../Icon/Icon';
import './styles.scss';
import { useMemo } from 'react';

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
	const checkboxId = useMemo(() => uuidv4(), []);

	return (
		<div className="flex items-center">
			<CheckboxRadix.Root
				className="CheckboxRoot"
				id={checkboxId}
				onCheckedChange={onChange}
				checked={isChecked}
			>
				<CheckboxRadix.Indicator className="CheckboxIndicator">
					<Icon size="sm">
						<AiOutlineCheck />
					</Icon>
				</CheckboxRadix.Indicator>
			</CheckboxRadix.Root>
			<label className="pl-2 cursor-pointer" htmlFor={checkboxId}>
				{label}
			</label>
		</div>
	);
}
