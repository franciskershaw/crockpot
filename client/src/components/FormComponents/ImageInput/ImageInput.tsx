import { FC } from 'react';
import InputGroup from '../InputGroup/InputGroup';

interface ImageInputProps {
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
	label: string;
	id: string;
}

const ImageInput: FC<ImageInputProps> = ({ setImage, id, label }) => {
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setImage(event.target.files[0]);
		} else {
			setImage(null);
		}
	};

	return (
		<InputGroup label={label} htmlFor={id}>
			<input
				type='file'
				id={id}
				className='border p-2 rounded-lg text-sm'
				onChange={handleImageChange}
				accept='image/*'
			/>
		</InputGroup>
	);
};

export default ImageInput;
