import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import PlusMinus from '../../components/buttons/PlusMinus';
import QuantityInput from '../../components/forms/QuantityInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const AddRecipePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: {},
    timeInMinutes: 30,
    serves: 4,
    categories: [],
    ingredients: [],
    instructions: [],
    notes: [],
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Header title="Add recipe">
        <Icon classes={'ml-2'} type={'no-hover'}>
          <FontAwesomeIcon icon={faPlus} />
        </Icon>
      </Header>
      <div className="container">
        <form className="form" id="addRecipe">
          {/* Recipe name - 100 */}
          <div className="form__input">
            <label htmlFor="name">Recipe name</label>
            <input
              value={formData.name}
              onChange={onChange}
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          {/* Image - 100, file */}
          <div className="form__input">
            <label htmlFor="image">Upload image</label>
            <input type="file" id="image" name="image" required />
          </div>
          {/* Time, serves - 50 50, quantities  */}
          <div className="flex justify-between">
            <div className="form__input--50">
              <QuantityInput
                nameAndId={'timeInMinutes'}
                label={'Time'}
                step={5}
                classes={'items-center'}
              />
            </div>
            <div className="form__input--50 items-center">
              <QuantityInput
                nameAndId={'serves'}
                label={'Serves'}
                step={1}
                classes={'items-center'}
              />
            </div>
          </div>
          {/* Categories - 100, select */}
          <div className="form__input">
            <label htmlFor="categories">Categories</label>
            <select name="categories">
              <option value="sensual">Sensual</option>
              <option value="erotic">Erotic</option>
              <option value="chickeeen">Chickeeen</option>
            </select>
          </div>
          <PlusMinus />
          {/* Ingredients - 50 25 25, select */}
          <div className="flex justify-between">
            <div className="form__input form__input--50">
              <label htmlFor="ingredient">Ingredients</label>
              <select name="ingredient">
                <option value="apple">Apple</option>
                <option value="banana">Banana</option>
                <option value="chickeeen">Chickeeen</option>
              </select>
            </div>
            <div className="form__input form__input--25">
              <label htmlFor="ingredientNum" className="invisible">
                Quantities
              </label>
              <input
                name="ingredientNum"
                type="number"
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form__input form__input--25">
              <label htmlFor="ingredientUnit" className="invisible">
                Units
              </label>
              <select name="ingredientUnit">
                <option value="">-</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
          <PlusMinus />
          {/* Instructions - 100 */}
          <div className="form__input">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" id="instructions" name="instructions" required />
          </div>
          <PlusMinus />
          {/* Notes */}
          <div className="form__input">
            <label htmlFor="notes">Notes</label>
            <input type="text" id="notes" name="notes" required />
          </div>
          <PlusMinus />
        </form>
        <div className="mt-5 text-center">
          <button
            className="btn btn--secondary"
            type="submit"
            form="addRecipe"
            value="Add Recipe">
            Add Recipe
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRecipePage;
