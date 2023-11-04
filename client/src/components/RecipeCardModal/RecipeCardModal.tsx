import React from 'react';
import ButtonFav from '../ButtonFav/ButtonFav';
import ButtonCart from '../ButtonCart/ButtonCart';
import TimingTag from '../TimingTag/TimingTag';
import Tabs from '../Tabs/Tabs';

type RecipeCardModalProps = {
	imageUrl: any;
	name: string;
};

const RecipeCardModal = ({ imageUrl, name }: RecipeCardModalProps) => {
	return (
		<div>
			<div className="relative">
				<div
					className="bg-cover bg-center h-80"
					style={{ backgroundImage: `url(${imageUrl})` }}
				/>
				<div className="absolute bottom-0 left-0 right-0 m-4 p-4 md:right-auto md:w-2/3 bg-white border-2 border-green-500 flex flex-row items-center justify-between">
					<div>
						<h2>{name}</h2>
						<h3>Created by TedBrisket</h3>
					</div>
					<div>Add to menu</div>
				</div>
			</div>
			<div className="p-4">
				<Tabs
					tabTitleOne="Ingredients"
					tabTitleTwo="Instructions"
					tabContentOne={<div>Hello</div>}
					tabContentTwo={<div>Hello 2</div>}
				/>
			</div>
		</div>
	);
};

export default RecipeCardModal;
