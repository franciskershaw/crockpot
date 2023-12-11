import { FC, useState } from 'react';
import ImageInput from '../FormComponents/ImageInput/ImageInput';
import TextInput from '../FormComponents/TextInput/TextInput';
import SelectInput from '../FormComponents/SelectInput/SelectInput';
import QuantityInput from '../QuantityInput/QuantityInput';

const AddRecipe: FC<{}> = () => {
	const [recipeName, setRecipeName] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [prepTime, setPrepTime] = useState<number>(30);
	const [serves, setServes] = useState<number>(4);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// Dummy categories data
	const fakeCategories = [
		{ value: 'dessert', label: 'Dessert' },
		{ value: 'main-course', label: 'Main Course' },
		{ value: 'appetizer', label: 'Appetizer' },
	];

	const handleRecipeNameChange = (name: string) => {
		setRecipeName(name);
	};

	const handleCategoryChange = (newCategories: string[]) => {
		setSelectedCategories(newCategories);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<TextInput
				id='recipeName'
				value={recipeName}
				onChange={handleRecipeNameChange}
				label='Recipe Name*'
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
					label='Prep Time*'
				/>
				<QuantityInput
					label='Serves*'
					id='serves'
					value={serves}
					setValue={setServes}
				/>
			</div>
			<SelectInput
				id='selectCategory'
				options={fakeCategories}
				value={selectedCategories}
				onChange={handleCategoryChange}
				label='Select Categories*'
				isMulti
				placeholder='Please select categories'
			/>
		</form>
	);
};

export default AddRecipe;
