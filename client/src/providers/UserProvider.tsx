import { User } from '@5rdb/api'
import { createContext, ReactNode, useEffect, useState, useContext } from 'react'
import { useQuery } from 'react-query'
import { privateApi } from '../api'
import { Queries } from '../components/HeaderBar'

export const UserContext = createContext<{
  currentUser: User | undefined,
  setCurrentUser: (currentUser: User | undefined) => void,
}>
({
  currentUser: undefined, 
  setCurrentUser: () => {console.log("UserContext not initialized.")}
})

export function UserProvider(props: { children: ReactNode }): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  useQuery(
    Queries.USER,
    () => {
      console.log("Calling users/me")
      privateApi.User.current()
        .then((user) => setCurrentUser(user.data()))
    },
  )

  return (
    <UserContext.Provider
      value={{currentUser: currentUser, setCurrentUser: setCurrentUser}}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  const currentUser = useContext(UserContext);
  return currentUser;
}
