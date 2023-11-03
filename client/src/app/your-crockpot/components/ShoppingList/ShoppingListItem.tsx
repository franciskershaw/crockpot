import { ShoppingListItem as ShoppingListItemType } from '@/src/types/types';
import QuantityInput from '@/src/components/QuantityInput/QuantityInput';
import Button from '@/src/components/Button/Button';
import { useState, useEffect } from 'react';
import useShoppingList from '../../hooks/useShoppingList';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item }) => {
  const [inputActive, setInputActive] = useState(false);
  const [obtained, setObtained] = useState(item.obtained);

  const { toggleObtained } = useShoppingList();

  const handleClickCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleObtained({
      itemId: item.item._id,
      obtained: e.target.checked,
    });
    setObtained(e.target.checked);
  };

  return (
    <div className="flex gap-4 items-center tw" key={item.item._id}>
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
          <QuantityInput initialValue={item.quantity} />
          <button onClick={() => setInputActive(false)} className="text-xs">
            Cancel
          </button>
        </div>
      ) : (
        <Button onClick={() => setInputActive(true)} type="primary">
          {item.quantity}
        </Button>
      )}

      {item.unit}
    </div>
  );
};
export default ShoppingListItem;
