import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";
import { useContext } from "react";

export const useAuth = (): AuthContextDataProps => {
  const context = useContext(AuthContext)

  return context
}