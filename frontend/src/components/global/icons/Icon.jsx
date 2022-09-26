const Icon = ({type, text, size, state}) => {
  const iconType = type ? ` icon--${type}` : '';
  const iconText = text ? ` icon--has-text` : '';
  const iconSize = size ? ` icon--${size}` : '';
  const iconState = state ? ` icon--${state}` : '';

  return (
    <div className={`icon${iconType}${iconText}${iconSize}${iconState}`}>
        
    </div>
  )
}

export default Icon