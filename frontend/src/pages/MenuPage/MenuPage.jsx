import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import AccordionCustom from '../../components/accordions/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from '../../hooks/user/useMenu';
import { useItemCategories } from '../../hooks/items/useItemCategories';
import { useState } from 'react';
import { useItems } from '../../hooks/items/useItems';
import { useEffect } from 'react';

const MenuPage = () => {
	const { recipeMenu, shoppingList } = useMenu();
	const { itemCategories } = useItemCategories();
	const { allItems } = useItems();

	const [extraItems, setExtraItems] = useState([
		{
			_id: '',
			quantity: 1,
			unit: '',
			obtained: false,
		},
	]);

	// Combine everything here

	const categorisedShoppingList = itemCategories.map((category) =>
		shoppingList.filter((item) => item.item.category === category._id)
	);

	let shoppingListData = [];

	for (let i = 0; i < itemCategories.length; i++) {
		if (categorisedShoppingList[i].length > 0) {
			shoppingListData.push({
				title: itemCategories[i].name,
				icon: itemCategories[i].faIcon,
				content: categorisedShoppingList[i],
			});
		}
	}

	const onChange = (e) => {
		const { name, value } = e.target;

		setExtraItems((prevState) => {
			const updatedExtraItems = [...prevState];
			updatedExtraItems[0][name] = value;
			return updatedExtraItems;
		});
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	useEffect(() => {
		// console.log(allItems);
	}, [extraItems]);

	return (
		<>
			<Header title="Menu">
				<Icon classes={'mr-3'} type={'no-hover'}>
					<FontAwesomeIcon icon={faUtensils} />
				</Icon>
			</Header>
			<div className="container">
				<Toggle
					left={`Menu (${recipeMenu.length})`}
					right={'Shopping List'}
					fixed
				>
					<div className="recipe-card-container">
						{recipeMenu.map((recipe) => (
							<RecipeCardLong
								key={recipe.recipe._id}
								recipe={recipe.recipe}
								serves={recipe.serves}
							/>
						))}
					</div>
					<div className="mx-auto max-w-4xl">
						<AccordionCustom data={shoppingListData} />

						{/* Extra items */}
						<form onSubmit={onSubmit} className="form mt-5" id="addExtraItem">
							{/* Ingredients - 50 25 25, select */}
							<div className="space-y-1">
								<label htmlFor="ingredients">Add Extra Items</label>
								<div className="flex justify-between flex-wrap">
									<div className="form__input form__input--50">
										{/* <label htmlFor="ingredient">Ingredients</label> */}
										<select
											name="_id"
											onChange={onChange}
											defaultValue="Please select an ingredient"
										>
											<option disabled value="Please select an item">
												Please select an extra item to add
											</option>
											{allItems.map((ingredient) => (
												<option key={ingredient.name} value={ingredient._id}>
													{ingredient.name}
												</option>
											))}
										</select>
									</div>
									<div className="form__input form__input--25">
										{/* <label htmlFor="ingredientNum" className="invisible">Quantities</label> */}
										<input
											name="quantity"
											onChange={onChange}
											defaultValue={extraItems.quantity}
											type="number"
											min="0"
											placeholder="0"
											step="any"
										/>
									</div>
									<div className="form__input form__input--25">
										{/* <label htmlFor="ingredientUnit" className="invisible">Units</label> */}
										<select name="unit" defaultValue="" onChange={onChange}>
											<option value="">-</option>
											<option value="g">g</option>
											<option value="ml">ml</option>
											<option value="tsp">tsp</option>
											<option value="tbsp">Tbsp</option>
											<option value="cans">cans</option>
										</select>
									</div>
								</div>
							</div>
						</form>
						<div className="mt-3 space-x-3 text-center">
							<button
								className="btn btn--secondary"
								type="submit"
								form="addExtraItem"
								value="Add Item"
							>
								Add Item
							</button>
							<button className="btn btn--secondary" value="Clear Items">
								Clear Items
							</button>
						</div>
					</div>
				</Toggle>
			</div>
		</>
	);
};

export default MenuPage;
