import {
	FaCarrot,
	FaCheese,
	FaCookieBite,
	FaFish,
	FaLemon,
	FaPepperHot,
	FaQuestion,
	FaToiletPaper,
	FaWineGlass,
} from 'react-icons/fa';
import { FaDrumstickBite, FaJar } from 'react-icons/fa6';

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
