import { Link } from 'react-router-dom';
import Icon from '../icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUtensils, faHeart, faTrash} from '@fortawesome/free-solid-svg-icons'
import QuantityInput from '../../components/forms/QuantityInput';

const RecipeCardLong = () => {
  return (
    <div className='recipe-card-long'>
      <div className='recipe-card-long__image-container'>
        <div className='recipe-card__image'>
           <img src="https://img.hellofresh.com/hellofresh_s3/image/pulled-chicken-burgers-3c693f20.jpg" alt=""></img>
         </div>
      </div>
      <div className='recipe-card-long__content-container space-y-2'>
        <h4 className='h4'>Pulled Chicken Burgers</h4>
        <div className='flex flex-col space-y-2'>
          <QuantityInput />
          <div className='flex space-x-2'>
            <Icon type={"secondary"} outline>
              <FontAwesomeIcon icon={faUtensils}/>
            </Icon>
            <Icon type={"secondary"} outline>
              <FontAwesomeIcon icon={faHeart}/>
            </Icon>
            <Icon type={"secondary"} outline>
              <FontAwesomeIcon icon={faTrash}/>
            </Icon>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeCardLong