import { useState } from 'react';

const Pill = ({ content, action }) => {
  const [checked, setChecked] = useState(content.obtained);

  const toggleChecked = (e) => {
    setChecked((prev) => !prev);
    action(e.target.value);
  };
  return (
    <>
      <input
        type="checkbox"
        id={content.item._id}
        value={content.item._id}
        checked={checked}
        onChange={(e) => toggleChecked(e)}
      />
      <label htmlFor={content.item._id}>
        {content.item.name} x {Math.round(content.quantity * 100) / 100}
        {content.unit === 'cans' ? ' ' : ''}
        {content.unit}
      </label>
    </>
  );
};

export default Pill;
