const Button = ({type, noHover, state, tooltip, text}) => {
  const buttonType = type ? ` btn--${type}` : ''; // Primary, secondary
  const buttonNoHover = noHover ? ' btn--no-hover' : '';
  const buttonState = state ? ` btn--${state}` : '';
  const buttonText = text ? `${text}` : '';

  return (
    <a className={`btn${buttonType}${buttonNoHover}${buttonState}`}>
      {tooltip ? (
        <div className="btn__tooltip">{tooltip}</div>
      ) : null}
      <span className="btn__text">{buttonText}</span>
    </a>
  )
}

export default Button