import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import { useState, useMemo } from 'react';
import Accordion from '@/src/components/Accordion/Accordion';
import useShoppingList from '../../hooks/useShoppingList';
import useExtraItems from '../../hooks/useExtraItems';
import { FaQuestion } from 'react-icons/fa';
import Icon from '@/src/components/Icon/Icon';
import iconMapping from '@/src/components/Icon/iconMapping';
import ShoppingListItem from './ShoppingListItem';
import Button from '@/src/components/Button/Button';

const ShoppingList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { groupedShoppingList } = useShoppingList();
  const { clearExtraItems } = useExtraItems();

  const accordionItems = useMemo(() => {
    return groupedShoppingList?.map((category) => {
      const IconComponent = iconMapping[category.faIcon] || FaQuestion;
      return {
        heading: (
          <div className="flex gap-4">
            <Icon>
              <IconComponent />
            </Icon>
            <h2>{category.categoryName}</h2>
            <span>
              ({category.items.filter((item) => item.obtained).length}/
              {category.items.length})
            </span>
          </div>
        ),
        children: (
          <div>
            {category.items.map((item) => (
              <ShoppingListItem key={item.item._id} item={item} />
            ))}
          </div>
        ),
      };
    });
  }, [groupedShoppingList]);

  return (
    <div className="flex flex-col">
      <h2 className="w-3/4 font-bold pt-3">Shopping List</h2>
      <div className="flex items-end justify-between">
        {/* header and search */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          label="Search Extra Items"
        />
        <Button onClick={() => clearExtraItems()} border text="Reset to menu" />
      </div>
      {/* Shopping list */}
      <Accordion items={accordionItems} />
    </div>
  );
};

export default ShoppingList;
