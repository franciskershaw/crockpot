import { useEditUser } from '../../hooks/user/useEditUser';
import { useState } from 'react';

const Pill = ({ content }) => {
  
  const [checked, setChecked] = useState(content.obtained);
  const editUser = useEditUser()

  const toggleObtained = (e) => {
    setChecked((prev) => !prev);
    // editUser({})
  };
  return (
    <>
      <input
        type="checkbox"
        id={content.item._id}
        value={content.item._id}
        checked={checked}
        onChange={(e) => toggleObtained(e)}
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
