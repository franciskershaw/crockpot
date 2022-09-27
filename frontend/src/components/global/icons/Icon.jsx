import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook} from '@fortawesome/free-solid-svg-icons'

const Icon = ({type, size, state, text}) => {
  const iconType = type ? ` icon--${type}` : '';
  const iconSize = size ? ` icon--${size}` : '';
  const iconState = state ? ` icon--${state}` : '';
  const iconText = text ? `${text}` : '';

  return (
    <div className='flex flex-col items-center'>
        <div className={`icon${iconType}${iconSize}${iconState}`}>
            <FontAwesomeIcon icon={faBook} />
        </div>
        {iconText ? (
            <>
                <h6 className='mt-2'>{text}</h6>
            </>
        ) : null}
    </div>
  )
}

export default Icon