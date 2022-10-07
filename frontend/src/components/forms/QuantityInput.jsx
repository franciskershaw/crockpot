import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'

const QuantityInput = ({step, label}) => {
    const inputStep = step ? step : '1';

    return (
        <div className="flex flex-col">
            {label ? (
                <label htmlFor="" className='mb-1'>{label}</label>
            ) : null}
            <div className="form__input--quantity">
                <div className="icon"><FontAwesomeIcon icon={faMinus}/></div>
                <input type="number" min={0} step={inputStep} placeholder="0"/>
                <div className="icon"><FontAwesomeIcon icon={faPlus}/></div>
            </div>
        </div>
    )
}

export default QuantityInput