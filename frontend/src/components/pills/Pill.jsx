const Pill = ({type, invert, noHover, state, tooltip, text}) => {
    const pillType = type ? ` btn--${type}` : ''; // Primary, secondary
    const buttonInvert = invert ? ` btn--invert` : '';
  
    return (
      <a className={`btn${buttonType}${buttonInvert}${buttonNoHover}${buttonState}`}>
        {tooltip ? (
          <div className="btn__tooltip">{tooltip}</div>
        ) : null}
        <span className="btn__text">{buttonText}</span>
      </a>
    )
  }
  
  export default Pill