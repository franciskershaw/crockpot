import { FC, useState, useMemo, Fragment } from 'react';
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
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useAddRecipe } from '@/src/hooks/recipes/useAddEditRecipe';

interface AddRecipeProps {
	setModal?: (open: boolean) => void;
}

const AddRecipe: FC<AddRecipeProps> = ({ setModal }) => {
	const [name, setName] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [timeInMinutes, setTimeInMinutes] = useState<number>(30);
	const [serves, setServes] = useState<number>(4);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [ingredientSearch, setIngredientSearch] = useState<string>('');
	const [selectedIngredients, setSelectedIngredients] = useState<
		AddRecipeIngredient[]
	>([]);
	const [instructions, setInstructions] = useState<string[]>(['']);
	const [notes, setNotes] = useState<string[]>(['']);

	const { recipeCategories } = useRecipeCategories();

	const { filterItems, ingredients } = useItems();

	const addRecipe = useAddRecipe();

	const searchResults = useMemo(() => {
		return filterItems(ingredients, ingredientSearch);
	}, [ingredients, ingredientSearch, filterItems]);

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('timeInMinutes', timeInMinutes.toString());

		selectedIngredients.forEach((ingredient, index) => {
			formData.append(`ingredients[${index}][_id]`, ingredient._id);
			formData.append(
				`ingredients[${index}][quantity]`,
				ingredient.quantity !== null ? ingredient.quantity.toString() : '',
			);
			formData.append(`ingredients[${index}][unit]`, ingredient.unit);
		});

		instructions.forEach((instruction, index) => {
			formData.append(`instructions[${index}]`, instruction);
		});

		notes.forEach((note, index) => {
			formData.append(`notes[${index}]`, note);
		});

		selectedCategories.forEach((category, index) => {
			formData.append(`categories[${index}]`, category);
		});

		if (selectedImage) {
			formData.append('image', selectedImage);
		}

		try {
			addRecipe(formData);
		} catch (err) {
			console.log(err);
		} finally {
			if (setModal) setModal(false);
		}
	};

	const handleNameChange = (name: string) => {
		setName(name);
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
		let newQuantity: number | null = null;

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

	const handleAddInstruction = (index: number) => {
		setInstructions((prev) => [
			...prev.slice(0, index + 1),
			'',
			...prev.slice(index + 1),
		]);
	};

	const handleRemoveInstruction = (index: number) => {
		if (instructions.length > 1) {
			setInstructions((prev) => prev.filter((_, idx) => idx !== index));
		}
	};

	const handleInstructionChange = (index: number, newValue: string) => {
		setInstructions((prev) =>
			prev.map((instruction, idx) => (idx === index ? newValue : instruction)),
		);
	};

	const handleAddNote = (index: number) => {
		setNotes((prev) => [
			...prev.slice(0, index + 1),
			'',
			...prev.slice(index + 1),
		]);
	};

	const handleRemoveNote = (index: number) => {
		if (instructions.length > 1) {
			setNotes((prev) => prev.filter((_, idx) => idx !== index));
		}
	};

	const handleNoteChange = (index: number, newValue: string) => {
		setNotes((prev) =>
			prev.map((note, idx) => (idx === index ? newValue : note)),
		);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()} className='mb-2'>
			<TextInput
				id='name'
				value={name}
				onChange={handleNameChange}
				label='Recipe Name*'
			/>
			<ImageInput
				setImage={setSelectedImage}
				label='Upload Image'
				id='recipeImage'
			/>
			<div className='flex justify-between'>
				<QuantityInput
					value={timeInMinutes}
					setValue={setTimeInMinutes}
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

			<InputGroup label='Ingredients*'>
				<div className='relative w-full md:mb-2'>
					<SearchBar
						searchQuery={ingredientSearch}
						setSearchQuery={setIngredientSearch}
						placeholder='Search for ingredients'
					/>
					{searchResults.length > 0 && (
						<div className='absolute top-full left-0 z-10 w-full bg-white border border-black-25 shadow'>
							{searchResults.map((result) => (
								<p onClick={() => addIngredient(result)} key={result._id}>
									{result.name}
								</p>
							))}
						</div>
					)}
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
				</div>
			</InputGroup>
			<InputGroup label='Instructions'>
				{instructions.map((instruction, index) => (
					<Fragment key={`instruction_${index}`}>
						<TextInput
							label={`Instruction ${index + 1}`}
							id={`instruction_${index}`}
							value={instruction}
							onChange={(newValue) => handleInstructionChange(index, newValue)}
						/>
						<div className='flex justify-center gap-4'>
							{instructions.length > 1 && (
								<Button
									onClick={() => handleRemoveInstruction(index)}
									type='primary'
									border
									iconXs
								>
									<FaTrash />
								</Button>
							)}

							<Button
								onClick={() => handleAddInstruction(index)}
								type='primary'
								border
								iconXs
							>
								<FaPlus />
							</Button>
						</div>
					</Fragment>
				))}
			</InputGroup>
			<InputGroup label='Extra Notes'>
				{notes.map((note, index) => (
					<Fragment key={`note${index}`}>
						<TextInput
							id={`note_${index}`}
							value={note}
							onChange={(newValue) => handleNoteChange(index, newValue)}
						/>
						<div className='flex justify-center gap-4 mb-4'>
							{notes.length > 1 && (
								<Button
									onClick={() => handleRemoveNote(index)}
									type='primary'
									border
									iconXs
								>
									<FaTrash />
								</Button>
							)}

							<Button
								onClick={() => handleAddNote(index)}
								type='primary'
								border
								iconXs
							>
								<FaPlus />
							</Button>
						</div>
					</Fragment>
				))}
			</InputGroup>

			<div className='flex justify-center'>
				<Button onClick={handleSubmit} border text='Add Recipe' />
			</div>
		</form>
	);
};

export default AddRecipe;
