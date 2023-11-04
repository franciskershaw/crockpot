import { ShoppingListItem as ShoppingListItemType } from '@/src/types/types';
import Button from '@/src/components/Button/Button';
import { useState } from 'react';
import useShoppingList from '../../hooks/useShoppingList';
import { FaTrash } from 'react-icons/fa';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item }) => {
  const [inputActive, setInputActive] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [obtained, setObtained] = useState(item.obtained);

  const { toggleObtained } = useShoppingList();

  const handleClickCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      toggleObtained({
        itemId: item.item._id,
        obtained: e.target.checked,
      });
      setObtained(e.target.checked);
    } catch (err) {
      setObtained(!e.target.checked);
    }
  };

  const handleChangeQuantity = () => {
    try {
      console.log('origianl quantity', item.quantity);
      console.log('new total quantity', quantity);
      console.log('extra quantity required:', quantity - item.quantity);
    } catch (err) {
      console.log(err);
      setQuantity(item.quantity);
    }
    setInputActive(false);
  };

  return (
    <div className="flex gap-4 items-center tw" key={item.item._id}>
      <div className="flex-grow flex items-center gap-4">
        <input
          checked={obtained}
          onChange={handleClickCheckbox}
          type="checkbox"
          name=""
          id=""
        />
        <h3>{item.item.name}</h3>
        <p>x</p>
        {inputActive ? (
          <div className="flex flex-col">
            <input
              type="number"
              name=""
              id=""
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button onClick={handleChangeQuantity} className="text-xs">
              Confirm
              {/* Can have this say 'cancel' if nothing has changed in the input */}
            </button>
          </div>
        ) : (
          <Button onClick={() => setInputActive(true)} type="primary">
            {quantity}
          </Button>
        )}
        <p>{item.unit}</p>
      </div>
      <Button>
        <FaTrash />
      </Button>
    </div>
  );
};
export default ShoppingListItem;
