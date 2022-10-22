import Button from '../../components/buttons/Button';
import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import Modal from '../../components/modals/Modal';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { useContext, useState } from 'react';
import { useRecipes } from '../../hooks/recipes/useRecipes';
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faRefresh,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';

const BrowsePage = () => {
  const { allRecipes } = useRecipes();

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const openCategoriesModal = () => {
    document.body.classList.add('modal-is-open');
    setIsCategoriesModalOpen(true);
  };

  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const openIngredientsModal = () => {
    document.body.classList.add('modal-is-open');
    setIsIngredientsModalOpen(true);
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
        className="form container fixed top-0 left-0 right-0 z-search pt-header-padding pb-6 bg-opacity-80 bg-grey-bg">
        <div className="form__input !flex-row items-center">
          <label htmlFor="search" className="invisible w-0 h-0">
            Search for a recipe
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search for a recipe"
            required
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
            tooltip={0}
          />
          <Button
            onClick={openIngredientsModal}
            type={'secondary'}
            text={'Ingredients'}
            tooltip={3}
          />
        </div>
      </form>
      <div className="flex flex-wrap justify-evenly pt-32">
        {allRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <Modal
        isModalOpen={isCategoriesModalOpen}
        setIsModalOpen={setIsCategoriesModalOpen}
        heading={'Categories'}>
        <p>Modal modal modal!</p>
      </Modal>
      <Modal
        isModalOpen={isIngredientsModalOpen}
        setIsModalOpen={setIsIngredientsModalOpen}
        heading={'Ingredients'}>
        <p>Modal modal modal!</p>
      </Modal>
    </>
  );
};

export default BrowsePage;
