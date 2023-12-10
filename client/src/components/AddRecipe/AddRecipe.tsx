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
			<TextInput
				id='recipeName'
				value={recipeName}
				onChange={handleRecipeNameChange}
				label='Recipe Name'
			/>
			<ImageInput
				setImage={setSelectedImage}
				label='Upload Image'
				id='recipeImage'
			/>
			<div className='flex justify-between'>
				<QuantityInput
					value={prepTime}
					setValue={setPrepTime}
					id='prepTime'
					label='Prep Time'
				/>
				<QuantityInput
					label='Serves'
					id='serves'
					value={serves}
					setValue={setServes}
				/>
			</div>
		</form>
	);
};

export default AddRecipe;
