const TogglePills = ({ name, type, data }) => {
	const pillType = type ? ` pills--toggle--${type}` : ''; // Primary, secondary

	let pills = [];

	for (let i = 0; i < data.length; i++) {
		const itemName = data[i].item.name;
		const itemQuantity = Math.round(data[i].quantity * 100) / 100;
		let itemUnit = data[i].unit;

		if (itemUnit == 'cans') {
			itemUnit = ' cans';
		}

		pills.push(itemName.concat(' x ', itemQuantity, itemUnit));
	}

	return (
		<ul className={`pills pills--toggle${pillType} text-center`}>
			{pills &&
				pills.map((pill, index) => (
					<li key={`pill_${index}`}>
						<input type="checkbox" id={`${name}_${pill}`} value={pill} />
						<label htmlFor={`${name}_${pill}`}>{pill}</label>
					</li>
				))}
		</ul>
	);
};

export default TogglePills;
