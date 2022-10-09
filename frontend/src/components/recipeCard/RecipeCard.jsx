import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUtensils, faHeart} from '@fortawesome/free-solid-svg-icons'

const RecipeCard = () => {
  return (
    <div className="recipe-card">
      <div className='recipe-card__image-container'>
        <div className='recipe-card__icons flex justify-between p-1'>
          <Icon type={"secondary"} outline>
            <FontAwesomeIcon icon={faUtensils}/>
          </Icon>
          <Icon type={"secondary"} outline>
            <FontAwesomeIcon icon={faHeart}/>
          </Icon>
        </div>
        <div className='recipe-card__image'>
          <img src="https://img.hellofresh.com/hellofresh_s3/image/pulled-chicken-burgers-3c693f20.jpg" alt=""></img>
        </div>
      </div>
      <div className='recipe-card__title'>
        <h4 className='text-white h5'>Pulled Chicken Burgers</h4>
      </div>
    </div>
  )
}

export default RecipeCard