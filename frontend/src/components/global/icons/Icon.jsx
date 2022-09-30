const Icon = ({type, state, text, children}) => {
  const iconType = type ? ` icon--${type}` : ''; // Primary, secondary
  const iconState = state ? ` icon--${state}` : '';
  const iconText = text ? `${text}` : '';

  return (
    <div className={`icon${iconType}${iconState}`}>
        {children}
        {iconText ? (
            <>
                <h6 className='icon__text mt-2'>{text}</h6>
            </>
        ) : null}
    </div>
  )
}

export default Icon