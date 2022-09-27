import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const Icon = ({type, state, text}) => {
  const iconType = type ? ` icon--${type}` : ''; // Primary, secondary
  const iconState = state ? ` icon--${state}` : '';
  const iconText = text ? `${text}` : '';

  return (
    <div className={`icon${iconType}${iconState}`}>
        <FontAwesomeIcon icon={faBook} />
        {iconText ? (
            <>
                <h6 className='icon__text mt-2'>{text}</h6>
            </>
        ) : null}
    </div>
  )
}

export default Icon