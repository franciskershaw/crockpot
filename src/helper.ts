import { IShoppingListItem, User } from '@/types/types';

export const createConfig = (user: User) => {
	return {
		headers: {
			Authorization: `Bearer ${user.accessToken}`,
			'Content-Type': 'application/json',
		},
	};
};

export function combineArrays(
	shoppingList: IShoppingListItem[],
	extraItems: IShoppingListItem[],
): IShoppingListItem[] {
	const tempStorage: { [key: string]: IShoppingListItem } = {};

	// Helper function to process each item
	const processItem = (item: IShoppingListItem, isExtra: boolean) => {
		const key = item.item._id + item.unit;
		if (tempStorage[key]) {
			tempStorage[key].quantity += item.quantity;
			if (isExtra) tempStorage[key].extra = true;
		} else {
			tempStorage[key] = { ...item };
			if (isExtra) tempStorage[key].extra = true;
		}
	};

	shoppingList.forEach((item) => processItem(item, false));
	extraItems.forEach((item) => processItem(item, true));

	const combinedArray = Object.values(tempStorage).filter(
		(item) => item.quantity !== 0,
	);

	return combinedArray;
}
