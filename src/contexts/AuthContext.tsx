import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession()

type UserProps = {
  name: string
  avatarURL: string
}

export interface AuthContextDataProps {
  user: UserProps
  isUserLoading: boolean
  signIn: () => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)
  
  const [ request, response, promptAsync ] = Google.useAuthRequest({
    clientId: '261923069993-laj726s55pkcn5phr8ghvkpc8en9e7b1.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })
  
  const signIn = async () => {
    try {
      setIsUserLoading(true)
      await promptAsync()

    } catch (error) {
      console.log(error)
      throw error

    } finally {
      setIsUserLoading(false)
    }
  }

  const signInWithGoogle = async (access_token: string) => {
    try {
      setIsUserLoading(true)

      const tokenResponse = await api.post('/users', {access_token})
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)
      
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}