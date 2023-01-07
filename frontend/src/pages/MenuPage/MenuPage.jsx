import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import TogglePills from '../../components/pills/TogglePills';
import AccordionCustom from '../../components/accordions/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from '../../hooks/user/useMenu';
import { useItemCategories } from '../../hooks/items/useItemCategories';

const MenuPage = () => {
	const { recipeMenu, shoppingList } = useMenu();
	const { itemCategories } = useItemCategories();

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
					<div className="container container--xsm">
						<AccordionCustom data={shoppingListData} />
					</div>
				</Toggle>
			</div>
		</>
	);
};

export default MenuPage;
