import { FC, useState, useMemo, useEffect } from 'react';
import ImageInput from '../FormComponents/ImageInput/ImageInput';
import TextInput from '../FormComponents/TextInput/TextInput';
import SelectInput from '../FormComponents/SelectInput/SelectInput';
import QuantityInput from '../QuantityInput/QuantityInput';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import useItems from '@/src/hooks/items/useItems';
import SearchBar from '../FormSearchBar/SearchBar';

const AddRecipe: FC<{}> = () => {
	const [recipeName, setRecipeName] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [prepTime, setPrepTime] = useState<number>(30);
	const [serves, setServes] = useState<number>(4);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [ingredientSearch, setIngredientSearch] = useState<string>('');

	const { recipeCategories } = useRecipeCategories();

	const { filterItems, allItems } = useItems();

	const searchResults = useMemo(() => {
		return filterItems(allItems, ingredientSearch);
	}, [allItems, ingredientSearch, filterItems]);

	const handleRecipeNameChange = (name: string) => {
		setRecipeName(name);
	};

	const handleCategoryChange = (newCategories: string[]) => {
		setSelectedCategories(newCategories);
	};

	useEffect(() => {
		console.log(searchResults);
	}, [searchResults]);

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
				options={recipeCategories.map((category) => ({
					value: category._id,
					label: category.name,
				}))}
				value={selectedCategories}
				onChange={handleCategoryChange}
				label='Select Categories (max 3)*'
				isMulti
				placeholder='Please select categories'
			/>
			<SearchBar
				searchQuery={ingredientSearch}
				setSearchQuery={setIngredientSearch}
				label='Search ingredients'
			/>
			{searchResults.length ? <p>{searchResults.length}</p> : null}
		</form>
	);
};

export default AddRecipe;
