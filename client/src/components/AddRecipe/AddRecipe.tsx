import { FC, useState } from 'react';
import ImageInput from '../FormComponents/ImageInput/ImageInput';
import TextInput from '../FormComponents/TextInput/TextInput';
import InputGroup from '../FormComponents/InputGroup/InputGroup';
import QuantityInput from '../QuantityInput/QuantityInput';

const AddRecipe: FC<{}> = () => {
	const [recipeName, setRecipeName] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [prepTime, setPrepTime] = useState<number>(30);
	const [serves, setServes] = useState<number>(4);

	const handleRecipeNameChange = (name: string) => {
		setRecipeName(name);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<InputGroup label='Recipe Name' htmlFor='recipeName'>
				<TextInput
					id='recipeName'
					value={recipeName}
					onChange={handleRecipeNameChange}
				/>
			</InputGroup>

			<InputGroup label='Upload Image' htmlFor='recipeImage'>
				<ImageInput setImage={setSelectedImage} />
			</InputGroup>

			<div className='flex justify-between'>
				<InputGroup label='Prep Time' htmlFor='prepTime'>
					<QuantityInput value={prepTime} setValue={setPrepTime} />
				</InputGroup>
				<InputGroup label='Serves' htmlFor='serves'>
					<QuantityInput value={serves} setValue={setServes} />
				</InputGroup>
			</div>
		</form>
	);
};

export default AddRecipe;
