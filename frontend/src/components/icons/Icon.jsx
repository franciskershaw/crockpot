const Icon = ({type, noHover, classes, state, text, children}) => {
  const iconType = type ? ` icon--${type}` : ''; // Primary, secondary
  const iconNoHover = noHover ? ' icon--no-hover' : '';
  const iconClasses = classes ? ` ${classes}` : '';
  const iconState = state ? ` icon--${state}` : '';
  const iconText = text ? `${text}` : '';

  return (
    <div className={`icon${iconType}${iconNoHover}${iconClasses}${iconState}`}>
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