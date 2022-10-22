import { useState } from 'react';

const ScrollPills = ({type}) => {
    const [pills, setPills] = useState([
      'Orange',
      'Banana',
      'Apple',
      'Purple',
      'Big',
      'Money',
    ]);
  
    const removePill = (index) => {
      const newPills = pills.filter((_, i) => i !== index);
      setPills(newPills);
    };

    const pillType = type ? ` scroll-pills--${type}` : ''; // Primary, secondary

    return (
      <ul className={`pills scroll-pills${pillType}`}>
          {pills.map((pill, index) => (
            <li key={`pill_${index}`} onClick={() => removePill(index)}>{pill}</li>
          ))}
      </ul>
    )
  }
  
  export default ScrollPills