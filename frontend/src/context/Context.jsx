import { createContext } from 'react';

const Context = createContext();

export function ContextProvider({ children }) {

	return (
		<Context.Provider value={'hello from context'}>
			{children}
		</Context.Provider>
	)
}

export default Context;