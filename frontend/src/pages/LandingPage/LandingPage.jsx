import Button from '../../components/buttons/Button'
import Header from '../../layout/header/Header';
import RecipeCard from '../../components/recipeCard/RecipeCard'
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const LandingPage = () => {
	return (
		<>
			<Header title="Title">
			</Header>
			<div className='flex flex-col'>
				<div className="flex flex-wrap justify-evenly">
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
				</div>
				<div>
					<h1>This is an h1!</h1>
					<h2>This is an h2!</h2>
					<h3>This is an h3!</h3>
					<h4>This is an h4!</h4>
					<h5>This is an h5!</h5>
					<h6>This is an h6!</h6>
					<p>This is a p!</p>
				</div>
				<div className='container border border-black'>
					<p>Bacon ipsum dolor amet tongue picanha porchetta venison ball tip chislic strip steak kevin ham shank. Pancetta ribeye pork loin beef ribs, flank burgdoggen alcatra jowl strip steak rump ham hock. Swine boudin sausage filet mignon pig corned beef short ribs biltong meatball buffalo shankle. Capicola turkey jowl pancetta ham tongue. Drumstick corned beef biltong beef ribs chislic ball tip pork belly, brisket burgdoggen alcatra fatback filet mignon. Sirloin bresaola corned beef strip steak pig pork loin ribeye capicola jerky ground round beef.</p>	
				</div>
				<div className='container container--sm border border-black'>
					<p>Bacon ipsum dolor amet tongue picanha porchetta venison ball tip chislic strip steak kevin ham shank. Pancetta ribeye pork loin beef ribs, flank burgdoggen alcatra jowl strip steak rump ham hock. Swine boudin sausage filet mignon pig corned beef short ribs biltong meatball buffalo shankle. Capicola turkey jowl pancetta ham tongue. Drumstick corned beef biltong beef ribs chislic ball tip pork belly, brisket burgdoggen alcatra fatback filet mignon. Sirloin bresaola corned beef strip steak pig pork loin ribeye capicola jerky ground round beef.</p>	
				</div>
				<div className='container container--xsm border border-black'>
					<p>Bacon ipsum dolor amet tongue picanha porchetta venison ball tip chislic strip steak kevin ham shank. Pancetta ribeye pork loin beef ribs, flank burgdoggen alcatra jowl strip steak rump ham hock. Swine boudin sausage filet mignon pig corned beef short ribs biltong meatball buffalo shankle. Capicola turkey jowl pancetta ham tongue. Drumstick corned beef biltong beef ribs chislic ball tip pork belly, brisket burgdoggen alcatra fatback filet mignon. Sirloin bresaola corned beef strip steak pig pork loin ribeye capicola jerky ground round beef.</p>	
				</div>
			</div>
		</>
	)
}

export default LandingPage