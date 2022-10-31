import Button from '../buttons/Button';
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
      <div className='bg-grey-bg/80 py-4 sticky top-[68px] z-1 shadow-bottom'>
        <form
          action=""
          className="form px-4">
          <div className="form__input !flex-row items-center">
            <label htmlFor="search" className="invisible w-0 h-0">
              Search for a recipe
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search for a recipe"
              // value={searchValue}
              // onChange={onChangeSearchBar}
              className="w-full !border-purple"
            />
          </div>
        </form>
        {checkedPills.length > 0 && (
          <>
            <ul className={`pills pills--scroll ${scrollPillType} bg-black/20 my-2`}>
              {checkedPills.map((pill, index) => (
                <li
                  onClick={() => removeScrollPills(pill)}
                  key={`checkedPill_${index}`}>
                  {pill.name}
                </li>
              ))}
            </ul>
            <div className='text-center'>
              <Button 
                onClick={onSubmit}
                type={"secondary"} 
                text={"Apply filters"} 
                tooltip={checkedPills.length}
                classes={"!py-1"}>
              </Button>
            </div>
          </>
        )}
      </div>
      <ul
        ref={togglePillsList}
        className={`pills pills--toggle ${togglePillType} text-center p-4`}>
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
    </>
  );
};

export default ToggleAndScrollPills;
