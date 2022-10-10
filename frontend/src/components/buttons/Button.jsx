const Button = ({type, outline, noHover, state, tooltip, onClick, text}) => {
  const buttonType = type ? ` btn--${type}` : ''; // Primary, secondary
  const buttonOutline = outline ? ` btn--outline` : '';
  const buttonNoHover = noHover ? ' btn--no-hover' : '';
  const buttonState = state ? ` btn--${state}` : '';
  const buttonText = text ? `${text}` : '';

  return (
    <a onClick={onClick} className={`btn${buttonType}${buttonOutline}${buttonNoHover}${buttonState}`}>
      {tooltip ? (
        <div className="btn__tooltip">{tooltip}</div>
      ) : null}
      <span className="btn__text">{buttonText}</span>
    </a>
  )
}

export default Button