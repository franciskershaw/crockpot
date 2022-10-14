import { createContext } from 'react';

const Context = createContext();

export function ContextProvider({ children }) {
	const headerHeight = "200px"

	return (
		<Context.Provider value={{
			headerHeight
		}}>
			{children}
		</Context.Provider>
	)
}

export default Context;