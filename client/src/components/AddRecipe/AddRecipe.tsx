import { FC, Fragment, useMemo, useRef, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { AddRecipeIngredient, Item, Recipe, Unit } from '@/src/types/types';

import useItems from '@/src/hooks/items/useItems';
import {
	useAddRecipe,
	useEditRecipe,
} from '@/src/hooks/recipes/useAddEditRecipe';
import useRecipeCategories from '@/src/hooks/recipes/useRecipeCategories';

import Button from '@/src/components/Button/Button';
import ImageInput from '@/src/components/FormComponents/ImageInput/ImageInput';
import InputGroup from '@/src/components/FormComponents/InputGroup/InputGroup';
import SelectInput from '@/src/components/FormComponents/SelectInput/SelectInput';
import TextInput from '@/src/components/FormComponents/TextInput/TextInput';
import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';

interface AddRecipeProps {
	setModal?: (open: boolean) => void;
	recipe?: Recipe;
}

const AddRecipe: FC<AddRecipeProps> = ({ setModal, recipe }) => {
	const [name, setName] = useState<string>(recipe?.name || '');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [timeInMinutes, setTimeInMinutes] = useState<number>(
		recipe?.timeInMinutes || 30,
	);
	const [serves, setServes] = useState<number>(recipe?.serves || 4);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		recipe?.categories.map((category) => category._id) || [],
	);
	const [ingredientSearch, setIngredientSearch] = useState<string>('');
	const [selectedIngredients, setSelectedIngredients] = useState<
		AddRecipeIngredient[]
	>(
		recipe?.ingredients.map((ingredient) => ({
			_id: ingredient._id._id,
			name: ingredient._id.name,
			quantity: ingredient.quantity,
			unit: ingredient.unit,
		})) || [],
	);
	const [instructions, setInstructions] = useState<string[]>(
		recipe?.instructions || [''],
	);
	const [notes, setNotes] = useState<string[]>(recipe?.notes || ['']);

	const [nameError, setNameError] = useState('');
	const [categoryError, setCategoryError] = useState('');
	const [ingredientError, setIngredientError] = useState('');
	const [instructionError, setInstructionError] = useState('');
	const [instructionErrors, setInstructionErrors] = useState<string[]>([]);

	const initialState = useRef({
		name: recipe?.name || '',
		timeInMinutes: recipe?.timeInMinutes || 30,
		serves: recipe?.serves || 4,
		selectedCategories:
			recipe?.categories.map((category) => category._id) || [],
		selectedIngredients:
			recipe?.ingredients.map((ingredient) => ({
				_id: ingredient._id._id,
				name: ingredient._id.name,
				quantity: ingredient.quantity,
				unit: ingredient.unit,
			})) || [],
		instructions: recipe?.instructions || [''],
		notes: recipe?.notes || [''],
		selectedImage: null,
	});

	const { recipeCategories } = useRecipeCategories();
	const { filterItems, ingredients } = useItems();
	const addRecipe = useAddRecipe();
	const editRecipe = useEditRecipe();

	const searchResults = useMemo(() => {
		return filterItems(ingredients, ingredientSearch);
	}, [ingredients, ingredientSearch, filterItems]);

	const validateForm = () => {
		let isValid = true;

		// Validate Recipe Name
		if (!name.trim()) {
			setNameError('Recipe name is required.');
			isValid = false;
		} else {
			setNameError('');
		}

		// Validate Categories
		if (selectedCategories.length === 0) {
			setCategoryError('At least one category is required.');
			isValid = false;
		} else {
			setCategoryError('');
		}

		// Validate Ingredients
		if (selectedIngredients.length === 0) {
			setIngredientError('At least one ingredient is required.');
			isValid = false;
		} else {
			setIngredientError('');
		}

		// Validate Instructions
		const newInstructionErrors = instructions.map((instruction, index) => {
			if (!instruction.trim()) {
				isValid = false;
				return 'Instruction cannot be empty.';
			}
			return '';
		});

		setInstructionErrors(newInstructionErrors);
		if (newInstructionErrors.some((error) => error !== '')) {
			setInstructionError('All instructions must be filled.');
			isValid = false;
		} else {
			setInstructionError('');
		}

		return isValid;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			// Prevent form submission if validation fails
			return;
		}
		const formData = new FormData();
		const isEditing = !!recipe;

		if (isEditing) {
			const appendIfChanged = <
				T extends string | number | string[] | AddRecipeIngredient[],
			>(
				key: keyof typeof initialState.current,
				currentValue: T,
				appendValue: FormDataEntryValue,
			) => {
				if (
					JSON.stringify(initialState.current[key]) !==
					JSON.stringify(currentValue)
				) {
					formData.append(key, appendValue);
				}
			};
			appendIfChanged('name', name, name);
			appendIfChanged('timeInMinutes', timeInMinutes, timeInMinutes.toString());
			appendIfChanged('serves', serves, serves.toString());

			if (
				JSON.stringify(initialState.current.selectedCategories) !==
				JSON.stringify(selectedCategories)
			) {
				selectedCategories.forEach((category, index) => {
					formData.append(`categories[${index}]`, category);
				});
			}

			if (
				JSON.stringify(initialState.current.selectedIngredients) !==
				JSON.stringify(selectedIngredients)
			) {
				selectedIngredients.forEach((ingredient, index) => {
					formData.append(`ingredients[${index}][_id]`, ingredient._id);
					formData.append(
						`ingredients[${index}][quantity]`,
						ingredient.quantity !== null ? ingredient.quantity.toString() : '',
					);
					formData.append(`ingredients[${index}][unit]`, ingredient.unit);
				});
			}

			if (
				JSON.stringify(initialState.current.instructions) !==
				JSON.stringify(instructions)
			) {
				instructions.forEach((instruction, index) => {
					formData.append(`instructions[${index}]`, instruction);
				});
			}

			if (
				JSON.stringify(initialState.current.notes) !== JSON.stringify(notes)
			) {
				notes.forEach((note, index) => {
					formData.append(`notes[${index}]`, note);
				});
			}

			if (
				selectedImage &&
				initialState.current.selectedImage !== selectedImage
			) {
				formData.append('image', selectedImage);
			}
		} else {
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
			if (notes[0].trim()) {
				notes.forEach((note, index) => {
					formData.append(`notes[${index}]`, note);
				});
			}
			selectedCategories.forEach((category, index) => {
				formData.append(`categories[${index}]`, category);
			});
			formData.append('serves', serves.toString());
			if (selectedImage) {
				formData.append('image', selectedImage);
			}
		}

		try {
			if (isEditing) {
				editRecipe({ formData, _id: recipe._id });
			} else {
				addRecipe(formData);
			}
			if (setModal) setModal(false);
		} catch (err) {
			console.log(err);
		}
	};

	const handleNameChange = (name: string) => {
		setNameError('');
		if (!name.trim()) {
			setNameError('Recipe name is required.');
		}
		setName(name);
	};

	const handleCategoryChange = (newCategories: string[]) => {
		if (!newCategories.length) {
			setCategoryError('At least one category is required.');
		} else {
			setCategoryError('');
		}
		setSelectedCategories(newCategories);
	};

	const addIngredient = (result: Item) => {
		setIngredientError('');
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
		if (selectedIngredients.length === 1) {
			setIngredientError('At least one ingredient is required.');
		}
		setSelectedIngredients((prev) => prev.filter((_, idx) => idx !== index));
	};

	const handleAddInstruction = (index: number) => {
		setInstructions((prev) => [
			...prev.slice(0, index + 1),
			'',
			...prev.slice(index + 1),
		]);
		setInstructionErrors((prev) => [
			...prev.slice(0, index + 1),
			'',
			...prev.slice(index + 1),
		]);
	};

	const handleRemoveInstruction = (index: number) => {
		if (instructions.length > 1) {
			setInstructions((prev) => prev.filter((_, idx) => idx !== index));
			setInstructionErrors((prev) => prev.filter((_, idx) => idx !== index));
		}
	};

	const handleInstructionChange = (index: number, newValue: string) => {
		setInstructions((prev) =>
			prev.map((instruction, idx) => (idx === index ? newValue : instruction)),
		);
		setInstructionErrors((prev) =>
			prev.map((error, idx) => (idx === index ? '' : error)),
		);
		if (newValue.trim() && instructionError) {
			setInstructionError('');
		}
	};

	const handleAddNote = (index: number) => {
		setNotes((prev) => [
			...prev.slice(0, index + 1),
			'',
			...prev.slice(index + 1),
		]);
	};

	const handleRemoveNote = (index: number) => {
		if (notes.length > 1) {
			setNotes((prev) => prev.filter((_, idx) => idx !== index));
		}
	};

	const handleNoteChange = (index: number, newValue: string) => {
		setNotes((prev) =>
			prev.map((note, idx) => (idx === index ? newValue : note)),
		);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()} className="modal--form">
			<TextInput
				id="name"
				value={name}
				onChange={handleNameChange}
				label="Recipe Name*"
				error={nameError}
			/>
			<ImageInput
				setImage={setSelectedImage}
				label="Upload Image"
				id="recipeImage"
				existingImageUrl={recipe?.image?.url}
			/>
			<div className="flex space-x-8 mx-auto">
				<QuantityInput
					value={timeInMinutes}
					setValue={setTimeInMinutes}
					id="prepTime"
					label="Prep Time*"
					min={5}
					max={180}
				/>
				<QuantityInput
					label="Serves*"
					id="serves"
					value={serves}
					setValue={setServes}
					min={1}
					max={20}
				/>
			</div>
			<SelectInput
				id="selectCategory"
				options={recipeCategories.map((category) => ({
					value: category._id,
					label: category.name,
				}))}
				value={selectedCategories}
				onChange={handleCategoryChange}
				label="Select Categories (max 3)*"
				isMulti
				placeholder="Please select categories"
				error={categoryError}
			/>

			<InputGroup label="Ingredients*">
				<div className="relative">
					<SearchBar
						searchQuery={ingredientSearch}
						setSearchQuery={setIngredientSearch}
						placeholder="Search for ingredients"
						error={ingredientError}
					/>
					{searchResults.length > 0 && (
						<div className="input-menu-dropdown">
							{searchResults.map((result) => (
								<p onClick={() => addIngredient(result)} key={result._id}>
									{result.name}
								</p>
							))}
						</div>
					)}
				</div>
				{selectedIngredients.map((ingredient, index) => (
					<div
						className="flex justify-between mt-4 items-center"
						key={`${ingredient._id}_${index}`}
					>
						<div className=" w-1/4">
							<p className="text-sm">{ingredient.name}</p>
						</div>

						<input
							type="number"
							name=""
							id=""
							value={ingredient.quantity !== null ? ingredient.quantity : ''}
							onChange={(e) => handleQuantityChange(e, index)}
							className="w-[50px] border border-black rounded text-center p-0.5 text-sm"
						/>

						<div className="flex flex-col gap-2">
							<select
								className="border w-24 py-1 text-sm"
								name=""
								id=""
								onChange={(e) => handleUnitChange(e, index)}
								value={ingredient.unit}
							>
								<option value="">-</option>
								<option value="cans">Cans</option>
								<option value="g">g</option>
								<option value="ml">ml</option>
								<option value="tbsp">Tablespoons</option>
								<option value="tsp">Teaspoons</option>
							</select>
						</div>
						<Button
							onClick={() => handleRemoveIngredient(index)}
							type="primary"
							border
							iconXs
						>
							<FaTrash />
						</Button>
					</div>
				))}
			</InputGroup>
			<InputGroup label="Instructions">
				{instructionError && <p className="error">{instructionError}</p>}
				{instructions.map((instruction, index) => (
					<Fragment key={`instruction_${index}`}>
						<TextInput
							label={`Instruction ${index + 1}`}
							id={`instruction_${index}`}
							value={instruction}
							onChange={(newValue) => handleInstructionChange(index, newValue)}
							error={instructionErrors[index]}
						/>
						<div className="flex justify-center gap-4">
							{instructions.length > 1 && (
								<Button
									onClick={() => handleRemoveInstruction(index)}
									type="primary"
									border
									iconXs
								>
									<FaTrash />
								</Button>
							)}
							{instruction.trim() && !(index < instructions.length - 1) && (
								<Button
									onClick={() => handleAddInstruction(index)}
									type="primary"
									border
									iconXs
								>
									<FaPlus />
								</Button>
							)}
						</div>
					</Fragment>
				))}
			</InputGroup>
			<InputGroup label="Extra Notes">
				{notes.map((note, index) => (
					<Fragment key={`note${index}`}>
						<TextInput
							id={`note_${index}`}
							value={note}
							onChange={(newValue) => handleNoteChange(index, newValue)}
						/>
						<div className="flex justify-center gap-4">
							{notes.length > 1 && (
								<Button
									onClick={() => handleRemoveNote(index)}
									type="primary"
									border
									iconXs
								>
									<FaTrash />
								</Button>
							)}
							{note.trim() && !(index < notes.length - 1) && (
								<Button
									onClick={() => handleAddNote(index)}
									type="primary"
									border
									iconXs
								>
									<FaPlus />
								</Button>
							)}
						</div>
					</Fragment>
				))}
			</InputGroup>

			<div className="flex justify-center">
				<Button
					onClick={handleSubmit}
					border
					text={`${recipe ? 'Save Changes' : 'Add Recipe'}`}
				/>
			</div>
		</form>
	);
};

export default AddRecipe;
