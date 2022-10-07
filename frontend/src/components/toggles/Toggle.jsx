import { useRef, useState, useEffect } from 'react';

const Toggle = ({left, right, box, children}) => {
  const leftOption = left.toLowerCase().replaceAll(' ', '-');
  const rightOption = right.toLowerCase().replaceAll(' ', '-');
  const toggleBox = box ? ` toggle--boxed` : '';
  const name = `${leftOption}_${rightOption}`

  let leftContent
  let rightContent

  if (children) {
    // If only 1 item set
    leftContent = children
    
    // If 2 items set
    if (children[0]) {
      leftContent = children[0]
    }
    if (children[1]) {
      rightContent = children[1]
    }
  }

  const [direction, setDirection] = useState('left')

  const slider = useRef(null);

  const sendLeft = (e) => {
    slider.current.style.transform = "translate(0%,0)"
    setDirection('left')
  }

  const sendRight = (e) => {
    slider.current.style.transform = "translate(100%,0)"
    setDirection('right')
  }

  useEffect(() => {
  },[direction])

  return (
    <div className={`toggle${toggleBox}`}>
        <div className='toggle-switch'>
          {/* Left */}
          <input 
            onChange={sendLeft} 
            className="toggle-switch__input" 
            type="radio" 
            name={name} 
            id={leftOption} 
            checked="checked" 
          />
          <label className="toggle-switch__option" htmlFor={leftOption}>
            {left}
          </label>
          {/* Right */}
          <input 
            onChange={sendRight} 
            className="toggle-switch__input" 
            type="radio" 
            name={name}
            id={rightOption} 
          />
          <label className="toggle-switch__option" htmlFor={rightOption}>
            {right}
          </label>
          <span ref={slider} className="toggle-switch__slider"></span>
      </div>
      {box ? (
        <div className='toggle-box'>
          {direction === 'left' ? (
            // Show left content
            <div className='toggle-box__content'>
              {leftContent}
            </div>
          ) : (
            // Show right content
            <div className='toggle-box__content'>
              {rightContent}
            </div>
          )}
        </div>
      ) : null }
      
    </div>
  )
}

export default Toggle