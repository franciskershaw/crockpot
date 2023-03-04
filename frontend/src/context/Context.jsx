import { createContext } from 'react';
const Context = createContext();

export function ContextProvider({ children }) {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
}

export default Context;
