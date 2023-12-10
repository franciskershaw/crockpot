import { FC } from 'react';

interface ImageInputProps {
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const ImageInput: FC<ImageInputProps> = ({ setImage }) => {
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setImage(event.target.files[0]);
		} else {
			setImage(null);
		}
	};

	return (
		<input
			type='file'
			id='recipeImage'
			className='border p-2 rounded-lg text-sm'
			onChange={handleImageChange}
			accept='image/*'
		/>
	);
};

export default ImageInput;
