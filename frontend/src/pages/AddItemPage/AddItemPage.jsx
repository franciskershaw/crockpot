import React from 'react';
import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useItemCategories } from '../../hooks/items/useItemCategories';
import { useState, useEffect } from 'react';

const AddItemPage = () => {
  const { itemCategories } = useItemCategories();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Header title="Add Item">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faPlus} />
        </Icon>
      </Header>
      <div className="container container--sm !max-w-[600px]">
        <form className="form" id="addItem">
          <div className="form__input">
            <label htmlFor="name">Item name</label>
            <input
              value={formData.name}
              onChange={onChange}
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="form__input">
            <label htmlFor="category">Category</label>
            <select
              name="_id"
              defaultValue="Please select an item"
              onChange={onChange}>
              <option disabled value="Please select an item">
                Please select an ingredient
              </option>
              {itemCategories.map((item, i) => (
                <option key={`item_${i}`} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-5 text-center">
            <button
              className="btn btn--secondary"
              type="submit"
              form="addItem"
              value="Add Item">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddItemPage;
