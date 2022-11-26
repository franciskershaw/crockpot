import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const QuantityInput = ({ classes, step, label, nameAndId, value, setValue, maxValue = Infinity }) => {
  const inputClasses = classes ? ` ${classes}` : '';
  const inputStep = step ? step : '1';

  const inputRef = useRef()

  const handleSubtract = () => {
    if (value > inputStep) {
      setValue((prevState) => ({
        ...prevState,
        [nameAndId]: value - inputStep
      }))  
    }
  }

  const handleAdd = () => {
    if (value < maxValue) {
      setValue((prevState) => ({
        ...prevState,
        [nameAndId]: value + inputStep
      }))
    }
  }

  return (
    <div className={`flex flex-col${inputClasses}`}>
      {label ? (
        <label htmlFor={nameAndId} className="mb-1">
          {label}
        </label>
      ) : null}
      <div className="form__input--quantity">
        <div className="icon top-[-2px] left-[-2px]" onClick={handleSubtract}>
          <FontAwesomeIcon icon={faMinus} />
        </div>
        <input
          value={value}
          name={nameAndId}
          id={nameAndId}
          type="number"
          step={inputStep}
          placeholder="0"
          ref={inputRef}
          readOnly
        />
        <div className="icon top-[-2px] right-[-2px]" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </div>
  );
};

export default QuantityInput;
