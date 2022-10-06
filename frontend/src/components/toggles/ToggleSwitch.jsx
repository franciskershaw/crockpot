import { useRef } from 'react';

const ToggleSwitch = () => {
  const slider = useRef(null);

  const sendLeft = (e) => {
    // slider.current.className = "toggle__slider toggle__slider--left";
    slider.current.style.transform = "translate(0%,0)"
  }

  const sendRight = (e) => {
    console.log(slider)
    slider.current.style.transform = "translate(100%,0)"
    // slider.current.className = "toggle__slider toggle__slider--right";
  }

  return (
    <div className="toggle">
        {/* Option 1 */}
        <input 
          onChange={sendLeft} 
          className="toggle__input" 
          type="radio" 
          name="option" 
          id="option1" 
          checked="checked" 
        />
        <label className="toggle__option" htmlFor="option1">
          Option 1
        </label>
        {/* Option 2 */}
        <input 
          onChange={sendRight} 
          className="toggle__input" 
          type="radio" 
          name="option" 
          id="option2" 
        />
        <label className="toggle__option" htmlFor="option2">
          Option 2
        </label>
        <span ref={slider} className="toggle__slider"></span>
    </div>
  )
}

export default ToggleSwitch