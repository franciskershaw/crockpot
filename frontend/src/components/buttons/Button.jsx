const Button = ({type, state, text}) => {
  const buttonType = type ? ` btn--${type}` : ''; // Primary, secondary
  const buttonState = state ? ` btn--${state}` : '';
  const buttonText = text ? `${text}` : '';

  return (
    <button className={`btn${buttonType}${buttonState}`}>
        {buttonText}
    </button>
  )
}

export default Button