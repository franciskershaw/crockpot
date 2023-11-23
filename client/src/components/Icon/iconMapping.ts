import {
	FaFish,
	FaPepperHot,
	FaCarrot,
	FaCookieBite,
	FaWineGlass,
	FaLemon,
	FaCheese,
	FaToiletPaper,
	FaQuestion,
} from 'react-icons/fa';
import { FaJar, FaDrumstickBite } from 'react-icons/fa6';

const iconMapping: { [key: string]: React.ElementType } = {
	faFish: FaFish,
	faCookieBite: FaCookieBite,
	faDrumstickBite: FaDrumstickBite,
	faWineGlass: FaWineGlass,
	faLemon: FaLemon,
	faPepperHot: FaPepperHot,
	faCheese: FaCheese,
	faCarrot: FaCarrot,
	faJar: FaJar,
	faToiletPaper: FaToiletPaper,
	faQuestion: FaQuestion,
};

export default iconMapping;
