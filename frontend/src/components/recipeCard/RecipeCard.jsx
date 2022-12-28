import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../hooks/auth/useUser';
import { useEditMenu } from '../../hooks/user/useEditMenu';
import { useEditFavourites } from '../../hooks/user/useEditFavourites';

const RecipeCard = ({ recipe }) => {
  const { user } = useUser();
  let recipeMenu
  let recipeIds
  if (user) {
    recipeMenu = user.recipeMenu
    recipeIds = recipeMenu.map((obj) => obj._id);
  }
  const { _id, name, image } = recipe;
  const { onClickMenu } = useEditMenu(_id);
  const onFavourite = useEditFavourites(recipe, user);

  return (
    <div className="recipe-card">
      <div className="recipe-card__image-container">
        {user && (
          <div className="recipe-card__icons flex justify-between p-1">
            <Icon
              state={recipeIds.includes(recipe._id) ? 'active' : ''}
              type={'secondary'}
              outline>
              <FontAwesomeIcon onClick={onClickMenu} icon={faUtensils} />
            </Icon>
            <Icon
              state={user.favouriteRecipes.includes(recipe._id) ? 'active' : ''}
              type={'secondary'}
              outline>
              <FontAwesomeIcon onClick={onFavourite} icon={faHeart} />
            </Icon>
          </div>
        )}
        <Link to={`/viewRecipe/${_id}`} className="recipe-card__image">
          <img src={image.url} alt={image.name}></img>
        </Link>
      </div>
      <div className="recipe-card__title">
        <h4 className="text-white h5">{name}</h4>
      </div>
    </div>
  );
};

export default RecipeCard;
