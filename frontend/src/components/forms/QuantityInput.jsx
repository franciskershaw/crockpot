import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const QuantityInput = ({ classes, step, label, nameAndId }) => {
  const inputClasses = classes ? ` ${classes}` : '';
  const inputStep = step ? step : '1';

  return (
    <div className={`flex flex-col${inputClasses}`}>
      {label ? (
        <label htmlFor={nameAndId} className="mb-1">
          {label}
        </label>
      ) : null}
      <div className="form__input--quantity">
        <div className="icon top-[-2px] left-[-2px]">
          <FontAwesomeIcon icon={faMinus} />
        </div>
        <input name={nameAndId} id={nameAndId} type="number" min={0} step={inputStep} placeholder="0" />
        <div className="icon top-[-2px] right-[-2px]">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </div>
  );
};

export default QuantityInput;
