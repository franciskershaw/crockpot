import { useState, useEffect, useRef } from 'react';

const ToggleAndScrollPills = ({ toggleTheme, scrollTheme, data, setFilters, filters, setModalOpen, filterType }) => {
  const togglePillType = toggleTheme ? `pills--toggle--${toggleTheme}` : ''; // Primary, secondary
  const scrollPillType = scrollTheme ? `pills--scroll--${scrollTheme}` : ''; // Primary, secondary

  const [checkedPills, setCheckedPills] = useState([]);

  useEffect(() => {
    setCheckedPills(filters[filterType])
  },[filters])

  const togglePillsList = useRef();

  const onChange = (e, pill) => {
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
    setFilters((prev) => ({
      ...prev,
      [filterType]: checkedPills
    }))
    document.body.classList.remove("modal-is-open")
		setModalOpen(false)
	}

  return (
    <>
      {checkedPills.length > 0 && (
        <ul className={`pills pills--scroll ${scrollPillType}`}>
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
        className={`pills pills--toggle ${togglePillType} text-center`}>
        {data.map((pill, index) => (
          <li key={`pill_${index}`}>
            <input
              type="checkbox"
              id={pill._id}
              value={pill._id}
              onChange={(e) => onChange(e, pill)}
              defaultChecked={filters[filterType].includes(pill)}
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
      {checkedPills.length === 0 && filters[filterType].length > 0 && (
        <button onClick={onSubmit}>
          Remove filters
        </button>
      )}
    </>
  );
};

export default ToggleAndScrollPills;
