const Button = ({type, outline, noHover, state, tooltip, onClick, text, classes}) => {
  const buttonType = type ? ` btn--${type}` : ''; // Primary, secondary
  const buttonOutline = outline ? ` btn--outline` : '';
  const buttonNoHover = noHover ? ' btn--no-hover' : '';
  const buttonState = state ? ` btn--${state}` : '';
  const buttonText = text ? `${text}` : '';
  const buttonClasses = classes ? ` ${classes}` : '';

  return (
    <a onClick={onClick} className={`btn${buttonType}${buttonOutline}${buttonNoHover}${buttonState}${buttonClasses}`}>
      {tooltip > 0 && (
        <div className="btn__tooltip">{tooltip}</div>
      )}
      <span className="btn__text">{buttonText}</span>
    </a>
  )
}

export default Button