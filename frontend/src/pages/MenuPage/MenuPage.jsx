import Header from '../../layout/header/Header'
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUtensils} from '@fortawesome/free-solid-svg-icons'

const MenuPage = () => {
	return (
		<>
		<Header title='Menu'>
			<Icon classes={"ml-2"} type={"no-hover"}>
				<FontAwesomeIcon icon={faUtensils}/>
			</Icon>
		</Header>
		<div>MenuPage</div>
		</>
		
	)
}

export default MenuPage