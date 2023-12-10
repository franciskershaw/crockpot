import { FC, useState } from 'react';
import ImageInput from '../FormComponents/ImageInput/ImageInput';
import TextInput from '../FormComponents/TextInput/TextInput';
import InputGroup from '../FormComponents/InputGroup/InputGroup';

const AddRecipe: FC<{}> = () => {
	const [recipeName, setRecipeName] = useState('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const handleRecipeNameChange = (name: string) => {
		setRecipeName(name);
	};

	return (
		<form>
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
		</form>
	);
};

export default AddRecipe;
