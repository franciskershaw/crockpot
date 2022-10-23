import { useState, useEffect, useRef } from 'react';

const ToggleAndScrollPills = ({ toggleType, scrollType, data, setToolTip, setModalOpen }) => {
  const togglePillType = toggleType ? `toggle-pills--${toggleType}` : ''; // Primary, secondary
  const scrollPillType = scrollType ? `scroll-pills--${scrollType}` : ''; // Primary, secondary

  const [checkedPills, setCheckedPills] = useState([]);

  useEffect(() => {
    console.log(checkedPills);
		setToolTip(checkedPills.length)
  }, [checkedPills]);

  const togglePillsList = useRef();

  const onClick = (e, pill) => {
    if (e.target.checked) {
      setCheckedPills((prev) => [...prev, pill]);
    } else if (!e.target.checked) {
      setCheckedPills((prev) => prev.filter((items) => items._id !== pill._id));
    }
  };

  const removeScrollPills = (pill) => {
    setCheckedPills((prev) => prev.filter((items) => items._id !== pill._id));
    togglePillsList.current.childNodes.forEach((child) => {
      if (child.children[0].id === pill._id) {
        child.children[0].checked = false;
      }
    });
  };

	const onSubmit = () => {
		setModalOpen((prev) => !prev)
	}

  return (
    <>
      {checkedPills.length > 0 && (
        <ul className={`pills scroll-pills ${scrollPillType}`}>
          {checkedPills.map((pill, index) => (
            <li
              onClick={() => removeScrollPills(pill)}
              key={`checkedPill_${index}`}>
              {pill.name}
            </li>
          ))}
        </ul>
      )}
      <ul
        ref={togglePillsList}
        className={`pills toggle-pills ${togglePillType} text-center`}>
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
        <button onClick={onSubmit}>
          Apply {checkedPills.length} filter{checkedPills.length > 1 && 's'}
        </button>
      )}
    </>
  );
};

export default ToggleAndScrollPills;
