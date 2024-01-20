import { useMemo } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { v4 as uuidv4 } from 'uuid';

import Icon from '@/src/components/Icon/Icon';

import './styles.scss';

type CheckboxProps = {
	label?: string;
	id?: string;
	isChecked: boolean;
	onChange: (values: boolean) => void;
};

export default function Checkbox({
	label,
	id,
	isChecked,
	onChange,
}: CheckboxProps) {
	const checkboxId = useMemo(() => uuidv4(), []);

	return (
		<div className="flex items-center overflow-hidden">
			<CheckboxRadix.Root
				className="CheckboxRoot"
				id={id ? id : checkboxId}
				onCheckedChange={onChange}
				checked={isChecked}
			>
				<CheckboxRadix.Indicator className="CheckboxIndicator">
					<Icon size="sm">
						<AiOutlineCheck />
					</Icon>
				</CheckboxRadix.Indicator>
			</CheckboxRadix.Root>
			{label && (
				<label
					className="pl-2 cursor-pointer truncate"
					htmlFor={id ? id : checkboxId}
				>
					{label}
				</label>
			)}
		</div>
	);
}
