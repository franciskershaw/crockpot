import { FC, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import Button from '../../Button/Button';
import InputGroup from '../InputGroup/InputGroup';

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
				<>
					<div className="h-[200px] w-full border border-borderDark bg-white-input rounded flex justify-center">
						<Image
							src={currentImage}
							alt={'Current'}
							height={100}
							width={100}
						/>
					</div>
					<div className="w-full flex justify-center mt-2">
						<Button
							type="primary"
							text="Clear Image"
							onClick={handleImageClear}
						/>
					</div>
				</>
			) : (
				<>
					<div className="h-[200px] w-full border border-borderDark bg-white-input rounded" />
					<div className="w-full flex justify-center mt-2">
						<Button
							type="primary"
							text="Choose File"
							onClick={handleButtonClick}
						/>
					</div>
				</>
			)}
			<input
				type="file"
				id={id}
				ref={fileInputRef}
				className="hidden"
				onChange={handleImageChange}
				accept="image/*"
			/>
		</InputGroup>
	);
};

export default ImageInput;
