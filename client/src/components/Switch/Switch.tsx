import * as SwitchRadix from '@radix-ui/react-switch';
import { v4 as uuidv4 } from 'uuid';
import './styles.scss';

type SwitchProps = {
	label: string;
};

export default function Switch({ label }: SwitchProps) {
	const switchId = uuidv4();

	const handleCheckedChange = (isChecked: boolean) => {
		console.log(label, isChecked);
	};

	return (
		<div className="flex items-center">
			<label className="pr-2" htmlFor={switchId}>
				{label}
			</label>
			<SwitchRadix.Root
				className="SwitchRoot"
				id={switchId}
				onCheckedChange={handleCheckedChange}
			>
				<SwitchRadix.Thumb className="SwitchThumb" />
			</SwitchRadix.Root>
		</div>
	);
}
