const TogglePills = ({name, type}) => {
    const pillType = type ? ` toggle-pills--${type}` : ''; // Primary, secondary
  
    return (
      <ul className={`pills toggle-pills${pillType} text-center`}>
        <li>
          <input type="checkbox" id={`${name}_almonds`} value="almonds"/>
          <label htmlFor={`${name}_almonds`}>Almonds</label>
        </li>
        <li>
          <input type="checkbox" id="bananas" value="bananas"/>
          <label htmlFor="bananas">bananas</label>
        </li>
        <li>
          <input type="checkbox" id="cranberries" value="cranberries"/>
          <label htmlFor="cranberries">cranberries</label>
        </li>
        <li>
          <input type="checkbox" id="diamonds" value="diamonds"/>
          <label htmlFor="diamonds">diamonds</label>
        </li>
        <li>
          <input type="checkbox" id="electricity" value="electricity"/>
          <label htmlFor="electricity">electricity</label>
        </li>
        <li>
          <input type="checkbox" id="flames" value="flames"/>
          <label htmlFor="flames">flames</label>
        </li>
        <li>
          <input type="checkbox" id="grandma" value="grandma"/>
          <label htmlFor="grandma">grandma</label>
        </li>
        <li>
          <input type="checkbox" id="house" value="house"/>
          <label htmlFor="house">house</label>
        </li>
      </ul>
    )
  }
  
  export default TogglePills