import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faHeart } from '@fortawesome/free-solid-svg-icons';

const RecipeCard = ({ recipe }) => {
  const { _id, name, image } = recipe;
  return (
    <div className="recipe-card">
      <div className="recipe-card__image-container">
        <div className="recipe-card__icons flex justify-between p-1">
          <Icon type={'secondary'} outline>
            <FontAwesomeIcon icon={faUtensils} />
          </Icon>
          <Icon type={'secondary'} outline>
            <FontAwesomeIcon icon={faHeart} />
          </Icon>
        </div>
        <Link to={`/viewRecipe/${_id}`} className="recipe-card__image">
          <img
            src={image.url}
            alt={image.name}></img>
        </Link>
      </div>
      <div className="recipe-card__title">
        <h4 className="text-white h5">{name}</h4>
      </div>
    </div>
  );
};

export default RecipeCard;
