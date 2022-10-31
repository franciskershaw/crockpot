import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';
import { useEffect, useState } from 'react';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faUtensils,
  faHeart,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../layout/header/Header';
import Toggle from '../../components/toggles/Toggle';
import QuantityInput from '../../components/forms/QuantityInput';
import { useUser } from '../../hooks/auth/useUser';
import { useEditUser } from '../../hooks/user/useEditUser';

const ViewRecipePage = () => {
  const { recipe } = useCurrentRecipe();
  const [formData, setFormData] = useState({
    inMenu: false,
    serves: 4,
  });

  const { user } = useUser();

  const editUser = useEditUser();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFavourite = () => {
    if (!user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: [...user.favouriteRecipes, recipe._id],
      });
    } else if (user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: user.favouriteRecipes.filter(
          (id) => id !== recipe._id
        ),
      });
    }
  };

  const onAddToMenu = () => {
    console.log(formData)
    console.log(recipe._id)
    console.log(user.recipeMenu)
    if (!formData.inMenu) {
      editUser({
        recipeMenu: [...user.recipeMenu, {
          _id: recipe._id,
          serves: formData.serves
        }]
      })
    } else if (formData.inMenu) {
      editUser({
        recipeMenu: recipeMenu.filter((recipe) => recipe._id !== recipe._id)
      })
    }
  };

  if (recipe) {
    return (
      <>
        <Header title={recipe.name}>
          <></>
          <div>
            <span className="italic mr-3 lowercase">By {recipe.createdBy.name}</span>
            <span>
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              {recipe.timeInMinutes} mins
            </span>
          </div>
        </Header>

        <div className="container space-y-5 mt-[-20px]">
          {/* Image */}
          <div className="rounded-lg rounded-t-none shadow-bottom overflow-hidden w-full">
            <div className="pb-[50%] relative">
              <img
                className="object-cover w-full h-full absolute top-0 bottom-0 left-0 right-0"
                src={recipe.image.url}
                alt={recipe.name}
                loading="lazy"
              />
              {user && (
                <div className="absolute m-1.5 space-x-1.5 flex right-0">
                  <Icon type={'secondary'} outline>
                    <FontAwesomeIcon onClick={onAddToMenu} icon={faUtensils} />
                  </Icon>
                  <Icon
                    state={
                      user.favouriteRecipes.includes(recipe._id) ? 'active' : ''
                    }
                    type={'secondary'}
                    outline>
                    <FontAwesomeIcon onClick={onFavourite} icon={faHeart} />
                  </Icon>
                  {user.isAdmin && (
                    <>
                      <Icon type={'secondary'} outline>
                        <FontAwesomeIcon icon={faEdit} />
                      </Icon>
                      <Icon type={'secondary'} outline>
                        <FontAwesomeIcon icon={faTrash} />
                      </Icon>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <ul className="pills pills--plain pills--plain--secondary text-center">
            {recipe.categories.map((category, index) => (
              <li key={`category_${index}`}>{category.name}</li>
            ))}
          </ul>

          {/* Quantity toggle */}
          <QuantityInput
            nameAndId={'serves'}
            value={formData.serves}
            setValue={setFormData}
            onChange={onChange}
            step={1}
            classes={'items-center'}
            maxValue={20}
          />

          <Toggle left={'Ingredients'} right={'Instructions'} box>
            {/* Ingredients */}
            <ul className="bullets">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`ingredient_${index}`}>
                  {ingredient.name} x{' '}
                  {(ingredient.quantity * formData.serves)
                    .toFixed(2)
                    .replace(/[.,]00$/, '')}{' '}
                  {ingredient.unit}
                </li>
              ))}
            </ul>
            {/* Instructions */}
            <ol className="bullets">
              {recipe.instructions.map((instruction, index) => (
                <li key={`instruction_${index}`}>{instruction}</li>
              ))}
            </ol>
          </Toggle>

          {recipe.notes[0].length > 0 && (
            // Notes
            <ul className="bullets italic">
              {recipe.notes.map((note, index) => (
                <li key={`note_${index}`}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  } else {
    return <h2>No recipe found</h2>;
  }
};

export default ViewRecipePage;
