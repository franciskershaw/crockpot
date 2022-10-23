import { useState, useEffect } from 'react';

const ToggleAndScrollPills = ({ toggleType, scrollType, data }) => {
  const togglePillType = toggleType ? `toggle-pills--${toggleType}` : ''; // Primary, secondary
  const scrollPillType = scrollType ? `scroll-pills--${scrollType}` : ''; // Primary, secondary

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
      {checkedPills.length > 0 && (
        <ul className={`pills scroll-pills ${scrollPillType}`}>
          {checkedPills.map((pill, index) => (
            <li
              onClick={() =>
                setCheckedPills((prev) =>
                  prev.filter((items) => items._id !== pill._id)
                )
              }
              key={`checkedPill_${index}`}>
              {pill.name}
            </li>
          ))}
        </ul>
      )}
      {/* <ul >
        {pills.map((pill, index) => (
          <li key={`pill_${index}`} onClick={() => removePill(index)}>
            {pill}
          </li>
        ))}
      </ul> */}
      <ul className={`pills toggle-pills ${togglePillType} text-center`}>
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
			{checkedPills.length > 0 && (
				<button>Apply {checkedPills.length} filter{checkedPills.length > 1 && 's'}</button>
			)}
    </>
  );
};

export default ToggleAndScrollPills;
