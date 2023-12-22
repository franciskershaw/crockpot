import { FC, useState, useMemo, useEffect, ChangeEvent } from 'react';
import ImageInput from '../FormComponents/ImageInput/ImageInput';
import TextInput from '../FormComponents/TextInput/TextInput';
import SelectInput from '../FormComponents/SelectInput/SelectInput';
import QuantityInput from '../QuantityInput/QuantityInput';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';
import useItems from '@/src/hooks/items/useItems';
import SearchBar from '../FormSearchBar/SearchBar';
import { AddRecipeIngredient, Item, Unit } from '@/src/types/types';
import InputGroup from '../FormComponents/InputGroup/InputGroup';
import Button from '../Button/Button';
import { FaTrash } from 'react-icons/fa';

const AddRecipe: FC<{}> = () => {
	const [recipeName, setRecipeName] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [prepTime, setPrepTime] = useState<number>(30);
	const [serves, setServes] = useState<number>(4);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [ingredientSearch, setIngredientSearch] = useState<string>('');
	const [selectedIngredients, setSelectedIngredients] = useState<
		AddRecipeIngredient[]
	>([]);

	const { recipeCategories } = useRecipeCategories();

	const { filterItems, ingredients } = useItems();

	const searchResults = useMemo(() => {
		return filterItems(ingredients, ingredientSearch);
	}, [ingredients, ingredientSearch, filterItems]);

	const handleRecipeNameChange = (name: string) => {
		setRecipeName(name);
	};

	const handleCategoryChange = (newCategories: string[]) => {
		setSelectedCategories(newCategories);
	};

	const addIngredient = (result: Item) => {
		setSelectedIngredients((prev) => [
			...prev,
			{
				_id: result._id,
				name: result.name,
				quantity: 1,
				unit: '',
			},
		]);
		setIngredientSearch('');
	};

	const handleQuantityChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const { value } = e.target;
		let newQuantity: number | null = null; // Allow for a null state

		if (value !== '' && !isNaN(value as any)) {
			newQuantity = value.includes('.') ? parseFloat(value) : parseInt(value);
		}

		setSelectedIngredients((prev) =>
			prev.map((ingredient, idx) =>
				idx === index ? { ...ingredient, quantity: newQuantity } : ingredient,
			),
		);
	};

	const handleUnitChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
		index: number,
	) => {
		const value = e.target.value as Unit;

		setSelectedIngredients((prev) =>
			prev.map((ingredient, idx) =>
				idx === index ? { ...ingredient, unit: value } : ingredient,
			),
		);
	};

	const handleRemoveIngredient = (index: number) => {
		setSelectedIngredients((prev) => prev.filter((_, idx) => idx !== index));
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
			{searchResults.length > 0 && (
				<div className='absolute bottom-16 w-1/2 z-modal mt-1 bg-white border border-black-25 shadow'>
					{searchResults.map((result) => (
						<p onClick={() => addIngredient(result)} key={result._id}>
							{result.name}
						</p>
					))}
				</div>
			)}
			<InputGroup label='Ingredients*'>
				<SearchBar
					searchQuery={ingredientSearch}
					setSearchQuery={setIngredientSearch}
					placeholder='Search for ingredients'
				/>
				{selectedIngredients.map((ingredient, index) => (
					<div
						className='flex justify-between mt-4 items-center'
						key={`${ingredient._id}_${index}`}
					>
						<p className='text-sm'>{ingredient.name}</p>
						<input
							type='number'
							name=''
							id=''
							value={ingredient.quantity !== null ? ingredient.quantity : ''}
							onChange={(e) => handleQuantityChange(e, index)}
							className='w-[50px] border border-black rounded text-center p-0.5 text-sm'
						/>

						<div className='flex flex-col gap-2'>
							<select
								className='border w-24 py-1 text-sm'
								name=''
								id=''
								onChange={(e) => handleUnitChange(e, index)}
								value={ingredient.unit}
							>
								<option value=''>-</option>
								<option value='cans'>Cans</option>
								<option value='g'>g</option>
								<option value='ml'>ml</option>
								<option value='tbsp'>Tablespoons</option>
								<option value='tsp'>Teaspoons</option>
							</select>
						</div>
						<Button
							onClick={() => handleRemoveIngredient(index)}
							type='primary'
							border
							iconXs
						>
							<FaTrash />
						</Button>
					</div>
				))}
			</InputGroup>
		</form>
	);
};

export default AddRecipe;
