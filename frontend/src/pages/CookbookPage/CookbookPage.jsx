import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import Toggle from '../../components/toggles/Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useFavourites } from '../../hooks/user/useFavourites';

const CookbookPage = () => {
	const { favourites } = useFavourites();

	return (
		<>
			<Header title="Cookbook">
				<Icon classes={'mr-3'} type={'no-hover'}>
					<FontAwesomeIcon icon={faBook} />
				</Icon>
			</Header>
			<div className="container">
				<Toggle
					left={`My favourites (${favourites.length})`}
					right={'My recipes (0)'}
					fixed
				>
					<div className="recipe-card-container">
						{favourites && favourites.length ? (
							favourites.map((recipe) => (
								<RecipeCard key={recipe._id} recipe={recipe} />
							))
						) : (
							<h4>No results available</h4>
						)}
					</div>
					{/* Add in My Recipes functionality in V2 */}
					<div className="container flex flex-wrap justify-evenly">
						<h4>No results available</h4>
					</div>
				</Toggle>
			</div>
		</>
	);
};

export default CookbookPage;
