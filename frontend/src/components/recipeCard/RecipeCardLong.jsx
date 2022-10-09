import { Link } from 'react-router-dom';
import Icon from '../icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUtensils, faHeart} from '@fortawesome/free-solid-svg-icons'
import QuantityInput from '../../components/forms/QuantityInput';

const RecipeCardLong = () => {
  return (
    <div className='recipe-card-long'>
      <div className='recipe-card-long__image-container'>
        <div className='recipe-card__image'>
           <img src="https://img.hellofresh.com/hellofresh_s3/image/pulled-chicken-burgers-3c693f20.jpg" alt=""></img>
         </div>
      </div>
      <div className='recipe-card-long__content-container'>
        <h4 className='h4 mb-2'>Pulled Chicken Burgers</h4>
        <div className='flex justify-between'>
          <QuantityInput />
          <Icon type={"secondary"}>
            <FontAwesomeIcon icon={faUtensils}/>
          </Icon>
          <Icon type={"secondary"}>
            <FontAwesomeIcon icon={faHeart}/>
          </Icon>
        </div>
      </div>
    </div>
  )
}

export default RecipeCardLong