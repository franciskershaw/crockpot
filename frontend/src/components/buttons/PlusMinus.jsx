import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const PlusMinus = ({ identifier, formData, setFormData, newRow }) => {
  const addInput = (identifier) => {
    setFormData((prevState) => ({
      ...prevState,
      [identifier]: [...prevState[identifier], newRow],
    }));
  };

  const minusInput = (identifier) => {
    if (formData[identifier].length > 1) {
      setFormData((prevState) => ({
        ...prevState,
        [identifier]: [...prevState[identifier].slice(0, -1)],
      }));
    }
  };

  return (
    <div className="flex justify-center">
      <div onClick={ () => minusInput(identifier) }>
        <Icon classes={'mx-2'} type={'secondary'}>
          <FontAwesomeIcon icon={faMinus} />
        </Icon>
      </div>
      <div onClick={ ()=> addInput(identifier) }>
        <Icon classes={'mx-2'} type={'secondary'}>
          <FontAwesomeIcon icon={faPlus} />
        </Icon>
      </div>
    </div>
  );
};

export default PlusMinus;
