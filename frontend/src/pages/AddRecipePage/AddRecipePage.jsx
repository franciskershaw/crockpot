import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import PlusMinus from '../../components/buttons/PlusMinus';
import QuantityInput from '../../components/forms/QuantityInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddRecipe } from '../../hooks/recipes/useAddRecipe';
import { useRecipeCategories } from '../../hooks/recipes/useRecipeCategories';
import { useItems } from '../../hooks/items/useItems';
import { useUser } from '../../hooks/auth/useUser';

const AddRecipePage = () => {
  document.title = 'Crockpot | Add Recipe'
  const { recipeCategories } = useRecipeCategories();
  const { ingredients } = useItems();
  const addRecipe = useAddRecipe();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    timeInMinutes: 30,
    serves: 4,
    categories: [{ _id: '' }], // ['', '', '']
    ingredients: [
      {
        _id: '',
        quantity: 1,
        unit: '',
      },
    ],
    instructions: [{ instruction: '' }],
    notes: [{ note: '' }],
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeMultiple = (e, index, key) => {
    let data = [...formData[key]];
    let subKey = e.target.name;
    data[index][subKey] = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [key]: data,
    }));
  };

  const addInput = (key) => {
    let object;
    if (key === 'categories') {
      object = {
        _id: '',
      };
    } else if (key === 'ingredients') {
      object = {
        _id: '',
        quantity: 1,
        unit: '',
      };
    } else if (key === 'instructions') {
      object = {
        instruction: '',
      };
    } else if (key === 'notes') {
      object = {
        note: '',
      };
    }
    setFormData((prevState) => ({
      ...prevState,
      [key]: [...prevState[key], object],
    }));
  };

  const minusInput = (key) => {
    if (formData[key].length > 1) {
      setFormData((prevState) => ({
        ...prevState,
        [key]: [...prevState[key].slice(0, -1)],
      }));
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];

    if (
      !(
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg'
      )
    ) {
      toast.error(
        'Please select from the following file types: jpg, jpeg, png'
      );
      e.target.value = null;
      return;
    } else if (file.size > 500000) {
      toast.error('Please upload an image smaller than 500kb');
      e.target.value = null;
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      image,
      timeInMinutes,
      serves,
      categories,
      ingredients,
      instructions,
      notes,
    } = formData;

    const categoriesFormated = categories.map((object) => object._id);
    const instructionsFormated = instructions.map(
      (object) => object.instruction
    );
    const notesFormated = notes.map((object) => object.note);

    const data = new FormData();

    data.append('name', name);
    data.append('image', image);
    data.append('timeInMinutes', timeInMinutes);
    categoriesFormated.forEach((category) =>
      data.append(`categories`, category)
    );
    ingredients.forEach((ingredient, index) => {
      const keyValues = Object.entries(ingredient);
      for (let keyValue of keyValues) {
        let key = keyValue[0];
        let value = keyValue[1];
        if (key === 'quantity') {
          value = value / serves;
        }
        data.append(`ingredients[${index}][${key}]`, value);
      }
    });
    instructionsFormated.forEach((instruction) =>
      data.append(`instructions`, instruction)
    );
    notesFormated.forEach((note) => data.append(`notes`, note));
    data.append('createdBy', user._id);
    addRecipe(data);
  };

  return (
    <>
      <Header title="Add recipe">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faPlus} />
        </Icon>
      </Header>
      <div className="container container--sm !max-w-[600px]">
        <form onSubmit={onSubmit} className="form" id="addRecipe">
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
            <input
              onChange={imageHandler}
              type="file"
              id="image"
              name="image"
            />
          </div>
          {/* Time, serves - 50 50, quantities  */}
          <div className="flex justify-between">
            <div className="form__input--50">
              <QuantityInput
                nameAndId={'timeInMinutes'}
                value={formData.timeInMinutes}
                setValue={setFormData}
                label={'Time'}
                step={5}
                classes={'items-center'}
              />
            </div>
            <div className="form__input--50 items-center">
              <QuantityInput
                nameAndId={'serves'}
                value={formData.serves}
                setValue={setFormData}
                label={'Serves'}
                step={1}
                classes={'items-center'}
                maxValue={20}
              />
            </div>
          </div>
          {/* Categories - 100, select */}
          <div className="form__input">
            <label htmlFor="categories">Categories</label>
            <div className="space-y-1">
              {formData.categories.length &&
                formData.categories.map((category, index, rows) => (
                  <div key={`categoryInput_${index}`}>
                    <select
                      onChange={(e) => onChangeMultiple(e, index, 'categories')}
                      name="_id"
                      defaultValue={'Please select a category'}>
                      <option disabled value="Please select a category">
                        Please select a category
                      </option>
                      {recipeCategories.map((category) => (
                        <option key={category.name} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {index + 1 === rows.length && (
                      <PlusMinus
                        minusInput={() => minusInput('categories')}
                        addInput={() => addInput('categories')}
                        classes={'mt-1'}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Ingredients - 50 25 25, select */}
          <div className="space-y-1">
            <label htmlFor="ingredients">Ingredients</label>
            {formData.ingredients.length &&
              formData.ingredients.map((ingredient, index, rows) => (
                // HI ZOE! Below DIV is a container housing the 3 inputs required for one 'set' of ingredients (name, quanity, unit)
                <div
                  key={`ingredientInput_${index}`}
                  className="flex justify-between flex-wrap">
                  <div className="form__input form__input--50">
                    {/* <label htmlFor="ingredient">Ingredients</label> */}
                    <select
                      name="_id"
                      onChange={(e) =>
                        onChangeMultiple(e, index, 'ingredients')
                      }
                      defaultValue="Please select an ingredient">
                      <option disabled value="Please select an ingredient">
                        Please select an ingredient
                      </option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.name} value={ingredient._id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form__input form__input--25">
                    {/* <label htmlFor="ingredientNum" className="invisible">Quantities</label> */}
                    <input
                      name="quantity"
                      onChange={(e) =>
                        onChangeMultiple(e, index, 'ingredients')
                      }
                      value={ingredient.quantity}
                      type="number"
                      min="0"
                      placeholder="0"
                      step="any"
                    />
                  </div>
                  <div className="form__input form__input--25">
                    {/* <label htmlFor="ingredientUnit" className="invisible">Units</label> */}
                    <select
                      name="unit"
                      defaultValue=""
                      onChange={(e) =>
                        onChangeMultiple(e, index, 'ingredients')
                      }>
                      <option value="">-</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">Tbsp</option>
                      <option value="cans">cans</option>
                    </select>
                  </div>
                  {index + 1 === rows.length && (
                    <PlusMinus
                      addInput={() => addInput('ingredients')}
                      minusInput={() => minusInput('ingredients')}
                      classes={'mt-1 w-full'}
                    />
                  )}
                </div>
              ))}
          </div>

          {/* Instructions - 100 */}
          <div className="form__input">
            <div className="space-y-1">
              <label htmlFor="instructions">Instructions</label>
              {formData.instructions.length &&
                formData.instructions.map((instruction, index, rows) => (
                  <div key={`instructionInput_${index}`}>
                    <input
                      type="text"
                      name="instruction"
                      value={instruction.instruction}
                      required
                      onChange={(e) =>
                        onChangeMultiple(e, index, 'instructions')
                      }
                    />
                    {index + 1 === rows.length && (
                      <PlusMinus
                        addInput={() => addInput('instructions')}
                        minusInput={() => minusInput('instructions')}
                        classes={'mt-1'}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form__input">
            <label htmlFor="notes">Notes</label>
            <div className="space-y-1">
              {formData.notes.length &&
                formData.notes.map((note, index, rows) => (
                  <div key={`noteInput_${index}`}>
                    <input
                      type="text"
                      name="note"
                      value={note.note}
                      onChange={(e) => onChangeMultiple(e, index, 'notes')}
                    />
                    {index + 1 === rows.length && (
                      <PlusMinus
                        addInput={() => addInput('notes')}
                        minusInput={() => minusInput('notes')}
                        classes={'mt-1'}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
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
