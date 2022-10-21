const TogglePills = ({type, outline, noClick}) => {
    const pillType = type ? ` toggle-pills--${type}` : ''; // Primary, secondary
  
    return (
      <ul className={`toggle-pills${pillType} text-center`}>
        <li className="pill">
          <input type="checkbox" id="almonds" value="almonds"/>
          <label htmlFor="almonds">Almonds</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="bananas" value="bananas"/>
          <label htmlFor="bananas">bananas</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="cranberries" value="cranberries"/>
          <label htmlFor="cranberries">cranberries</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="diamonds" value="diamonds"/>
          <label htmlFor="diamonds">diamonds</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="electricity" value="electricity"/>
          <label htmlFor="electricity">electricity</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="flames" value="flames"/>
          <label htmlFor="flames">flames</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="grandma" value="grandma"/>
          <label htmlFor="grandma">grandma</label>
        </li>
        <li className="pill">
          <input type="checkbox" id="house" value="house"/>
          <label htmlFor="house">house</label>
        </li>
      </ul>
    )
  }
  
  export default TogglePills