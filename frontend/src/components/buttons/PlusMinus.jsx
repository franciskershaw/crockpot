import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'

const PlusMinus = () => {

    return (
        <div className='flex justify-center'>
            <Icon classes={"mx-2"} type={"secondary"}>
                <FontAwesomeIcon icon={faMinus}/>
            </Icon>
            <Icon classes={"mx-2"} type={"secondary"}>
                <FontAwesomeIcon icon={faPlus}/>
            </Icon>
        </div>
    )
}

export default PlusMinus