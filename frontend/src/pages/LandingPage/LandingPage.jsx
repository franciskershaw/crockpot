import Button from '../../components/buttons/Button'
import Header from '../../layout/header/Header';
import RecipeCard from '../../components/recipeCard/RecipeCard'
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const LandingPage = () => {
	return (
		<>
			<Header title="Header">
			</Header>

			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Atoms</h2>

				<h3 className='text-blue-500 my-5'>Buttons</h3>
				<div>
					<Button text={"Button"}></Button>
					<Button type={"secondary"} text={"Button"}></Button>
					<Button noHover={true} text={"Button"} tooltip={"10000"}></Button>
				</div>

				<h3 className='text-blue-500 my-5'>Buttons with tooltip</h3>

				<h3 className='text-blue-500 my-5'>Form inputs</h3>

				<h3 className='text-blue-500 my-5'>Plus/minus inputs</h3>

				<h3 className='text-blue-500 my-5'>Icons</h3>
				<div className='flex justify-evenly'>
					<Icon>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon noHover={true}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon noHover={true} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon text={"Add recipe"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon noHover={true} text={"Add recipe"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon text={"Add recipe"} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon noHover={true} text={"Add recipe"} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
				</div>

				<h3 className='text-blue-500 my-5'>Toggle switch</h3>

				<h3 className='text-blue-500 my-5'>Toggle pills</h3>

			</div>

			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Molecules</h2>

				<h3 className='text-blue-500 my-5'>Horizontal scrollbar with toggle pills</h3>
			</div>
			
			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Organisms</h2>

				<h3 className='text-blue-500 my-5'>Modal cards with content</h3>

				<h3 className='text-blue-500 my-5'>Sign up/login cards</h3>

				<h3 className='text-blue-500 my-5'>Recipe cards</h3>
				<div className="flex flex-wrap justify-evenly">
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
				</div>
			</div>


			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Config</h2>

				<h3 className='text-blue-500 my-5'>Typography</h3>
				<div>
					<h1>This is an h1!</h1>
					<h2>This is an h2!</h2>
					<h3>This is an h3!</h3>
					<h4>This is an h4!</h4>
					<h5>This is an h5!</h5>
					<h6>This is an h6!</h6>
					<p>This is a p!</p>
				</div>

				<h3 className='text-blue-500 my-5'>Containers</h3>
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