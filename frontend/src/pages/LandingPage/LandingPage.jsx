import Button from '../../components/buttons/Button'
import PlusMinus from '../../components/buttons/PlusMinus'
import Modal from '../../components/modals/Modal';
import Header from '../../layout/header/Header';
import RecipeCard from '../../components/recipeCard/RecipeCard'
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong'
import ScrollPills from '../../components/pills/ScrollPills';
import TogglePills from '../../components/pills/TogglePills';
import QuantityInput from '../../components/forms/QuantityInput';
import Toggle from '../../components/toggles/Toggle';
import { toast } from 'react-toastify';
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';

const LandingPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
        document.body.classList.add("modal-is-open")
        setIsModalOpen(true)
    }

	const gimmeToast = () => {
		toast.info("Lorem ipsum dolor"); // same as toast(message, {type: "info"});
		toast.error("Lorem ipsum dolor")
		toast.success("Lorem ipsum dolor")
		toast.warn("Lorem ipsum dolor")
	}

	return (
		<>
			<Header title="Header">
			</Header>

			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Atoms</h2>

				<h3 className='text-blue-500 my-5'>Toasts</h3>
				<button className='btn btn--secondary' onClick={gimmeToast}>Let there be toast!</button>

				<h3 className='text-blue-500 my-5'>Modal</h3>
				<button onClick={openModal} className='btn btn--secondary'>Open modal</button>
				{isModalOpen ? (
					<Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} heading={"Modal heading"}>
						<p>Modal modal modal!</p>
					</Modal>
				) : null}

				<h3 className='text-blue-500 my-5'>Buttons</h3>
				<div>
				<div className='flex justify-evenly'>
					<Button text={"Black"}></Button>
					<Button type={"secondary"} text={"Purple"}></Button>
					<Button noHover={true} text={"No hover"}></Button>
				</div>
				<div className='flex justify-evenly'>
					<Button text={"Black inverted"} outline></Button>
					<Button type={"secondary"} text={"Purple outlineed"} outline></Button>
					<Button noHover={true} text={"No hover outlineed"} outline></Button>
				</div>

				<h3 className='text-blue-500 my-5'>Buttons with tooltip</h3>
				<div className='flex justify-evenly'>
					<Button text={"Black"} tooltip={"1"}></Button>
					<Button type={"secondary"} text={"Purple"} tooltip={"2"}></Button>
					<Button noHover={true} text={"No hover"} tooltip={"3"}></Button>
				</div>
				<div className='flex justify-evenly'>
					<Button text={"Black outlineed"} tooltip={"1"} outline></Button>
					<Button type={"secondary"} text={"Purple outlineed"} tooltip={"2"} outline></Button>
					<Button noHover={true} text={"No hover outlineed"} tooltip={"3"} outline></Button>
				</div>
				<div className='mt-5'>
					<PlusMinus/>
				</div>
				</div>

				<h3 className='text-blue-500 my-5'>Form inputs</h3>
				<div>
					<form action="" className='form container container--sm'>
						{/* 100% */}
						<div className="form__input">
							<label htmlFor="input1">100%</label>
							<input
							type="text"
							id="input1"
							name="input1"
							required
							/>
						</div>
						{/* 75%, 25% */}
						<div className='flex justify-between'>
							<div className="form__input form__input--75">
								<label htmlFor="input1">75%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
							<div className="form__input form__input--25">
								<label htmlFor="input1">25%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
						</div>
						{/* 50%, 50% */}
						<div className='flex justify-between'>
							<div className="form__input form__input--50">
								<label htmlFor="input1">50%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
							<div className="form__input form__input--50">
								<label htmlFor="input1">50%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
						</div>
						{/* 50%, 25%, 25% */}
						<div className='flex justify-between'>
							<div className="form__input form__input--50">
								<label htmlFor="input1">50%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
							<div className="form__input form__input--25">
								<label htmlFor="input1">25%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
							<div className="form__input form__input--25">
								<label htmlFor="input1">25%</label>
								<input
								type="text"
								id="input1"
								name="input1"
								required
								/>
							</div>
						</div>
						{/* Select */}
						<div className="form__input">
							<label htmlFor="input2">Input 2</label>
							<select>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
								<option value="option4">Option 4</option>
							</select>
						</div>
						{/* File input */}
						<div className='form__input'>
							<label htmlFor="filename">25%</label>
							<input
								type="file"
								id="filename"
								name="filename"
							/>
						</div>
						{/* Quantity input */}
						<QuantityInput label={"Quantity Input"} step={5} />
					</form>
					{/* Submit button */}
					<button className="btn" type="submit" form="form" value="Submit">
						<span className='btn__text'>Submit</span>
					</button>
				</div>

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
				<div className='flex justify-evenly'>
					<Icon outline>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline noHover={true}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline noHover={true} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline text={"Add recipe"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline noHover={true} text={"Add recipe"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline text={"Add recipe"} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
					<Icon outline noHover={true} text={"Add recipe"} type={"secondary"}>
						<FontAwesomeIcon icon={faBook}/>
					</Icon>
				</div>

				<h3 className='text-blue-500 my-5'>Toggles</h3>
				<div className='container container--sm'>
					<Toggle left={"Left"} right={"Right"} />
				</div>
				<div className='mt-4 container container--sm'>
					<Toggle left={"Left box"} right={"Right box"} box>
						<>Ingredients, blah</>
						{/* <>Ingredients, blah blah</>
						<>Ingredients, blah blah blah</> */}
					</Toggle>
				</div>

				<h3 className='text-blue-500 my-5'>Pills</h3>

				<div>
					{/* <TogglePills /> */}
					<TogglePills type={""} name={"one"}/>
				</div>

				<div>
					{/* <TogglePills /> */}
					<TogglePills type={"secondary"} name={"two"}/>
				</div>

				<div>
					<ScrollPills type={""}/>
					<ScrollPills type={"secondary"}/>
				</div>
				
				<h3 className='text-blue-500 my-5'>Accordion</h3>

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
					{/* <RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard>
					<RecipeCard></RecipeCard> */}
				</div>

				<h3 className='text-blue-500 my-5'>Recipe cards - layout 2</h3>
				<div className='container container--md space-y-5'>
					<RecipeCardLong></RecipeCardLong>
					<RecipeCardLong></RecipeCardLong>
					<RecipeCardLong></RecipeCardLong>
				</div>

			</div>


			<div className='flex flex-col'>
				<h2 className='text-red-500 font-bold underline'>Config</h2>

				<h3 className='text-blue-500 my-5'>Colours</h3>
				<div className='flex space-x-5'>
					<div className='w-20 h-20 rounded-full bg-white border border-black'></div>
					<div className='w-20 h-20 rounded-full bg-grey-bg border border-black'></div>
					<div className='w-20 h-20 rounded-full bg-grey-inactive'></div>
					<div className='w-20 h-20 rounded-full bg-purple'></div>
					<div className='w-20 h-20 rounded-full bg-black'></div>
				</div>


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