// /* eslint-disable react-refresh/only-export-components */
// import { ReactNode, createContext, useContext, useState, FC } from 'react';

// interface SessionContextType {
//   sessionId: string | null;
//   setSessionId: (id: string) => void;
// }

// interface SessionProviderProps {
//   children: ReactNode;
// }
// const SessionContext = createContext<SessionContextType | undefined>(undefined);

// export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
//   const [sessionId, setSessionId] = useState<string>('');

//   return <SessionContext.Provider value={{ sessionId, setSessionId }}>{children}</SessionContext.Provider>;
// };

// export const useSession = (): SessionContextType => {
//   const context = useContext(SessionContext);
//   if (!context) {
//     throw new Error();
//   }
//   return context;
// };
