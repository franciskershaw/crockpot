import Header from '../../layout/header/Header'
import Icon from '../../components/global/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const CookbookPage = () => {
	return (
		<>
		<Header title='Cookbook'>
			<Icon classes={"ml-2"} type={"no-hover"}>
			<FontAwesomeIcon icon={faBook}/>
			</Icon>
		</Header>
		CookbookPage
		</>
	)
}

export default CookbookPage