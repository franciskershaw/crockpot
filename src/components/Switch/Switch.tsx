import * as SwitchRadix from '@radix-ui/react-switch';
import { v4 as uuidv4 } from 'uuid';

import './styles.scss';

type SwitchProps = {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
};

export default function Switch({ label, checked, onChange }: SwitchProps) {
	const switchId = uuidv4();

	return (
		<div className="flex items-center">
			<label className="pr-2 label--switch" htmlFor={switchId}>
				{label}
			</label>
			<SwitchRadix.Root
				className="SwitchRoot cursor-pointer"
				id={switchId}
				checked={checked}
				onCheckedChange={onChange}
			>
				<SwitchRadix.Thumb className="SwitchThumb" />
			</SwitchRadix.Root>
		</div>
	);
}
