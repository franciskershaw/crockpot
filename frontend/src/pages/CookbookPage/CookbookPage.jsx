import Header from '../../layout/header/Header'
import Icon from '../../components/icons/Icon'
import RecipeCard from '../../components/recipeCard/RecipeCard';
import Toggle from '../../components/toggles/Toggle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const CookbookPage = () => {
	return (
		<>
		<Header title='Cookbook'>
			<Icon classes={"mr-3"} type={"no-hover"}>
				<FontAwesomeIcon icon={faBook}/>
			</Icon>
		</Header>
		<div className='container'>
			<Toggle left={"My favourites (8)"} right={"My recipes (5)"} fixed>
				<div className="flex flex-wrap justify-evenly">
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
				</div>
				<div className="flex flex-wrap justify-evenly">
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
				</div>
			</Toggle>
		</div>
		</>
	)
}

export default CookbookPage