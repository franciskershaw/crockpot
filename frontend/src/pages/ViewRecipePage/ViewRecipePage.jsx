import { useRecipes } from '../../hooks/recipes/useRecipes'
import { useParams } from 'react-router-dom'

const ViewRecipePage = () => {
	const { allRecipes } = useRecipes()
	const params = useParams()
	const recipe = allRecipes.find(recipe => recipe._id === params.id)
	// All current recipe data lives in this recipe variable
	console.log(recipe)
		
	return (
		<div>
			<h2>{recipe.name}</h2>
			<ul>
				{recipe.instructions.map((instruction, index) => (
					<li key={`instruction_${index}`}>{instruction}</li>
				))}
			</ul>
		</div>
	)
}

export default ViewRecipePage