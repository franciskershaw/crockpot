const Icon = ({type, outline, noHover, classes, state, text, children}) => {
  const iconType = type ? ` icon--${type}` : ''; // Primary, secondary
  const iconOutline = outline ? ` icon--outline` : ''; // Primary, secondary
  const iconNoHover = noHover ? ' icon--no-hover' : '';
  const iconClasses = classes ? ` ${classes}` : '';
  const iconState = state ? ` icon--${state}` : '';
  const iconText = text ? `${text}` : '';

  return (
    <div className={`icon${iconType}${iconOutline}${iconNoHover}${iconClasses}${iconState}${iconText ? ' icon--no-hover' : ''}`}>
        {children}
        {iconText ? (
            <>
                <h6 className='icon__text mt-2 md:mt-1 md:ml-2'>{text}</h6>
            </>
        ) : null}
    </div>
  )
}

export default Icon