import { FC, useState, useEffect, useRef } from 'react';
import InputGroup from '../InputGroup/InputGroup';
import Button from '../../Button/Button';

interface ImageInputProps {
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
	label: string;
	id: string;
	existingImageUrl?: string;
}

const ImageInput: FC<ImageInputProps> = ({
	setImage,
	id,
	label,
	existingImageUrl,
}) => {
	const [currentImage, setCurrentImage] = useState<string | undefined>(
		existingImageUrl,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setCurrentImage(existingImageUrl);
	}, [existingImageUrl]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setImage(event.target.files[0]);
			setCurrentImage(URL.createObjectURL(event.target.files[0]));
		} else {
			setImage(null);
		}
	};

	const handleImageClear = () => {
		setImage(null);
		setCurrentImage(undefined);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<InputGroup label={label} htmlFor={id}>
			{currentImage ? (
				<div className='flex justify-between items-center'>
					<img
						src={currentImage}
						alt='Current'
						style={{ maxWidth: '200px', maxHeight: '200px' }}
					/>
					<div className='w-full flex justify-center'>
						<Button border text='Clear Image' onClick={handleImageClear} />
					</div>
				</div>
			) : (
				<Button border text='Choose File' onClick={handleButtonClick} />
			)}
			<input
				type='file'
				id={id}
				ref={fileInputRef}
				className='hidden'
				onChange={handleImageChange}
				accept='image/*'
			/>
		</InputGroup>
	);
};

export default ImageInput;
