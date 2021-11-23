import { User } from '@5rdb/api'
import { createContext, ReactNode, useState, useContext } from 'react'
import { useQuery } from 'react-query'
import { privateApi } from '../api'
import { Queries } from '../components/HeaderBar'
import { getToken } from '../utils/auth'

export const UserContext = createContext<{
  currentUser: User | undefined
  setCurrentUser: (currentUser: User | undefined) => void
  isDataAdmin: () => boolean
  isRulesAdmin: () => boolean
  isLoggedIn: () => boolean
}>({
  currentUser: undefined,
  setCurrentUser: () => {
    console.log('UserContext not initialized.')
  },
  isDataAdmin: () => false,
  isRulesAdmin: () => false,
  isLoggedIn: () => false,
})

export function UserProvider(props: { children: ReactNode }): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)
  const isDataAdmin = () => {
    return currentUser?.roles.includes('data_admin') || false
  }
  const isRulesAdmin = () => {
    return currentUser?.roles.includes('rules_admin') || false
  }
  const isLoggedIn = () => {
    return currentUser !== undefined
  }

  useQuery(Queries.USER, () => {
    const token = getToken()
    if (token) {
      privateApi.User.current().then((user) => setCurrentUser(user.data()))
    }
  })

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
        isDataAdmin: isDataAdmin,
        isRulesAdmin: isRulesAdmin,
        isLoggedIn: isLoggedIn,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  const currentUser = useContext(UserContext)
  return currentUser
}
