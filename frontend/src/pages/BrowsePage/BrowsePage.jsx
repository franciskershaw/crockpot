import Button from '../../components/buttons/Button';
import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import Modal from '../../components/modals/Modal';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import ToggleAndScrollPillsCategories from './ToggleAndScrollPillsCategories';
import ToggleAndScrollPillsIngredients from './ToggleAndScrollPillsIngredients';
import { useState, useEffect } from 'react';
import { useRecipes, useFetchIndividualRecipes } from '../../hooks/recipes/useRecipes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { useRecipeCategories } from '../../hooks/recipes/useRecipeCategories';
import { useItems } from '../../hooks/items/useItems';

const BrowsePage = () => {
  let { allRecipes } = useRecipes();
  useFetchIndividualRecipes(allRecipes)
  const { recipeCategories } = useRecipeCategories();
  const { ingredients } = useItems();

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    ingredients: [],
  });
  const [filteredResults, setFilteredResults] = useState({
    active: false,
    results: [],
  });
  const [searchFilteredResults, setSearchFilteredResults] = useState([]);

  // Filtering by categories and ingredients
  useEffect(() => {
    let filteredRecipes = [];
    const { categories, ingredients } = activeFilters;

    // Either of the filters is active
    if (categories.length || ingredients.length) {
      // If categories chosen, filter all recipes by active category filters
      let filteredByCategories = [];
      if (categories.length) {
        filteredByCategories = allRecipes.filter((recipe) =>
          categories.every((category) =>
            recipe.categories.includes(category._id)
          )
        );
      }

      // If ingredients chosen, filter all recipes by active ingredient filters
      let filteredByIngredients = [];
      if (ingredients.length) {
        filteredByIngredients = allRecipes.filter((recipe) =>
          ingredients.every((ingredient) =>
            recipe.ingredients.some((value) => value._id === ingredient._id)
          )
        );
      }

      if (
        categories.length &&
        ingredients.length &&
        filteredByCategories.length &&
        filteredByIngredients.length
      ) {
        for (let object of filteredByCategories) {
          for (let object2 of filteredByIngredients) {
            if (object._id === object2._id) {
              filteredRecipes.push(object);
            }
          }
        }
      } else if (
        categories.length &&
        !ingredients.length &&
        filteredByCategories.length
      ) {
        filteredRecipes = filteredByCategories;
      } else if (
        !categories.length &&
        ingredients.length &&
        filteredByIngredients.length
      ) {
        filteredRecipes = filteredByIngredients;
      }

      setFilteredResults({
        active: true,
        results: filteredRecipes,
      });
    } else if (!categories.length && !ingredients.length) {
      setFilteredResults({
        active: false,
        results: [],
      });
    }
  }, [activeFilters]);

  const openCategoriesModal = () => {
    document.body.classList.add('modal-is-open');
    setIsCategoriesModalOpen(true);
  };
  const openIngredientsModal = () => {
    document.body.classList.add('modal-is-open');
    setIsIngredientsModalOpen(true);
  };

  const onChangeSearchBar = (e) => {
    let searchFilters = [];

    setSearchValue(e.target.value);

    // if (filteredResults.results.length) {
    //   searchFilters = filteredResults.results.filter((recipe) =>
    //     recipe.name.toLowerCase().includes(e.target.value)
    //   );
    // }

    // searchFilters = allRecipes.filter((recipe) =>
    //   recipe.name.toLowerCase().includes(searchValue)
    // );

  };

  return (
    <>
      <Header title="Browse Recipes">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Icon>
      </Header>
      <div className='columns'>
        <div className='column--33'>
          <form
            action=""
            className="form container fixed lg:relative top-0 left-0 right-0 z-search pt-header-padding pb-6 lg:p-0 bg-opacity-80 bg-grey-bg">
            <div className="form__input !flex-row items-center">
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
            <div className="flex items-center justify-center space-x-6">
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
            </div>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
          </form>
        </div>
        <div className='column--66'>
          <div className="flex flex-wrap justify-evenly pt-32 lg:pt-0">
            {filteredResults.active && filteredResults.results.length ? (
              filteredResults.results.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            ) : filteredResults.active && !filteredResults.length ? (
              <h4>No results available</h4>
            ) : (
              allRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            )}
          </div>
          <Modal
            isModalOpen={isCategoriesModalOpen}
            setIsModalOpen={setIsCategoriesModalOpen}
            heading={'Categories'}
            noPadding>
            <ToggleAndScrollPillsCategories
              data={recipeCategories}
              scrollTheme="secondary"
              filterType={'categories'}
              filters={activeFilters}
              setFilters={setActiveFilters}
              setModalOpen={setIsCategoriesModalOpen}
            />
          </Modal>
          <Modal
            isModalOpen={isIngredientsModalOpen}
            setIsModalOpen={setIsIngredientsModalOpen}
            heading={'Ingredients'}
            noPadding>
            <ToggleAndScrollPillsIngredients
              data={ingredients}
              scrollTheme="secondary"
              filterType={'ingredients'}
              filters={activeFilters}
              setFilters={setActiveFilters}
              setModalOpen={setIsIngredientsModalOpen}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
