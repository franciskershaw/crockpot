import Button from '../../components/buttons/Button'; // Leave this here for version 2
import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { useState } from 'react';
import { useRecipes } from '../../hooks/recipes/useRecipes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMagnifyingGlass,
	faRefresh,
} from '@fortawesome/free-solid-svg-icons';

const BrowsePage = () => {
	let { allRecipes } = useRecipes();
	const [searchValue, setSearchValue] = useState('');
	const [filteredResults, setFilteredResults] = useState([]);

	const onChangeSearchBar = (e) => {
		setSearchValue(e.target.value);
		setFilteredResults(
			allRecipes.filter((recipe) =>
				recipe.name.toLowerCase().includes(e.target.value)
			)
		);
	};

	return (
		<>
			<Header title="Browse Recipes">
				<Icon classes={'mr-3'} type={'no-hover'}>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</Icon>
			</Header>
			<form
				action=""
				className="form container fixed top-0 left-0 right-0 z-search pt-nav-padding pb-5 bg-opacity-80 bg-grey-bg md:px-8 md:py-4 md:flex md:justify-center md:top-[108px] lg:top-[68px]"
			>
				<div className="form__input !flex-row items-center md:w-1/2">
					<label htmlFor="search" className="invisible w-0 h-0">
						Search for a recipe
					</label>
					<input
						type="text"
						id="search"
						name="search"
						placeholder="Search for a recipe"
						value={searchValue}
						onChange={onChangeSearchBar}
						className="w-full !border-purple"
					/>
					<Icon classes={'ml-4 cursor-pointer'} type={'secondary'}>
						<FontAwesomeIcon icon={faRefresh} />
					</Icon>
				</div>
				{/* <div className="flex items-center justify-center space-x-6 md:w-1/2 md:!mt-0 md:justify-end">
          <Button
            onClick={openCategoriesModal}
            type={'secondary'}
            text={'Categories'}
            tooltip={activeFilters.categories.length}
          />
          <Button
            onClick={openIngredientsModal}
            type={'secondary'}
            text={'Ingredients'}
            tooltip={activeFilters.ingredients.length}
          />
        </div> */}
			</form>
			<div className="container recipe-card-container pt-16 md:pt-14">
				{filteredResults.length ? (
					filteredResults.map((recipe) => (
						<RecipeCard key={recipe._id} recipe={recipe} />
					))
				) : searchValue.length && !filteredResults.length ? (
					<h4>No results available</h4>
				) : (
					allRecipes.map((recipe) => (
						<RecipeCard key={recipe._id} recipe={recipe} />
					))
				)}
			</div>
		</>
	);
};

export default BrowsePage;
