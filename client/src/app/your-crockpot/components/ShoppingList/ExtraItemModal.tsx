import { ChangeEvent, FC, Dispatch, SetStateAction } from 'react';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';
import Button from '@/src/components/Button/Button';

interface ExtraItemModalProps {
	amountValue: number;
	setAmountValue: Dispatch<SetStateAction<number>>;
	extraUnit: string;
	setExtraUnit: Dispatch<SetStateAction<string>>;
	onSubmit: () => void;
}

const ExtraItemModal: FC<ExtraItemModalProps> = ({
	amountValue,
	setAmountValue,
	extraUnit,
	setExtraUnit,
	onSubmit,
}) => {
	const handleUnitChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setExtraUnit(event.target.value);
	};
	return (
		<div className='flex flex-col items-center gap-4 p-8'>
			<div className='flex items-center justify-center gap-8 flex-grow mb-4'>
				<div className='flex flex-col gap-2'>
					<label htmlFor='amount'>Amount</label>
					<QuantityInput
						id='amount'
						value={amountValue}
						setValue={setAmountValue}
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='unit'>Unit (if applicable)</label>
					<select
						className='border text-xl w-full py-1'
						id='unit'
						onChange={handleUnitChange}
						value={extraUnit}
					>
						<option value=''>-</option>
						<option value='cans'>Cans</option>
						<option value='g'>g</option>
						<option value='ml'>ml</option>
						<option value='tbsp'>Tablespoons</option>
						<option value='tsp'>Teaspoons</option>
					</select>
				</div>
			</div>
			<Button onClick={onSubmit} inverse text='Add to Shopping List' />
		</div>
	);
};

export default ExtraItemModal;
