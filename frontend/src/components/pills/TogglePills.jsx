const TogglePills = ({name, type}) => {
    const pills = [
      'Orange',
      'Banana',
      'Apple',
      'Purple',
      'Big',
      'Money',
    ];

    const pillType = type ? ` toggle-pills--${type}` : ''; // Primary, secondary
  
    return (
      <ul className={`pills toggle-pills${pillType} text-center`}>
        {pills.map((pill, index) => (
          <li key={`pill_${index}`}>
            <input type="checkbox" id={`${name}_${pill}`} value={pill}/>
            <label htmlFor={`${name}_${pill}`}>{pill}</label>
          </li>
        ))}
      </ul>
    )
  }
  
  export default TogglePills