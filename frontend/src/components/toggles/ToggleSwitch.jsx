import { useRef } from 'react';

const ToggleSwitch = ({left, right}) => {
  const leftOption = left.toLowerCase().replaceAll(' ', '-');
  const rightOption = right.toLowerCase().replaceAll(' ', '-');
  const name = `${leftOption}_${rightOption}`

  const slider = useRef(null);

  const sendLeft = (e) => {
    slider.current.style.transform = "translate(0%,0)"
  }

  const sendRight = (e) => {
    slider.current.style.transform = "translate(100%,0)"
  }

  return (
    <div className="toggle">
        {/* Option 1 */}
        <input 
          onChange={sendLeft} 
          className="toggle__input" 
          type="radio" 
          name={name} 
          id={leftOption} 
          checked="checked" 
        />
        <label className="toggle__option" htmlFor={leftOption}>
          {left}
        </label>
        {/* Option 2 */}
        <input 
          onChange={sendRight} 
          className="toggle__input" 
          type="radio" 
          name={name}
          id={rightOption} 
        />
        <label className="toggle__option" htmlFor={rightOption}>
          {right}
        </label>
        <span ref={slider} className="toggle__slider"></span>
    </div>
  )
}

export default ToggleSwitch