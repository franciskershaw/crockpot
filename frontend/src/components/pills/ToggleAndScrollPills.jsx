import { useState, useEffect } from 'react';

const ToggleAndScrollPills = ({ type, data }) => {
  const pillType = type ? `toggle-pills--${type}` : ''; // Primary, secondary

  const [checkedPills, setCheckedPills] = useState([]);

  useEffect(() => {
    console.log(checkedPills);
  }, [checkedPills]);

  const onClick = (e, pill) => {
    if (e.target.checked) {
      setCheckedPills((prev) => [...prev, pill]);
    } else if (!e.target.checked) {
      setCheckedPills((prev) => prev.filter((items) => items._id !== pill._id));
    }
  };

  return (
    <>
      {/* <ul className={`pills scroll-pills${pillType}`}>
        {pills.map((pill, index) => (
          <li key={`pill_${index}`} onClick={() => removePill(index)}>
            {pill}
          </li>
        ))}
      </ul> */}
      <ul className={`pills toggle-pills ${pillType} text-center`}>
        {data.map((pill, index) => (
          <li key={`pill_${index}`}>
            <input
              type="checkbox"
              id={pill._id}
              value={pill._id}
              onClick={(e) => onClick(e, pill)}
            />
            <label htmlFor={pill._id}>{pill.name}</label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ToggleAndScrollPills;
