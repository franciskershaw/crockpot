import SearchBar from '@/src/components/FormSearchBar/SearchBar';
import { useState } from 'react';
import Accordion from '@/src/components/Accordion/Accordion';
import useShoppingList from '../../hooks/useShoppingList';
import { FaQuestion } from 'react-icons/fa';
import Icon from '@/src/components/Icon/Icon';
import iconMapping from '@/src/components/Icon/iconMapping';
import ShoppingListItem from './ShoppingListItem';

const ShoppingList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { groupedShoppingList } = useShoppingList();

  const accordionItems = groupedShoppingList?.map((category) => {
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {/* header and search */}
        <h2 className="w-3/4 font-bold pt-3">Shopping List</h2>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          label="Search Extra Items"
        />
      </div>
      {/* Shopping list */}
      <Accordion items={accordionItems} />
    </div>
  );
};

export default ShoppingList;
