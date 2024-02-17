'use client';

import { AiOutlinePlus } from 'react-icons/ai';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import Icon from '@/components/Icon/Icon';
import OpenModal from '@/components/Modal/OpenModal';

function ButtonAddRecipe() {
	const { user } = useUser();

	const pathname = usePathname();

	if (!user || pathname === '/admin') {
		return null;
	}

	return (
		<>
			<OpenModal
				styles="z-addRecipe fixed m-4 right-0 bottom-[85px] md:bottom-0 cursor-pointer lg:hidden"
				name="AddRecipe"
			>
				<Icon size="xl" type="primary" border>
					<AiOutlinePlus />
				</Icon>
			</OpenModal>
		</>
	);
}
export default ButtonAddRecipe;
