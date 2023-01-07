import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUtensils,
	faHeart,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import QuantityInput from '../../components/forms/QuantityInput';
import { useUser } from '../../hooks/auth/useUser';
import { useEditMenu } from '../../hooks/user/useEditMenu';
import { useEditFavourites } from '../../hooks/user/useEditFavourites';

const RecipeCardLong = ({ recipe, serves }) => {
	const { user } = useUser();
	let recipeMenu;
	let recipeIds;
	if (user) {
		recipeMenu = user.recipeMenu;
		recipeIds = recipeMenu.map((obj) => obj._id);
	}
	const { _id, name, image } = recipe;
	const { onClickMenu, menuData, setMenuData } = useEditMenu(_id);
	const onFavourite = useEditFavourites(recipe, user);

	return (
		<div className="recipe-card-long">
			<div className="recipe-card-long__image-container">
				<Link to={`/viewRecipe/${_id}`} className="recipe-card__image">
					<img src={image.url} alt={image.name}></img>
				</Link>
			</div>
			<div className="recipe-card-long__content-container space-y-2 w-full text-center">
				<h4 className="h4">{name}</h4>
				<div className="flex flex-col space-y-2 items-center">
					<QuantityInput
						nameAndId={'serves'}
						value={menuData.serves}
						setValue={setMenuData}
						step={1}
						maxValue={20}
					/>
					<div className="flex space-x-2">
						<Icon
							state={recipeIds.includes(recipe._id) ? 'active' : ''}
							type={'secondary'}
							outline
						>
							<FontAwesomeIcon onClick={onClickMenu} icon={faUtensils} />
						</Icon>
						<Icon
							state={user.favouriteRecipes.includes(recipe._id) ? 'active' : ''}
							type={'secondary'}
							outline
						>
							<FontAwesomeIcon onClick={onFavourite} icon={faHeart} />
						</Icon>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeCardLong;
